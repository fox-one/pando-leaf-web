<template>
  <v-container class="pa-0">
    <v-layout column class="ma-0 pa-4 pb-8 f-bg-greyscale-7">
      <asset-range-input
        v-model="amount"
        class="mt-2"
        :label="$t('form.hint.deposit-amount')"
        :assets="assets"
        :asset.sync="asset"
        :selectable="false"
        :precision="precision"
        :inputTips="inputTips"
        :max="+assetBalance"
        :btn-text="$t('form.deposit.button.confirm')"
        :disabled-btn="validate.disabled"
        :error="validate.tip"
        :show-slider="false"
        @click:button="confirm"
        color="primary"
      />
    </v-layout>

    <prediction
      class="my-2"
      :collateral="collateral"
      :vault="vault"
      :amount="amount"
      :type="vaultStatsType"
    ></prediction>
  </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import { IAsset, ICollateral, IVault } from "~/services/types/vo";
import { Action, Getter } from "vuex-class";
import VaultStats from "@/components/particles/VaultStats.vue";
import Prediction from "@/components/particles/Prediction.vue";
import { IActionsParams } from "~/services/types/dto";
import { TransactionStatus, VatAction } from "~/types";
import { isDesktop } from "~/utils/helper";

@Component({
  components: {
    VaultStats,
    Prediction,
  },
})
export default class DepositForm extends Mixins(mixins.page) {
  @Getter("global/getCollateral") getCollateral;
  @Getter("global/getAssetById") getAssetById;
  @Getter("global/getVault") getVault;
  @Getter("global/getWalletAssetById") getWalletAssetById;
  @Action("global/syncMyVaults") syncMyVaults;
  @Action("global/syncMarkets") syncMarkets;

  vaultStatsType = VatAction.VatDeposit;
  collateral = {} as ICollateral;
  vault = {} as IVault;
  asset = {} as IAsset;
  amount = "";
  precision = 8;
  inputTips = {};

  get appbar() {
    return {
      align: "center",
      back: true,
    };
  }

  get assets() {
    return [this.asset];
  }

  get assetBalance() {
    return this.getWalletAssetById(this.collateral.gem)?.balance || "0";
  }

  get assetSymbol() {
    return this.asset?.symbol || "";
  }

  get title() {
    const t = this.$t("form.title.deposit");
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
    if (Number(this.amount || "0") <= 0) {
      return {
        disabled: true,
        type: "error",
        tip: this.$t("form.validate.amount-zero"),
      };
    }
    if (this.isLogged && Number(this.amount) > this.assetBalance) {
      return {
        disabled: true,
        type: "error",
        tip: this.$t("form.validate.insufficient-balance", {
          symbol: this.assetSymbol,
        }),
      };
    }
    return {
      disabled: false,
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
        ratioText: this.$utils.number.toFixed(collateralizationRatio * 100, 2),
      };
    }
    const increasedCollateral = Number(this.amount);
    const price =
      (debtAmount * liquidationRatio) /
      (collateralAmount + increasedCollateral);
    const ratio =
      ((collateralAmount + increasedCollateral) *
        Number(this.collateral?.price)) /
      debtAmount;
    return {
      price: this.$utils.number.toPrecision(price),
      ratio,
      ratioText: this.$utils.number.toFixed(ratio * 100, 2),
    };
  }

  get predictions() {
    const debtSymbol = this.getAssetById(this.collateral.dai)?.symbol;
    return [
      {
        title: this.$t("form.info.new-liquidation-price"),
        value: this.meta.price,
        valueUnit: debtSymbol,
      },
      {
        title: this.$t("form.info.new-collateralization-ratio"),
        value: this.$utils.number.isValid(this.meta.ratio)
          ? this.meta.ratioText
          : "N/A",
        valueUnit: "%",
        valueColor: this.$utils.helper.risk(
          this.meta.ratio,
          this.collateral.mat
        ),
      },
    ];
  }

  intervalid = 0;
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
          amount: +this.assetBalance,
          amountSymbol: this.assetSymbol,
          tipLeft: this.$t("form.info.wallet-balance"),
          tipRight: this.collateral?.gem
            ? `≈ $ ${this.$utils.number.toPrecision(
                this.getAssetById?.(this.collateral?.gem)?.price *
                  +this.assetBalance
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
    clearInterval(this.intervalid);
    clearInterval(0);
  }

  updateWalletAsset() {
    this.$utils.helper.loadWalletAsset(this, this.collateral.gem);
    this.$utils.helper.loadWalletAsset(this, this.collateral.dai);
  }

  requestLogin() {
    this.$utils.helper.requestLogin(this);
  }

  follow_id = "";
  async confirm() {
    this.follow_id = this.$utils.helper.uuidV4();
    const request = {
      user_id: this.user_id,
      follow_id: this.follow_id,
      amount: this.amount,
      asset_id: this.asset?.id,
      parameters: ["bit", "32", "uuid", this.vaultId],
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
