<template>
  <v-container class="pa-0">
    <f-app-bar
      v-bind="appbar"
      @back="handleBack"
      class="desktop-support market-app-bar"
    >
      <v-layout align-center justify-center @click="toast">
        <h4 class="mx-2">{{ appbar.title }}</h4>
        <v-icon>
          {{ $icons.mdiChevronDown }}
        </v-icon>
      </v-layout>
    </f-app-bar>
    <v-layout column class="ma-0 pa-4 pb-8 f-bg-greyscale-7">
      <div class="f-title-1 mb-4 f-greyscale-1">
        {{ $t("form.title.deposit") }}
      </div>
      <asset-range-input
        v-model="depositAmount"
        :label="$t('form.hint.deposit-amount')"
        :assets="[deposit]"
        :asset.sync="deposit"
        :selectable="false"
        :precision="precision"
        :inputTips="depositInputTips"
        :max="+depositBalance"
        :show-slider="false"
        :show-btn="false"
        color="primary"
      />
      <div class="f-title-1 mt-8 mb-4 f-greyscale-1">
        {{ $t("form.title.generate") }}
      </div>
      <asset-range-input
        v-model="mintAmount"
        :label="$t('form.hint.mint-amount')"
        :assets="[mint]"
        :asset.sync="mint"
        :selectable="false"
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
    </v-layout>

    <v-layout column class="my-4 f-bg-greyscale-7">
      <div class="mt-4 mx-4 f-title-1">{{ $t("form.predication") }}</div>
      <f-info-grid :window-size="2">
        <f-info-grid-item
          v-for="(item, ix) in infos"
          :key="ix"
          :index="ix"
          :title="item.title"
          :value="item.value"
          :value-unit="item.valueUnit"
          :value-color="item.valueColor"
          :value-custom-color="item.valueCustomColor"
          :hint="item.hint"
        ></f-info-grid-item>
      </f-info-grid>
    </v-layout>

    <prediction
      class="my-2"
      :collateral="collateral"
      :vault="vault"
      :amount="amount"
      :type="vaultStatsType"
    />

    <market-select-modal
      :show.sync="showSelectModal"
      :current.sync="collateral"
    />

    <risk-info
      v-model="showCModel"
      :custom-text="riskInfo"
      :impact="`${(meta.collateralizationRatio * 100).toFixed(2)}%`"
      :countdown="countdown"
      @confirm="confirm"
      ref="riskInfo"
    />

    <div class="mx-4 mt-6 f-title-1 f-greyscale-1 font-weight-bold">
      {{ $t("risk.warnings") }}
    </div>
    <div class="mx-4 mt-6 f-caption f-greyscale-3">
      {{ $t("risk.warnings.content1") }}
    </div>
    <div class="mx-4 f-caption f-greyscale-3">
      {{ $t("risk.warnings.content2") }}
    </div>
    <div style="height: 80px"></div>
  </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { Action, Getter } from "vuex-class";
import { IAsset, ICollateral } from "~/services/types/vo";
import { IActionsParams } from "~/services/types/dto";
import { RISK, TransactionStatus } from "~/types";
import MarketSelectModal from "~/components/particles/MarketSelectModal.vue";
import Prediction from "@/components/particles/Prediction.vue";
import BigNumber from "bignumber.js";
import { isDesktop } from "~/utils/helper";

@Component({
  components: { MarketSelectModal, Prediction },
})
export default class GenerateVault extends Mixins(mixins.page) {
  @Getter("global/getCollateral") getCollateral;
  @Getter("global/getAssetById") getAssetById;
  @Getter("global/getWalletAssetById") getWalletAssetById;
  @Action("global/syncMyVaults") syncMyVaults;
  @Action("global/syncMarkets") syncMarkets;

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
  collateral = {} as ICollateral;
  deposit = ({} as any) as IAsset;
  mint = ({} as any) as IAsset;

