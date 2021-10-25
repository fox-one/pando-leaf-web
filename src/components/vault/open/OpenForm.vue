<template>
  <div class="ma-0 pa-4 pb-8">
    <div class="text-3 mb-4 greyscale_1--text">
      {{ $t("form.title.deposit") }}
    </div>

    <base-form-input
      :amount.sync="depositAmount"
      :asset="deposit"
      :placeholder="$t('form.hint.deposit-amount')"
    />

    <div class="text-3 mt-8 mb-4 greyscale_1--text">
      {{ $t("form.title.generate") }}
    </div>

    <base-form-input
      :amount.sync="mintAmount"
      :asset="mint"
      :balance="meta.maxAvailableText"
      :leftLabel="$t('form.info.max-available-to-generate')"
      :placeholder="$t('form.hint.mint-amount')"
    />

    <asset-range-input
      v-model="mintAmount"
      :label="$t('form.hint.mint-amount')"
      :assets="[mint]"
      :asset.sync="mint"
      :selectable="false"
      :show-slider-tips="false"
      :precision="precision"
      :inputTips="mintInputTips"
      :max="+meta.maxAvailable"
      :btn-text="$t('form.open.button.confirm')"
      :disabled-btn="validate.disabled"
      :error="validate.tip"
      @click:button="requestConfirm"
      color="primary"
    >
      <template v-slot:slider>
        <risk-slider
          v-model="percent"
          :tips="sliderTips"
          :scale="scale"
          disabled
          ref="slider"
        />
      </template>
    </asset-range-input>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Watch } from "vue-property-decorator";
import OpenAppBar from "@/components/vault/open/OpenAppBar.vue";
import RiskWarnings from "@/components/vault/open/RiskWarnings.vue";
import BaseFormInput from "@/components/base/FormInput.vue";
import BigNumber from "bignumber.js";
import { Get } from "vuex-pathify";
import { RISK } from "~/enums";

@Component({
  components: {
    OpenAppBar,
    RiskWarnings,
    BaseFormInput,
  },
})
export default class GenerateVault extends Vue {
  @Get("collateral/getCollateralById") getCollateral;
  @Get("asset/getAssetById") getAssetById;
  @Get("asset/getWalletAssetById") getWalletAssetById;
  @Get("auth/isLogged") isLogged;

  loading = true;

  depositAmount = "";
  depositTips = false;
  mintAmount = "";
  mintTips = false;
  selectable = true;
  precision = 8;
  percent = 0;
  depositInputTips = {};
  mintInputTips = {};
  sliderTips = {};
  scale = {
    low: 0.6,
    mid: 0.2,
    high: 0.2,
  };
  riskInfo = {
    continue: {},
    confirm: {},
  };

  showSelectModal = false;
  showCModel = false;
  collateral = {} as API.Collateral;
  deposit = ({} as any) as API.Asset;
  mint = ({} as any) as API.Asset;

  get countdown() {
    return Math.round(
      +this.collateral?.mat * 100 - +this.meta.collateralizationRatio * 100 + 60
    );
  }

  get depositBalance() {
    return this.getWalletAssetById(this.deposit?.id)?.balance;
  }

  get mintBalance() {
    return this.getWalletAssetById(this.mint?.id)?.balance;
  }

  get depositSymbol() {
    return this.deposit?.symbol;
  }

  get mintSymbol() {
    return this.mint?.symbol;
  }

  get appbar() {
    return {
      show: false,
      back: true,
      align: "center",
      customTitle: this.collateral?.name,
    };
  }

  get title() {
    const t = this.$t("form.title.open", {
      name: this.collateral?.name,
    });
    return `${t}`;
  }

  get queryId() {
    return this.$route.query["id"];
  }

  handleCollateralChange(item: API.Collateral) {
    this.collateral = item;
  }

  get meta() {
    const depositNum = Number(this.depositAmount);
    const mintNum = Number(this.mintAmount);
    // 抵押率计算
    const collateralizationRatio =
      (depositNum * Number(this.collateral?.price)) / mintNum;
    let collateralizationRatioText = `${this.$utils.number.toFixed({
      n: collateralizationRatio * 100,
      p: 1,
    })}`;
    if (!this.$utils.number.isValid(collateralizationRatio)) {
      collateralizationRatioText = "-";
    }
    // 价格计算
    const liquidationPrice =
      (mintNum * Number(this.collateral?.mat || "0")) / depositNum;
    let liquidationPriceText = `${this.$utils.number.toPrecision({
      n: liquidationPrice,
    })}`;
    if (
      !this.$utils.number.isValid(liquidationPrice) ||
      liquidationPrice === 0
    ) {
      liquidationPriceText = `-`;
    }
    // fee
    const stabilityFee = this.$utils.number.toPrecision({
      n: (+this.collateral?.duty - 1) * 100,
    });
    // 该类型最大可用额
    const maxToGenerate = this.$utils.collateral?.maxAvailable(this.collateral);
    const maxToGenerateText = this.$utils.number.toPrecision({
      n: maxToGenerate,
    });
    // 实际最大可用
    let maxAvailable =
      (depositNum * Number(this.collateral?.price || "0")) /
        Number(this.collateral?.mat) || 0;
    if (maxAvailable > maxToGenerate) {
      maxAvailable = maxToGenerate;
    }
    const maxAvailableText = this.$utils.number.toPrecision({
      n: maxAvailable,
      dp: 8,
      mode: BigNumber.ROUND_DOWN,
    });
    return {
      collateralizationRatio,
      collateralizationRatioText,
      liquidationPrice: liquidationPriceText,
      currentDepositPrice: `${this.$utils.number.toPrecision({
        n: this.collateral?.price || "0",
      })}`,
      stabilityFee: this.$utils.number.toFixed({ n: stabilityFee, p: 1 }),
      maxToGenerate: maxToGenerateText,
      maxAvailable,
      maxAvailableText,
    };
  }

