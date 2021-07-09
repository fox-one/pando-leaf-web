<template>
  <v-container class="pa-0">
    <v-layout column class="ma-0 pa-4 pb-8 f-bg-greyscale-7">
      <asset-range-input
        v-model="amount"
        class="mt-2"
        :label="$t('form.hint.generate-amount')"
        :assets="[asset]"
        :asset.sync="asset"
        :selectable="false"
        :precision="precision"
        :inputTips="inputTips"
        :max="+maxAvailable"
        :btn-text="$t('form.generate.button.confirm')"
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

    <prediction
      class="my-2"
      :collateral="collateral"
      :vault="vault"
      :amount="amount"
      :type="vaultStatsType"
    />

    <risk-info
      v-model="showCModel"
      :custom-text="riskInfo"
      :impact="`${(meta.ratio * 100).toFixed(2)}%`"
      :countdown="countdown"
      @confirm="confirm"
      ref="riskInfo"
    />

    <need-cnb-modal :visible.sync="needCnb" />
  </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { IAsset, ICollateral, IVault } from "~/services/types/vo";
import { Action, Getter } from "vuex-class";
import Prediction from "@/components/particles/Prediction.vue";
import NeedCnbModal from "@/components/particles/NeedCnbModal.vue";
import BigNumber from "bignumber.js";
import { IActionsParams } from "~/services/types/dto";
import { RISK, TransactionStatus, VatAction } from "~/types";
import { ACTION_ASSET_ID } from "~/constants";
import { isDesktop } from "~/utils/helper";

@Component({
  components: {
    NeedCnbModal,
    Prediction,
  },
})
export default class GenerateForm extends Mixins(mixins.page) {
  @Getter("global/getCollateral") getCollateral;
  @Getter("global/getAssetById") getAssetById;
  @Getter("global/getVault") getVault;
  @Getter("global/getWalletAssetById") getWalletAssetById;
  @Action("global/syncMyVaults") syncMyVaults;
  @Action("global/syncMarkets") syncMarkets;

  vaultStatsType = VatAction.VatGenerate;
  collateral = {} as ICollateral;
  vault = {} as IVault;
  asset = {} as IAsset;
  amount = "";
  precision = 8;
  percent = 0;
  inputTips = {};
  sliderTips = {};
  scale = {};
  riskInfo = {
    continue: {},
    confirm: {},
  };
  showCModel = false;

  get appbar() {
    return {
      align: "center",
      back: true,
    };
  }

  get maxAvailable() {
    const debtAmount =
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1");
    const collateralAmount = Number(this.vault?.ink);
    const price = Number(this.collateral?.price);
    const mininumRatio = Number(this.collateral?.mat);
    const max =
      (collateralAmount * price) / mininumRatio - debtAmount - 0.00000001;
    const catMax = this.$utils.collateral.maxAvailable(this.collateral);
    return this.$utils.number.toPrecision(
      Math.min(max, catMax),
      8,
      BigNumber.ROUND_DOWN
    );
  }

  get assetSymbol() {
    return this.asset?.symbol || "";
  }

  get title() {
    const t = this.$t("form.title.generate");
    return `${t}`;
  }

  get countdown() {
    return Math.round(+this.collateral.mat * 100 - +this.meta.ratio * 100 + 60);
  }

  get vaultId() {
    return this.$route.query["id"];
  }

