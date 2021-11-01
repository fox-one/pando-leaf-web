<template>
  <div class="ma-0 pa-4 pb-8">
    <div class="text-3 mb-4 greyscale_1--text">
      {{ $t("form.title.deposit") }}
    </div>

    <base-form-input
      :amount.sync="depositAmount"
      :asset="meta.collateralAsset"
      :placeholder="$t('form.hint.deposit-amount')"
    />

    <div class="text-3 mt-8 mb-4 greyscale_1--text">
      {{ $t("form.title.generate") }}
    </div>

    <base-form-input
      :amount.sync="mintAmount"
      :asset="meta.debtAsset"
      :balance="meta.maxAvailableText"
      :leftLabel="$t('form.info.max-available-to-generate')"
      :placeholder="$t('form.hint.mint-amount')"
    />

    <base-risk-slider class="mt-6" :progress="meta.progress" />

    <open-vault-action
      :collateral="collateral"
      :deposit="depositAmount"
      :mint="mintAmount"
      :disabled="validate.disabled"
    />
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import OpenAppBar from "./OpenAppBar.vue";
import OpenVaultAction from "./OpenVaultAction.vue";
import BaseFormInput from "@/components/base/FormInput.vue";
import BaseRiskSlider from "@/components/base/RiskSlider.vue";
import BigNumber from "bignumber.js";
import { RISK } from "~/enums";

@Component({
  components: {
    OpenAppBar,
    OpenVaultAction,
    BaseFormInput,
    BaseRiskSlider,
  },
})
export default class OpenForm extends Vue {
  @Prop() collateral!: API.Collateral;

  depositAmount = "";

  mintAmount = "";

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { toPercent, format, isValid } = this.$utils.number;

    const depositNum = Number(this.depositAmount);
    const mintNum = Number(this.mintAmount);

    const {
      collateralizationRatio,
      liquidationPrice,
      stabilityFee,
      maxToGenerate,
      maxAvailable,
    } = getters.getPredictions(depositNum, mintNum, this.collateral);
    const marketFields = getters.getMarketFields(this.collateral?.id);

    // 抵押率计算
    let collateralizationRatioText = toPercent({
      n: collateralizationRatio,
      dp: 1,
    });
    if (!isValid(collateralizationRatio)) {
      collateralizationRatioText = "-";
    }
    // 价格计算
    let liquidationPriceText = format({ n: liquidationPrice });
    if (!isValid(liquidationPrice) || liquidationPrice === 0) {
      liquidationPriceText = `-`;
    }
    // fee
    const stabilityFeeText = toPercent({ n: stabilityFee });
    // 该类型最大可用额
    const maxToGenerateText = format({ n: maxToGenerate });
    // 实际最大可用
    const maxAvailableText = format({
      n: maxAvailable,
      max_dp: 8,
      mode: BigNumber.ROUND_DOWN,
    });
    const progress = (mintNum / maxAvailable) * 100;
    return {
      ...marketFields,
      collateralizationRatio,
      collateralizationRatioText,
      liquidationPrice,
      liquidationPriceText,
      currentDepositPrice: format({ n: this.collateral?.price || "0" }),
      stabilityFeeText,
      maxToGenerate,
      maxToGenerateText,
      maxAvailable,
      maxAvailableText,
      progress,
    };
  }

  // todo 表单校验
  get validate() {
    if (this.depositAmount === "" && this.mintAmount === "") {
      return {
        disabled: true,
        type: "info",
        tip: null,
      };
    }
    if (
      (this.depositAmount === "" && this.mintAmount !== "") ||
      (this.depositAmount !== "" && this.mintAmount === "")
    ) {
      return {
        disabled: true,
        type: "error",
        tip: null,
      };
    }
    if (this.depositAmount !== "" && this.mintAmount !== "") {
      const ma = Number(this.mintAmount || "0");
      const max = this.$utils.collateral?.maxAvailable(this.collateral);
      if (ma > max) {
        // mint 大于最大值
        return {
          disabled: true,
          type: "error",
          tip: this.$t("form.validate.max-debt", {
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
          tip: this.$t("form.validate.minimum-debt", {
            amount: this.collateral?.dust,
            symbol: this.meta.debtSymbol,
          }),
        };
      }
      //todo 这里要检查逻辑 || 重写
      const ratio =
        +this.mintAmount &&
        (+this.depositAmount * +this.meta.currentDepositPrice) /
          +this.mintAmount;

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
              tip: this.$t("form.validate.below-liquidation-rate"),
            };
          }
          // 抵押率高于清算线，处于高风险区间
          return {
            disabled: false,
            type: "error",
            tip: this.$t("form.validate.high-risk", {
              symbol: this.meta.debtSymbol,
            }),
          };
        // 中风险区间
        case RISK.MEDIUM:
          return {
            disabled: false,
            type: "warning",
            tip: this.$t("form.validate.medium-risk", {
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
