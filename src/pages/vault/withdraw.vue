<template>
  <v-container class="pa-0">
    <v-layout column class="ma-0 pa-4 f-bg-greyscale-7">
      <asset-range-input
        v-model="amount"
        class="mt-6"
        :label="$t('form.hint.withdraw-amount')"
        :assets="assets"
        :asset.sync="asset"
        :selectable="false"
        :precision="precision"
        :inputTips="inputTips"
        :max="maxAvailable"
        :ratio-text="$t('form.hint.withdraw-ratio')"
        :btn-text="$t('form.withdraw.button.confirm')"
        :error="validate.tip"
        @click:button="requestConfirm"
        color="primary"
      />
      <!-- <f-asset-amount-input
        v-model="amount"
        class="mt-6"
        :label="$t('form.hint.withdraw-amount')"
        :assets="assets"
        :asset.sync="asset"
        :selectable="false"
        :precision="precision"
      >
      </f-asset-amount-input>
      <div
        v-if="!isLogged"
        class="f-caption f-blue my-2 ml-4"
        @click="requestLogin"
      >
        {{ $t("connect.wallet") }}
      </div>
      <div v-else class="f-caption f-greyscale-3 my-2">
        {{ $t("form.info.available-to-withdraw") }}
        {{ maxAvailable }} {{ assetSymbol }}
        <span
          class="f-black text-decoration-underline ml-1 font-weight-bold"
          @click="amount = maxAvailable"
        >
          MAX
        </span>
      </div>

      <percent-slider class="ma-4" :percent.sync="percent" />

      <f-tip :type="validate.type" v-if="validate.tip !== null">{{
        validate.tip
      }}</f-tip>
      <div class="my-8 text-center">
        <v-btn
          rounded
          depressed
          color="primary"
          height="56px"
          class="px-8"
          :disabled="validate.disabled"
          @click="requestConfirm"
          >{{ $t("form.withdraw.button.confirm") }}</v-btn
        >
      </div> -->
    </v-layout>

    <prediction
      class="my-4"
      :collateral="collateral"
      :vault="vault"
      :amount="amount"
      :type="vaultStatsType"
    ></prediction>

    <!-- <div class="mx-4 mt-4 risk-title f-caption">RISK WARNING</div>
    <div class="mx-4 f-caption">
      Price of the pair tokens fluctuates due to change in supply and demand of
      the tokens. Investors are expected to take caution and take full
      responsibilities of their own investment decisions.
    </div> -->
    <base-confirm-modal
      ref="cmodal"
      @confirm="confirm"
      :current-rate="this.meta.ratio * 100"
      :liquidation-rate="Number(this.collateral.mat) * 100"
    />
    <need-cnb-modal :visible.sync="needCnb" />
  </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins, Ref, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { IAsset, ICollateral, IVault } from "~/services/types/vo";
import { Action, Getter } from "vuex-class";
import VaultStats from "@/components/particles/VaultStats.vue";
import Prediction from "@/components/particles/Prediction.vue";
import PercentSlider from "@/components/particles/PercentSlider.vue";
import NeedCnbModal from "@/components/particles/NeedCnbModal.vue";
import BigNumber from "bignumber.js";
import { IActionsParams } from "~/services/types/dto";
import { RISK, TransactionStatus, VatAction } from "~/types";
import { ACTION_ASSET_ID } from "~/constants";
import number from "~/utils/number";
import { isDesktop } from "~/utils/helper";

@Component({
  components: {
    VaultStats,
    PercentSlider,
    NeedCnbModal,
    Prediction,
  },
})
export default class WithdrawForm extends Mixins(mixins.page) {
  @Getter("global/getCollateral") getCollateral;
  @Getter("global/getAssetById") getAssetById;
  @Getter("global/getVault") getVault;
  @Getter("global/getWalletAssetById") getWalletAssetById;
  @Action("global/syncMarkets") syncMarkets;
  @Action("global/syncMyVaults") syncMyVaults;
  @Ref("cmodal") cmodal;

  vaultStatsType = VatAction.VatWithdraw;
  collateral = {} as ICollateral;
  vault = {} as IVault;
  asset = {} as IAsset;
  amount = "";
  precision = 8;
  alert = false;
  percent = 0;
  inputTips = {};

  get appbar() {
    return {
      align: "center",
      back: true,
    };
  }

