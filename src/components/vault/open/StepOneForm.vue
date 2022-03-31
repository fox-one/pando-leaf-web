<template>
  <v-form ref="form" class="ma-0 pa-4" autocomplete="off">
    <div class="text-3 mb-4 text-center greyscale_1--text">
      Please input deposit amount
    </div>

    <step-one-form-input
      :amount.sync="bindDepositAmount"
      :asset="asset"
      :rules="rulesDeposit"
      :placeholder="$t('form.deposit-amount')"
      @select="handleCollateralSelect"
    />

    <step-one-action
      :collateral="collateral"
      :deposit="bindDepositAmount"
      :mint="bindDebtAmount"
      :disabled="validate.disabled"
      @success="handleSuccess"
    />
  </v-form>
</template>

<script lang="ts" scoped>
import { Vue, Component, PropSync, Ref } from "vue-property-decorator";
import StepOneAction from "./StepOneAction.vue";
import StepOneFormInput from "./StepOneFormInput.vue";
import BaseRiskSlider from "@/components/base/RiskSlider.vue";
import { RISK } from "~/enums";
import BigNumber from "bignumber.js";

@Component({
  components: {
    StepOneFormInput,
    BaseRiskSlider,
    StepOneAction,
  },
})
export default class StepOneForm extends Vue {
  @PropSync("collateral") bindCollateral!: API.Collateral;

  @PropSync("depositAmount") bindDepositAmount!: string;

  @PropSync("debtAmount") bindDebtAmount!: string;

  @Ref("form") form!: any;

  get asset() {
    const getters = this.$store.getters as Getter.GettersTree;
    return getters["asset/getAssetById"](this.bindCollateral?.gem);
  }

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { format, toPrecision } = this.$utils.number;

    const depositNum = Number(this.bindDepositAmount);
    const mintNum = Number(this.bindDebtAmount);

    const {
      collateralizationRatio,
      liquidationPrice,
      liquidationPriceText,
      maxAvailable,
    } = getters.openVaultPrediction(depositNum, mintNum, this.bindCollateral);
    const marketFields = getters.getMarketFields(this.bindCollateral?.id);

    const progress = (mintNum / maxAvailable) * 100;

    const suggest = toPrecision({
      n: maxAvailable * 0.6,
      dp: 8,
      mode: BigNumber.ROUND_DOWN,
    });
    return {
      ...marketFields,
      collateralizationRatio,
      liquidationPrice,
      liquidationPriceText,
      currentDepositPrice: format({ n: this.bindCollateral?.price || "0" }),
      suggest,
      progress,
    };
  }

  handleSuccess() {
    this.form.reset();
    this.$uikit.toast.success({
      message: this.$t("common.action-success") + "",
    });
  }

  handleCollateralSelect(collateral: API.Collateral) {
    this.bindCollateral = collateral;
  }

  get rulesDeposit() {
    return [
      (v: string) => !!v || this.$t("common.amount-required"),
      (v: string) => +v > 0 || this.$t("common.amount-invalid"),
    ];
  }

  get rulesDebt() {
    return [
      (v: string) => !!v || this.$t("common.amount-required"),
      (v: string) => +v > 0 || this.$t("common.amount-invalid"),
      (v: string) => {
        const max = this.$utils.collateral?.maxAvailable(this.bindCollateral);
        return (
          +v <= max ||
          this.$t("validate.max-debt", {
            amount: this.$utils.number.toPrecision({ n: max }),
            symbol: this.meta.debtSymbol,
          })
        );
      },
      (v: string) =>
        +v >= Number(this.bindCollateral?.dust) ||
        this.$t("validate.minimum-debt", {
          amount: this.bindCollateral?.dust,
          symbol: this.meta.debtSymbol,
        }),
      (v: string) => {
        const ratio =
          +v && (+this.bindDepositAmount * +this.meta.currentDepositPrice) / +v;
        const risk = this.$utils.vault.getRiskLevelMeta(
          ratio,
          +this.bindCollateral?.mat
        );
        switch (risk.value) {
          case RISK.HIGH:
            if (
              Number(this.meta.collateralizationRatio) <
              Number(this.bindCollateral?.mat)
            ) {
              return this.$t("validate.below-liquidation-rate");
            }
            return this.$t("validate.high-risk", {
              symbol: this.meta.debtSymbol,
            });
          case RISK.MEDIUM:
            return this.$t("validate.medium-risk", {
              symbol: this.meta.debtSymbol,
            });
          default:
            return true;
        }
      },
    ];
  }

  // todo 表单校验
  get validate() {
    if (this.bindDepositAmount === "" && this.bindDebtAmount === "") {
      return {
        disabled: true,
        type: "info",
        tip: null,
      };
    }
    if (
      (this.bindDepositAmount === "" && this.bindDebtAmount !== "") ||
      (this.bindDepositAmount !== "" && this.bindDebtAmount === "")
    ) {
      return {
        disabled: true,
        type: "error",
        tip: null,
      };
    }
    if (this.bindDepositAmount !== "" && this.bindDebtAmount !== "") {
      const ma = Number(this.bindDebtAmount || "0");
      const max = this.$utils.collateral?.maxAvailable(this.bindCollateral);
      if (ma > max) {
        // mint 大于最大值
        return {
          disabled: true,
          type: "error",
          tip: this.$t("validate.max-debt", {
            amount: this.$utils.number.toPrecision({ n: max }),
            symbol: this.meta.debtSymbol,
          }),
        };
      }
      if (ma < Number(this.bindCollateral?.dust)) {
        // mint 小于最小值
        return {
          disabled: true,
          type: "error",
          tip: this.$t("validate.minimum-debt", {
            amount: this.bindCollateral?.dust,
            symbol: this.meta.debtSymbol,
          }),
        };
      }
      //todo 这里要检查逻辑 || 重写
      const ratio =
        +this.bindDebtAmount &&
        (+this.bindDepositAmount * +this.meta.currentDepositPrice) /
          +this.bindDebtAmount;

      const risk = this.$utils.vault.getRiskLevelMeta(
        ratio,
        +this.bindCollateral?.mat
      );
      switch (risk.value) {
        case RISK.HIGH:
          if (
            Number(this.meta.collateralizationRatio) <
            Number(this.bindCollateral?.mat)
          ) {
            // 抵押率低于清算线
            return {
              disabled: true,
              type: "error",
              tip: this.$t("validate.below-liquidation-rate"),
            };
          }
          // 抵押率高于清算线，处于高风险区间
          return {
            disabled: false,
            type: "error",
            tip: this.$t("validate.high-risk", {
              symbol: this.meta.debtSymbol,
            }),
          };
        // 中风险区间
        case RISK.MEDIUM:
          return {
            disabled: false,
            type: "warning",
            tip: this.$t("validate.medium-risk", {
              symbol: this.meta.debtSymbol,
            }),
          };
        // 低风险区间
        case RISK.LOW:
          return {
            disabled: false,
            type: "info",
            tip: null,
          };
        // 抵押率 N/A
        default:
          return {
            disabled: true,
            type: "info",
            tip: null,
          };
      }
    }
    return {
      disabled: false,
      type: "info",
      tip: null,
    };
  }
}
</script>