  get countdown() {
    return Math.round(
      +this.collateral.mat * 100 - +this.meta.collateralizationRatio * 100 + 60
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
    const state = this.$store.state;
    const appbar = state.app.appbar;
    const isDark = state.app.settings.dark;

    return {
      ...appbar,
      disabled: true,
      back: true,
      align: "center",
      title: this.collateral.name,
      customContent: true,
      mixinImmersive: false,
      color: isDark ? "#000000" : "#FFFFFF",
    };
  }

  get title() {
    const t = this.$t("form.title.open", {
      name: this.collateral.name,
    });
    return `${t}`;
  }

  get queryId() {
    return this.$route.query["id"];
  }

  get meta() {
    const depositNum = Number(this.depositAmount);
    const mintNum = Number(this.mintAmount);
    // 抵押率计算
    const collateralizationRatio =
      (depositNum * Number(this.collateral?.price)) / mintNum;
    let collateralizationRatioText = `${this.$utils.number.toFixed(
      collateralizationRatio * 100,
      2
    )}`;
    if (!this.$utils.number.isValid(collateralizationRatio)) {
      collateralizationRatioText = "-";
    }
    // 价格计算
    const liquidationPrice =
      (mintNum * Number(this.collateral?.mat || "0")) / depositNum;
    let liquidationPriceText = `${this.$utils.number.toPrecision(
      liquidationPrice
    )}`;
    if (
      !this.$utils.number.isValid(liquidationPrice) ||
      liquidationPrice === 0
    ) {
      liquidationPriceText = `-`;
    }
    // fee
    const stabilityFee =
      this.$utils.number.toPrecision(Number(this.collateral.duty) - 1) * 100;
    // 该类型最大可用额
    const maxToGenerate = this.$utils.collateral.maxAvailable(this.collateral);
    const maxToGenerateText = this.$utils.number.toPrecision(maxToGenerate);
    // 实际最大可用
    let maxAvailable =
      (depositNum * Number(this.collateral?.price || "0")) /
        Number(this.collateral?.mat) || 0;
    if (maxAvailable > maxToGenerate) {
      maxAvailable = maxToGenerate;
    }
    const maxAvailableText = this.$utils.number.toPrecision(
      maxAvailable,
      8,
      BigNumber.ROUND_DOWN
    );
    return {
      collateralizationRatio,
      collateralizationRatioText,
      liquidationPrice: liquidationPriceText,
      currentDepositPrice: `${this.$utils.number.toPrecision(
        this.collateral?.price || "0"
      )}`,
      stabilityFee: this.$utils.number.toFixed(stabilityFee, 2),
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
      const max = this.$utils.collateral.maxAvailable(this.collateral);
      if (ma > max) {
        // mint 大于最大值
        return {
          disabled: true,
          type: "error",
          tip: this.$t("form.validate.max-debt", {
            amount: this.$utils.number.toPrecision(max),
            symbol: this.mintSymbol,
          }),
        };
      }
      if (ma < Number(this.collateral.dust)) {
        // mint 小于最小值
        return {
          disabled: true,
          type: "error",
          tip: this.$t("form.validate.minimum-debt", {
            amount: this.collateral.dust,
            symbol: this.mintSymbol,
          }),
        };
      }
      const risk = this.$utils.helper.riskLevel(
        this.meta.collateralizationRatio,
        this.collateral.mat
      );
      switch (risk) {
        case RISK.HIGH:
          if (
            Number(this.meta.collateralizationRatio) <
            Number(this.collateral.mat)
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
    return [
      {
        title: this.$t("form.info.liquidation-price"), // mint * mat / deposit
        value: this.meta.liquidationPrice,
        valueUnit: `${this.mint.symbol}`,
        hint: this.$t("form.tooltip.liquidation-price"),
      },
      {
        title: this.$t("form.info.collateralization-ratio"), // deposit * price / mint
        value: this.meta.collateralizationRatioText,
        valueUnit: "%",
        valueColor: this.$utils.helper.risk(
          this.meta.collateralizationRatio,
          this.collateral.mat
        ),
        hint: this.$t("form.tooltip.collateralization-ratio"),
      },
      {
        title: this.$t("form.info.current-symbol-price", {
          symbol: `${this.deposit?.symbol}/${this.mint?.symbol}`,
        }),
        value: this.meta.currentDepositPrice,
        valueUnit: `${this.mint.symbol}`,
      },
      {
        title: this.$t("form.info.minimum-ratio"),
        value: this.$utils.number.toFixed(
          Number(this.collateral?.mat) * 100,
          2
        ),
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
  }

  @Watch("depositAmount")
  onDepositChange() {
    this.$set(
      this.mintInputTips,
      "amount",
      this.$utils.number.toPrecision(this.meta.maxAvailable * this.scale.low)
    );
    (this.$refs.riskInfo as any)?.resetTimer?.();
  }

  intervalid = 0;
  mounted() {
    if (!this.queryId) {
      this.$utils.helper.toast(this, {
        message: "Collateral ID not found.",
        color: "red",
      });
      this.$router.replace("/");
    }
    this.follow_id = this.$utils.helper.uuidV4();
    this.collateral = this.getCollateral(this.queryId);
    this.deposit = this.getAssetById(this.collateral?.gem);
    this.mint = this.getAssetById(this.collateral?.dai);
    this.updateWalletAsset();
    this.intervalid = (setInterval(async () => {
      await this.syncMarkets();
      this.updateWalletAsset();
      this.collateral = this.getCollateral(this.queryId);
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

    const suggestAmount = this.$utils.number.toPrecision(
      this.meta.maxAvailable * this.scale.low
    );
    this.mintInputTips = this.isLogged
      ? {
          amount: suggestAmount,
          amountSymbol: this.mintSymbol,
          tipLeft: this.$t("common.suggest"),
          tipRight: this.collateral?.gem
            ? `≈ $ ${this.$utils.number.toPrecision(
                this.getAssetById?.(this.collateral?.dai)?.price * suggestAmount
              )}`
            : "",
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
          tipRight: this.collateral?.gem
            ? `≈ $ ${this.$utils.number.toPrecision(
                this.getAssetById?.(this.collateral?.gem)?.price *
                  +this.depositBalance
              )}`
            : "",
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

  handleBack() {
    this.$router.back();
  }

  updateWalletAsset(collateral = this.collateral) {
    this.$utils.helper.loadWalletAsset(this, collateral.gem);
    this.$utils.helper.loadWalletAsset(this, collateral.dai);
  }

  requestLogin() {
    this.$utils.helper.requestLogin(this);
  }

  requestConfirm() {
    if (
      (this.meta.collateralizationRatio - Number(this.collateral.mat)) * 100 <
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
      user_id: this.user_id,
      follow_id: this.follow_id,
      amount: this.depositAmount,
      asset_id: this.deposit?.id,
      parameters: [
        "bit",
        "31",
        "uuid",
        this.collateral.id,
        "decimal",
        this.$utils.number.toPrecision(this.mintAmount, 8),
      ],
    } as IActionsParams;
    const url = await this.$utils.helper.requestPayment(this, request);
    if (url && isDesktop() && !this.$fennec.connected) {
      this.$utils.helper.showPayDialog(this, {
        paymentUrl: url,
      });
    } else {
      this.$utils.helper.showPaying(this, {
        timer: this.$utils.helper.uuidV4(),
      });
    }
    this.checkTransaction(this.follow_id);
  }

  checkTransaction(follow_id: string) {
    let intervalId = 0 as any;
    clearInterval(intervalId);
    intervalId = setInterval(async () => {
      const response = await this.$http.getTransaction(follow_id);
      if (
        response.data?.status === TransactionStatus.OK ||
        response.data?.status === TransactionStatus.Abort
      ) {
        clearInterval(intervalId);
        this.updateWalletAsset();
        this.syncMyVaults();
        this.$utils.helper.hidePaying(this);
        this.$utils.helper.hidePaymentDialog(this);
        this.$utils.helper.handleTxResult(this, response.data);
      }
    }, 3000);
  }

  calcSliderTips() {
    let risk = "low";
    switch (
      this.$utils.helper.riskLevel(
        this.meta.collateralizationRatio,
        this.collateral.mat
      )
    ) {
      case RISK.HIGH:
        risk = "high";
        break;

      case RISK.MEDIUM:
        risk = "mid";
        break;
    }
    this.sliderTips = {
      tip: this.$t("form.hint.generate-ration"),
      highlight: `${this.$utils.number.toPercent(
        this.meta.collateralizationRatio < 0
          ? 0
          : this.meta.collateralizationRatio,
        false,
        0
      )}, ${this.$t("form.hint.risk-level", {
        level: this.$t(`form.hint.risk-level-${risk}`),
      })}`,
    };
  }
}
</script>
<style lang="scss" scoped>
.z-index-2 {
  z-index: 2;
}
.icon-tips {
  vertical-align: middle;
}
</style>