  // 表单校验
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
            symbol: this.mintSymbol,
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
            symbol: this.mintSymbol,
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
              symbol: this.mintSymbol,
            }),
          };
        // 中风险区间
        case RISK.MEDIUM:
          return {
            disabled: false,
            type: "warning",
            tip: this.$t("form.validate.medium-risk", {
              symbol: this.mintSymbol,
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

  get infos() {
    const ratio =
      +this.mintAmount &&
      (+this.depositAmount * +this.meta.currentDepositPrice) / +this.mintAmount;

    const risk = this.$utils.vault.getRiskLevelMeta(
      ratio,
      +this.collateral?.mat
    );
    return [
      {
        title: this.$t("form.info.liquidation-price"), // mint * mat / deposit
        value: this.meta.liquidationPrice,
        valueUnit: `${this.mint?.symbol}`,
        hint: this.$t("form.tooltip.liquidation-price"),
      },
      {
        title: this.$t("form.info.current-symbol-price", {
          symbol: `${this.deposit?.symbol}/${this.mint?.symbol}`,
        }),
        value: this.meta.currentDepositPrice,
        valueUnit: `${this.mint?.symbol}`,
      },
      {
        title: this.$t("form.info.collateralization-ratio"), // deposit * price / mint
        value: this.meta.collateralizationRatioText,
        valueUnit: "%",
        valueColor: risk.color,
        hint: this.$t("form.tooltip.collateralization-ratio"),
      },
      {
        title: this.$t("form.info.minimum-ratio"),
        value: this.$utils.number.toFixed({
          n: +this.collateral?.mat * 100,
          p: 2,
        }),
        valueUnit: "%",
        hint: this.$t("form.tooltip.minimum-ratio"),
      },
      {
        title: this.$t("form.info.market-debt-ceiling"), // line- debt
        value: this.meta.maxToGenerate,
        valueUnit: this.mint?.symbol,
      },
      {
        title: this.$t("form.info.stability-fee"),
        value: this.meta.stabilityFee,
        valueUnit: "%",
        hint: this.$t("form.tooltip.stability-fee"),
      },
    ];
  }

  @Watch("mintAmount")
  onMintChanged(newVal) {
    const newPercent = Number(newVal) / Number(this.meta.maxAvailable);
    if (this.$utils.number.isValid(newPercent)) {
      this.percent = newPercent * 100;
    }
    if (this.percent > 100) this.percent = 100;
    if (this.percent < 0) this.percent = 0;
    this.calcSliderTips();
    this.$set(
      this.mintInputTips,
      "tipRight",
      `≈ $ ${this.$utils.number.toPrecision({
        n: this.getAssetById?.(this.collateral?.dai)?.price * +this.mintAmount,
      })}`
    );
    (this.$refs.riskInfo as any)?.resetTimer?.();
  }

  @Watch("collateral")
  onCollateralChange(newVal, oldVal) {
    if (newVal?.id === oldVal?.id) return;
    this.$router.replace({
      query: {
        id: newVal.id,
      },
    });
    this.deposit = this.getAssetById(newVal?.gem);
    this.mint = this.getAssetById(newVal?.dai);
    this.updateWalletAsset(newVal);
    this.updateTips();
    this.updateTipsAssets();
  }

  @Watch("depositAmount")
  onDepositChange() {
    this.$set(
      this.depositInputTips,
      "tipRight",
      `≈ $ ${this.$utils.number.toPrecision({
        n:
          this.getAssetById?.(this.collateral?.gem)?.price *
          +this.depositAmount,
      })}`
    );
    this.$set(
      this.mintInputTips,
      "amount",
      this.$utils.number.toPrecision({
        n: this.meta.maxAvailable * this.scale.low,
      })
    );
    (this.$refs.riskInfo as any)?.resetTimer?.();
  }

  intervalid = 0;
  mounted() {
    if (!this.queryId) {
      this.$uikit.toast.error({
        message: "Collateral ID not found.",
      });
      this.$router.replace("/");
    }
    this.follow_id = this.$utils.helper.uuidV4();
    this.collateral = this.getCollateral(this.queryId);
    this.deposit = this.getAssetById(this.collateral?.gem);
    this.mint = this.getAssetById(this.collateral?.dai);
    this.updateWalletAsset();
    this.intervalid = (setInterval(async () => {
      this.updateWalletAsset();
      this.collateral = this.getCollateral(this.queryId);
      this.updateTipsAssets();
    }, 5000) as any) as number;

    this.riskInfo = {
      continue: {
        title: this.$t("risk.info.continue.title"),
        highlights: [
          this.$t("risk.info.continue.highlight-collateral-rate"),
          this.$t("risk.info.continue.highlight-liquidation-ratio"),
        ],
        btn_cancel: this.$t("risk.info.continue.btn-cancel"),
        btn_continue: this.$t("risk.info.continue.btn-continue"),
      },
      confirm: {
        title: this.$t("risk.info.confirm.title"),
        content: this.$t("risk.info.confirm.content"),
        btn_cancel: this.$t("risk.info.confirm.btn-cancel"),
        btn_confirm: this.$t("risk.info.confirm.btn-confirm"),
      },
    };
    this.updateTips();
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }

  updateTipsAssets() {
    this.onDepositChange();
    this.onMintChanged(this.mintAmount);
  }

  updateTips() {
    const suggestAmount = this.$utils.number.toPrecision({
      n: this.meta.maxAvailable * this.scale.low,
    });
    this.mintInputTips = this.isLogged
      ? {
          amount: suggestAmount,
          amountSymbol: this.mintSymbol,
          tipLeft: this.$t("common.suggest"),
          tipRight: `≈ $ 0`,
        }
      : {
          tipLeft: this.$createElement("connect-wallet", {
            on: {
              click: () => this.requestLogin(),
            },
            props: {
              text: this.$t("connect.wallet"),
            },
          }),
        };

    this.depositInputTips = this.isLogged
      ? {
          amount: +this.depositBalance,
          amountSymbol: this.depositSymbol,
          tipLeft: this.$t("form.info.wallet-balance"),
          tipRight: `≈ $ 0`,
        }
      : {
          tipLeft: this.$createElement("connect-wallet", {
            on: {
              click: () => this.requestLogin(),
            },
            props: {
              text: this.$t("connect.wallet"),
            },
          }),
        };

    this.calcSliderTips();
  }

  destroyed() {
    clearInterval(0);
    clearInterval(this.intervalid);
  }

  toast() {
    this.showSelectModal = !this.showSelectModal;
  }

  updateWalletAsset(collateral = this.collateral) {
    this.$utils.asset.loadWalletAsset(this, collateral?.gem);
    this.$utils.asset.loadWalletAsset(this, collateral?.dai);
  }

  requestLogin() {
    this.$utils.account.openAuth(this);
  }

  requestConfirm() {
    if (
      (this.meta.collateralizationRatio - Number(this.collateral?.mat)) * 100 <
      61
    ) {
      this.showCModel = true;
      return;
    }
    this.confirm();
  }

  follow_id = "";
  async confirm() {
    this.follow_id = this.$utils.helper.uuidV4();
    const request = {
      user_id: this.$store.getters["account/userId"],
      follow_id: this.follow_id,
      amount: this.depositAmount,
      asset_id: this.deposit?.id,
      parameters: [
        "bit",
        "31",
        "uuid",
        this.collateral?.id,
        "decimal",
        this.$utils.number.toPrecision({ n: this.mintAmount, dp: 8 }),
      ],
    } as API.ActionPayload;
    this.$utils.payment.requestPayment(this, request, {
      success: (result) => {
        // todo
        this.$uikit.toast.success({ message: result });
      },
      error: () => {
        //todo
      },
    });
  }

  calcSliderTips() {
    const ratio =
      +this.mintAmount &&
      (+this.depositAmount * +this.meta.currentDepositPrice) / +this.mintAmount;

    const risk = this.$utils.vault.getRiskLevelMeta(
      ratio,
      +this.collateral?.mat
    );

    let riskText = "low";
    switch (risk.value) {
      case RISK.HIGH:
        riskText = "high";
        break;
      case RISK.MEDIUM:
        riskText = "mid";
        break;
    }
    this.sliderTips = {
      tip: this.$t("form.hint.generate-ration"),
      highlight: `${this.$utils.number.toPercent({
        n: this.$utils.number.toPrecision({
          n:
            this.meta.collateralizationRatio < 0
              ? 0
              : this.meta.collateralizationRatio,
          dp: 3,
          mode: BigNumber.ROUND_DOWN,
        }),
        symbol: false,
        dp: 1,
      })}, ${this.$t("form.hint.risk-level", {
        level: this.$t(`form.hint.risk-level-${riskText}`),
      })}`,
    };
  }
}
</script>
<style lang="scss" scoped></style>