  get maxAvailable() {
    const debtAmount =
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1");
    if (debtAmount === 0) {
      return this.vault?.ink;
    }
    const collateralAmount = Number(this.vault?.ink);
    const price = Number(this.collateral?.price);
    const mininumRatio = Number(this.collateral?.mat);
    const max =
      collateralAmount - (mininumRatio * debtAmount) / price - 0.00000001;
    return this.$utils.number.toPrecision(max, 8, BigNumber.ROUND_DOWN);
  }

  get assets() {
    return [this.asset];
  }

  get assetSymbol() {
    return this.asset?.symbol || "";
  }

  get title() {
    const t = this.$t("form.title.withdraw");
    return `${t}`;
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
            tip: this.$t("form.validate.high-risk-withdraw", {
              symbol: this.assetSymbol,
            }),
          };
        // 中风险区间
        case RISK.MEDIUM:
          return {
            disabled: false,
            type: "warning",
            tip: this.$t("form.validate.medium-risk-withdraw", {
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
            disabled: false,
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
        ratioText: number.isValid(collateralizationRatio)
          ? this.$utils.number.toFixed(collateralizationRatio * 100, 2)
          : "N/A",
      };
    }
    const decreasedCollateral = Number(this.amount);
    const price =
      (debtAmount * liquidationRatio) /
      (collateralAmount - decreasedCollateral);
    const ratio =
      ((collateralAmount - decreasedCollateral) *
        Number(this.collateral?.price)) /
      debtAmount;
    let ratioText = this.$utils.number.toPrecision(ratio * 100);
    return {
      price: number.isValid(price)
        ? this.$utils.number.toPrecision(price)
        : "0",
      ratio,
      ratioText: number.isValid(ratio) ? ratioText : "N/A",
    };
  }

  get predictions() {
    const debtSymbol = this.getAssetById(this.collateral?.dai)?.symbol;
    return [
      {
        title: this.$t("form.info.new-liquidation-price"),
        value: this.meta.price,
        valueUnit: debtSymbol,
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

  @Watch("percent")
  onPercent(newVal) {
    if (!this.$utils.number.isValid(Number(this.amount))) return;
    if (this.modAmount) return;
    this.amount = this.$utils.number.toPrecision(
      (newVal / 100) * this.maxAvailable,
      8
    );
  }

  modAmount = false;

  @Watch("amount")
  onMintChanged(newVal) {
    this.modAmount = true;
    const newPercent = Number(newVal) / Number(this.maxAvailable);
    if (this.$utils.number.isValid(newPercent)) {
      this.percent = newPercent * 100;
    }
    this.$utils.helper.debounce(() => {
      this.modAmount = false;
    }, 10)();
  }

  intervalid = 0;
  mounted() {
    if (!this.vaultId) {
      this.$utils.helper.toast(this, {
        message: "Collateral ID not found.",
        color: "red",
      });
      this.$router.replace("/");
    }
    this.follow_id = this.$utils.helper.uuidV4();
    this.vault = this.getVault(this.vaultId);
    this.collateral = this.getCollateral(this.vault.collateral_id);
    this.asset = this.getAssetById(this.collateral.gem);
    this.updateWalletAsset();
    this.intervalid = (setInterval(async () => {
      await this.syncMyVaults();
      await this.syncMarkets();
      this.vault = this.getVault(this.vaultId);
      this.collateral = this.getCollateral(this.vault.collateral_id);
    }, 5000) as any) as number;

    this.inputTips = this.isLogged
      ? {
          amount: this.maxAvailable,
          amountSymbol: this.assetSymbol,
          tipLeft: this.$t("common.collateral"),
          tipRight: this.collateral?.gem
            ? `≈ $ ${this.$utils.number.toPrecision(
                this.getAssetById?.(this.collateral?.gem)?.price *
                  this.maxAvailable
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
  }

  destroyed() {
    clearInterval(0);
    clearInterval(this.intervalid);
  }

  updateWalletAsset() {
    this.$utils.helper.loadWalletAsset(this, this.collateral.gem);
    this.$utils.helper.loadWalletAsset(this, this.collateral.dai);
  }

  requestLogin() {
    this.$utils.helper.requestLogin(this);
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

  requestConfirm() {
    if (this.checkCNB()) return;
    if ((this.meta.ratio - Number(this.collateral.mat)) * 100 < 61) {
      this.cmodal.show();
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
      parameters: ["bit", "33", "uuid", this.vaultId, "decimal", this.amount],
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
}
</script>

<style lang="scss" scoped></style>