  get validate() {
    if (this.amount === "") {
      return {
        disabled: true,
        tip: null,
      };
    }
    if (Number(this.amount) <= 0) {
      return {
        disabled: true,
        type: "error",
        tip: this.$t("form.validate.amount-zero"),
      };
    }
    const debtAmount =
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1");
    const ma = Number(this.amount || "0");
    const max = this.$utils.collateral.maxAvailable(this.collateral);
    if (ma + debtAmount < Number(this.collateral.dust)) {
      // mint 小于最小值
      return {
        disabled: true,
        type: "error",
        tip: this.$t("form.validate.minimum-debt", {
          amount: this.collateral.dust,
          symbol: this.assetSymbol,
        }),
      };
    }
    if (ma > max) {
      // mint 大于最大值
      return {
        disabled: true,
        type: "error",
        tip: this.$t("form.validate.max-debt", {
          amount: this.$utils.number.toPrecision(max),
          symbol: this.assetSymbol,
        }),
      };
    }
    if (this.isLogged) {
      const risk = this.$utils.helper.riskLevel(
        this.meta.ratio,
        this.collateral.mat
      );
      switch (risk) {
        case RISK.HIGH:
          if (Number(this.meta.ratio) < Number(this.collateral.mat)) {
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
              symbol: this.assetSymbol,
            }),
          };
        // 中风险区间
        case RISK.MEDIUM:
          return {
            disabled: false,
            type: "warning",
            tip: this.$t("form.validate.medium-risk", {
              symbol: this.assetSymbol,
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
          if (Number(this.meta.ratio) < 0) {
            return {
              disabled: true,
              type: "info",
              tip: null,
            };
          }
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

  get meta() {
    const debtAmount =
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1");
    const collateralAmount = Number(this.vault?.ink);
    const liquidationRatio = Number(this.collateral?.mat);
    if (!Number(this.amount)) {
      const liquidationPrice =
        (debtAmount * liquidationRatio) / collateralAmount;
      const collateralizationRatio =
        (collateralAmount * Number(this.collateral?.price)) / debtAmount;
      return {
        price: this.$utils.number.toPrecision(liquidationPrice),
        ratio: collateralizationRatio,
        ratioText: this.$utils.number.toFixed(collateralizationRatio * 100, 1),
      };
    }
    const increasedDebt = Number(this.amount);
    const price =
      ((debtAmount + increasedDebt) * liquidationRatio) / collateralAmount;
    const ratio =
      (collateralAmount * Number(this.collateral?.price)) /
      (debtAmount + increasedDebt);
    return {
      price: this.$utils.number.toPrecision(price),
      ratio,
      ratioText: this.$utils.number.toFixed(ratio * 100, 1),
    };
  }

  get predictions() {
    return [
      {
        title: this.$t("form.info.new-liquidation-price"),
        value: this.meta.price,
        valueUnit: this.assetSymbol,
      },
      {
        title: this.$t("form.info.new-collateralization-ratio"),
        value: this.meta.ratioText,
        valueUnit: "%",
        valueColor: this.$utils.helper.risk(
          this.meta.ratio,
          this.collateral.mat
        ),
      },
    ];
  }

  @Watch("amount")
  onMintChanged(newVal) {
    const newPercent = Number(newVal) / Number(this.maxAvailable);
    if (this.$utils.number.isValid(newPercent)) {
      this.percent = newPercent * 100;
    }
    if (this.percent > 100) this.percent = 100;
    if (this.percent < 0) this.percent = 0;
    this.calcSliderTips();
    (this.$refs.riskInfo as any)?.resetTimer?.();
  }

  mounted() {
    if (!this.vaultId) {
      this.$utils.helper.toast(this, {
        message: "Vault ID not found.",
        color: "red",
      });
      this.$router.replace("/");
    }
    this.follow_id = this.$utils.helper.uuidV4();
    this.vault = this.getVault(this.vaultId);
    this.collateral = this.getCollateral(this.vault.collateral_id);
    this.asset = this.getAssetById(this.collateral.dai);
    this.updateWalletAsset();

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

    const debtAmount = +this.vault?.art * +this.collateral?.rate;
    const collateralAmount = +this.vault?.ink * +this.collateral?.price;
    const midRatioLimit = (5 / 3) * +this.collateral.mat;
    const highRatioLimit = 1.25 * +this.collateral.mat;
    const midAmount = collateralAmount / midRatioLimit - debtAmount;
    const highAmount = collateralAmount / highRatioLimit - debtAmount;
    this.scale = {
      low: midAmount / this.maxAvailable,
      mid: (highAmount - midAmount) / this.maxAvailable,
      high: (this.maxAvailable - highAmount) / this.maxAvailable,
    };

    const suggestAmount = this.$utils.number.toPrecision(
      this.maxAvailable * (midAmount / this.maxAvailable)
    );
    this.inputTips = this.isLogged
      ? {
          amount: suggestAmount,
          amountSymbol: this.assetSymbol,
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

    this.calcSliderTips();
  }

  destroyed() {
    clearInterval(0);
  }

  needCnb = false;
  checkCNB() {
    if (this.isLogged && this.canReadAsset) {
      if (Number(this.getAssetById(ACTION_ASSET_ID)?.balance) <= 0) {
        this.needCnb = true;
        return true;
      }
    }
    return false;
  }

  updateWalletAsset() {
    this.$utils.helper.loadWalletAsset(this, this.collateral.gem);
    this.$utils.helper.loadWalletAsset(this, this.collateral.dai);
  }

  requestLogin() {
    this.$utils.helper.requestLogin(this);
  }

  requestConfirm() {
    if (this.checkCNB()) return;
    if ((this.meta.ratio - Number(this.collateral.mat)) * 100 < 61) {
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
      amount: "0.00000001",
      asset_id: ACTION_ASSET_ID,
      parameters: ["bit", "35", "uuid", this.vaultId, "decimal", this.amount],
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
      this.$utils.helper.riskLevel(this.meta.ratio, this.collateral.mat)
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
        this.meta.ratio < 0 ? 0 : this.meta.ratio,
        false,
        1
      )}, ${this.$t("form.hint.risk-level", {
        level: this.$t(`form.hint.risk-level-${risk}`),
      })}`,
    };
  }
}
</script>

<style lang="scss" scoped></style>
