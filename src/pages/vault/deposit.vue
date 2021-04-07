<template>
  <v-container class="pa-0">
    <vault-stats
      :collateral="collateral"
      :vault="vault"
      :amount="amount"
      :type="vaultStatsType"
    ></vault-stats>
    <v-layout column class="ma-0 pa-4 f-bg-greyscale-7">
      <div class="f-greyscale-3 f-body-1 mb-3 text-center">
        {{ $t("form.deposit.how-much") }}
      </div>

      <f-asset-amount-input
        v-model="amount"
        :label="$t('form.hint.deposit-amount')"
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
      <div v-else class="f-caption f-greyscale-3 my-2 ml-4">
        {{ $t("form.info.wallet-balance")
        }}<span class="f-blue"> {{ assetBalance }} </span>{{ assetSymbol }}
      </div>

      <f-tip :type="validate.type" v-if="validate.tip !== null">{{
        validate.tip
      }}</f-tip>
      <f-button
        type="primary"
        class="mt-5"
        :disabled="validate.disabled"
        @click="confirm"
        >{{ $t("form.deposit.button.confirm") }}</f-button
      >
    </v-layout>

    <!-- <div class="mx-4 mt-4 risk-title f-caption">RISK WARNING</div>
    <div class="mx-4 f-caption">
      Price of the pair tokens fluctuates due to change in supply and demand of
      the tokens. Investors are expected to take caution and take full
      responsibilities of their own investment decisions.
    </div> -->
  </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import { IAsset, ICollateral, IVault } from "~/services/types/vo";
import { Action, Getter, State } from "vuex-class";
import VaultStats from "@/components/particles/VaultStats.vue";
import { IActionsParams } from "~/services/types/dto";
import { TransactionStatus, VatAction } from "~/types";

@Component({
  components: {
    VaultStats,
  },
})
export default class DepositForm extends Mixins(mixins.page) {
  @Getter("auth/isLogged") isLogged;
  @Getter("global/getCollateral") getCollateral;
  @Getter("global/getAssetById") getAssetById;
  @Getter("global/getVault") getVault;
  @Getter("global/getWalletAssetById") getWalletAssetById;
  @Action("global/syncWalletAsset") syncWalletAsset;
  @Action("global/syncMyVaults") syncMyVaults;
  @State((state) => state.auth.id) user_id!: string;

  vaultStatsType = VatAction.VatDeposit;
  collateral = {} as ICollateral;
  vault = {} as IVault;
  asset = {} as IAsset;
  amount = "";
  precision = 8;

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
  }

  destroy() {
    clearInterval(0);
  }

  updateWalletAsset() {
    this.syncWalletAsset(this.collateral.gem);
    this.syncWalletAsset(this.collateral.dai);
  }

  requestLogin() {
    this.$utils.helper.requestLogin(this);
  }

  follow_id = "";
  async confirm() {
    const request = {
      user_id: this.user_id,
      follow_id: this.follow_id,
      amount: this.amount,
      asset_id: this.asset?.id,
      parameters: ["bit", "32", "uuid", this.vaultId],
    } as IActionsParams;
    const resposne = await this.$http.postActions(request);
    if (resposne.data?.code_url) {
      window.location.assign(resposne.data.code_url);
      if (!this.$utils.helper.isMixin()) {
        this.$utils.helper.showPayDialog(this, {
          paymentUrl: resposne.data.code_url,
        });
      } else {
        this.$utils.helper.showPaying(this, {
          timer: this.$utils.helper.uuidV4(),
        });
      }
      this.checkTransaction(this.follow_id);
    }
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
        this.$utils.helper.toast(this, {
          message: "Deposit finish.",
          color: "success",
        });
        this.$router.replace("/me");
      }
    }, 3000);
  }
}
</script>

<style lang="scss" scoped></style>
