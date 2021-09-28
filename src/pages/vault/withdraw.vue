<template>
  <v-container class="pa-0">
    <v-layout column class="ma-0 pa-4 pb-8 f-bg-greyscale-7">
      <asset-range-input
        v-model="amount"
        class="mt-2"
        :label="$t('form.hint.withdraw-amount')"
        :assets="assets"
        :asset.sync="asset"
        :selectable="false"
        :precision="precision"
        :inputTips="inputTips"
        :max="+maxAvailable"
        :ratio-text="$t('form.hint.withdraw-ratio')"
        :btn-text="$t('form.withdraw.button.confirm')"
        :disabled-btn="validate.disabled"
        :error="validate.tip"
        @click:button="requestConfirm"
        color="primary"
      />
    </v-layout>

    <div class="f-bg-greyscale-6" style="height: 8px"></div>

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
      :custom-color="{
        continue: {
          btn_cancel: 'f-bg-greyscale-1',
        },
      }"
      :impact="`${(meta.ratio * 100).toFixed(1)}%`"
      :countdown="countdown"
      @confirm="confirm"
      ref="riskInfo"
    />
    <!-- 
    <need-cnb-modal :visible.sync="needCnb" /> -->
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
import number from "~/utils/number";
import { isDesktop } from "~/utils/helper";

@Component({
  components: {
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

  vaultStatsType = VatAction.VatWithdraw;
  collateral = {} as ICollateral;
  vault = {} as IVault;
  asset = {} as IAsset;
  amount = "";
  precision = 8;
  alert = false;
  percent = 0;
  inputTips = {};
  showCModel = false;
  riskInfo = {
    continue: {},
    confirm: {},
  };

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
          ? this.$utils.number.toFixed(collateralizationRatio * 100, 1)
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

  get countdown() {
    return Math.round(+this.collateral.mat * 100 - +this.meta.ratio * 100 + 60);
  }

  @Watch("amount")
  onMintChanged(newVal) {
    const newPercent = Number(newVal) / Number(this.maxAvailable);
    if (this.$utils.number.isValid(newPercent)) {
      this.percent = newPercent * 100;
    }
    if (this.percent > 100) this.percent = 100;
    if (this.percent < 0) this.percent = 0;
    (this.$refs.riskInfo as any)?.resetTimer?.();
    this.$set(
      this.inputTips,
      "tipRight",
      `≈ $ ${this.$utils.number.toPrecision(
        this.getAssetById?.(this.collateral?.gem)?.price * +newVal
      )}`
    );
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

    this.inputTips = this.isLogged
      ? {
          amount: this.maxAvailable,
          amountSymbol: this.assetSymbol,
          tipLeft: this.$t("common.collateral"),
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
  }

  destroyed() {
    clearInterval(0);
    clearInterval(this.intervalid);
  }

  updateWalletAsset() {
    this.$utils.helper.loadWalletAsset(this, this.collateral.gem);
    this.$utils.helper.loadWalletAsset(this, this.collateral.dai);
    this.$utils.helper.loadWalletAsset(this, ACTION_ASSET_ID);
  }

  requestLogin() {
    this.$utils.helper.requestLogin(this);
  }

  needCnb = false;
  checkActionAsset() {
    if (this.isLogged && this.canReadAsset) {
      if (Number(this.getWalletAssetById(ACTION_ASSET_ID)?.balance) <= 0) {
        this.$pandoseed.show({
          token: this.$utils.helper.getToken(this.$store),
          success: () => {
            this.updateWalletAsset();
            this.$utils.helper.toast(this, {
              message: this.$t("common.action-success") + "",
            });
            this.$pandoseed.close();
          },
        });
        return true;
      }
    }
    return false;
  }

  requestConfirm() {
    if (this.checkActionAsset()) return;
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
