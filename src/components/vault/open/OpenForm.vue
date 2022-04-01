<template>
  <v-form ref="form" class="ma-0 pa-4" autocomplete="off">
    <div class="text-3 mb-4 text-center greyscale_1--text">
      Please Input generate amount
    </div>

    <base-form-input
      :amount.sync="bindDebtAmount"
      :asset="meta.debtAsset"
      :balance="meta.suggest"
      :rules="rulesDebt"
      :leftLabel="$t('common.suggest')"
      :placeholder="$t('form.mint-amount')"
    />

    <collateral-ratio-slider
      :collateral-id="meta.collateralId"
      :ratio="meta.changedRatio"
      :risk="meta.changedRisk"
    />

    <open-vault-action
      :collateral="collateral"
      :deposit="bindDepositAmount"
      :mint="bindDebtAmount"
      :disabled="validate.disabled"
      @back="handleBackStep"
      @success="handleSuccess"
    />
  </v-form>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop, PropSync, Ref } from "vue-property-decorator";
import OpenAppBar from "./OpenAppBar.vue";
import OpenVaultAction from "./OpenVaultAction.vue";
import BaseFormInput from "@/components/base/FormInput.vue";
import CollateralRatioSlider from "./../CollateralRatioSlider.vue";
import { RISK } from "~/enums";
import BigNumber from "bignumber.js";
import { toPrecision } from "@foxone/utils/number";

@Component({
  components: {
    OpenAppBar,
    OpenVaultAction,
    BaseFormInput,
    CollateralRatioSlider,
  },
})
export default class OpenForm extends Vue {
  @Prop() collateral!: API.Collateral;

  @PropSync("depositAmount") bindDepositAmount!: string;

  @PropSync("debtAmount") bindDebtAmount!: string;

  @Ref("form") form!: any;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { format } = this.$utils.number;

    const depositNum = Number(this.bindDepositAmount);
    const mintNum = Number(this.bindDebtAmount);

    const {
      collateralizationRatio,
      liquidationPrice,
      liquidationPriceText,
      maxAvailable,
    } = getters.openVaultPrediction(depositNum, mintNum, this.collateral);
    const marketFields = getters.getMarketFields(this.collateral?.id);

    const changedRatio =
      +this.bindDebtAmount &&
      (+this.bindDepositAmount * marketFields.collateralPrice) /
        +this.bindDebtAmount;

    const changedRisk = this.$utils.collateral.getRiskLevelMeta(
      changedRatio,
      marketFields.minimumRatio
    );

    const suggest = toPrecision({
      n: maxAvailable * 0.6,
      dp: 8,
      mode: BigNumber.ROUND_DOWN,
    });
    return {
      ...marketFields,
      collateralId: this.collateral?.id ?? "",
      collateralizationRatio,
      liquidationPrice,
      liquidationPriceText,
      currentDepositPrice: format({ n: this.collateral?.price || "0" }),
      suggest,
      changedRatio,
      changedRisk,
    };
  }

  handleBackStep() {
    this.$emit("back");
  }

  handleSuccess() {
    this.form.reset();
    this.$uikit.toast.success({
      message: this.$t("common.action-success") + "",
    });
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
        const max = this.$utils.collateral?.maxAvailable(this.collateral);
        return (
          +v <= max ||
          this.$t("validate.max-debt", {
            amount: this.$utils.number.toPrecision({ n: max }),
            symbol: this.meta.debtSymbol,
          })
        );
      },
      (v: string) =>
        +v >= Number(this.collateral?.dust) ||
        this.$t("validate.minimum-debt", {
          amount: this.collateral?.dust,
          symbol: this.meta.debtSymbol,
        }),
      (v: string) => {
        const ratio =
          +v && (+this.bindDepositAmount * +this.meta.currentDepositPrice) / +v;
        const risk = this.$utils.vault.getRiskLevelMeta(
          ratio,
          +this.collateral?.mat
        );
        switch (risk.value) {
          case RISK.HIGH:
            if (
              Number(this.meta.collateralizationRatio) <
              Number(this.collateral?.mat)
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
      const max = this.$utils.collateral?.maxAvailable(this.collateral);
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
      if (ma < Number(this.collateral?.dust)) {
        // mint 小于最小值
        return {
          disabled: true,
          type: "error",
          tip: this.$t("validate.minimum-debt", {
            amount: this.collateral?.dust,
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
        +this.collateral?.mat
      );
      switch (risk.value) {
        case RISK.HIGH:
          if (
            Number(this.meta.collateralizationRatio) <
            Number(this.collateral?.mat)
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
