<template>
  <v-container class="pa-0">
    <v-layout column class="ma-0 pa-4 f-bg-greyscale-7">
      <div class="f-greyscale-3 f-body-1 mb-3 text-center">
        {{ $t("form.payback.how-much") }}
      </div>

      <f-asset-amount-input
        v-model="amount"
        :label="$t('form.hint.payback-amount')"
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
      <v-layout v-else justify-space-between>
        <div class="f-caption f-greyscale-3 my-2 ml-4">
          {{ $t("form.info.wallet-balance") }} {{ assetBalance }}
          {{ assetSymbol }}
        </div>
        <div class="f-caption f-blue my-2 mr-4" @click="amount = maxPayback">
          {{ $t("form.info.set-max") }}
        </div>
      </v-layout>
      <f-tip :type="validate.type" v-if="validate.tip !== null">{{
        validate.tip
      }}</f-tip>
      <f-button
        type="primary"
        class="mt-5"
        :disabled="validate.disabled"
        @click="confirm"
        >{{ $t("form.payback.button.confirm") }}</f-button
      >
    </v-layout>
    <vault-stats
      class="my-4"
      :collateral="collateral"
      :vault="vault"
      :amount="amount"
      :type="vaultStatsType"
    ></vault-stats>

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
import BigNumber from "bignumber.js";
import { IActionsParams } from "~/services/types/dto";
import { TransactionStatus, VatAction } from "~/types";
import { isDesktop } from "~/utils/helper";

@Component({
  components: {
    VaultStats,
  },
})
export default class PaybackForm extends Mixins(mixins.page) {
  @Getter("auth/isLogged") isLogged;
  @Getter("global/getCollateral") getCollateral;
  @Getter("global/getAssetById") getAssetById;
  @Getter("global/getVault") getVault;
  @Getter("global/getWalletAssetById") getWalletAssetById;
  @Action("global/syncMarkets") syncMarkets;
  @Action("global/syncMyVaults") syncMyVaults;
  @State((state) => state.auth.id) user_id!: string;

  vaultStatsType = VatAction.VatPayback;
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

  get assetBalance() {
    return this.getWalletAssetById(this.collateral?.dai)?.balance || "0";
  }

  get maxPayback() {
    const debtAmount =
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1");
    return this.$utils.number.toPrecision(debtAmount, 8, BigNumber.ROUND_UP);
  }

  get assetSymbol() {
    return this.asset?.symbol || "";
  }

  get title() {
    const t = this.$t("form.title.payback", { symbol: this.assetSymbol });
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
    const amountNum = Number(this.amount);
    if (amountNum <= 0) {
      return {
        disabled: true,
        type: "error",
        tip: this.$t("form.validate.amount-zero"),
      };
    }
    if (this.isLogged) {
      if (amountNum > this.assetBalance) {
        return {
          disabled: true,
          type: "error",
          tip: this.$t("form.validate.insufficient-balance", {
            symbol: this.assetSymbol,
          }),
        };
      }
      const debtAmount = Number(this.maxPayback);
      if (amountNum > debtAmount) {
        return {
          disabled: true,
          type: "error",
          tip: this.$t("form.validate.pay-back-over"),
        };
      }
      const leftDebt = debtAmount - amountNum;
      if (leftDebt < Number(this.collateral?.dust) && leftDebt > 0) {
        return {
          disabled: true,
          type: "error",
          tip: this.$t("form.validate.remaining-dust-debt", {
            amount: this.collateral.dust,
            symbol: this.assetSymbol,
          }),
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
        debtAmount,
        price: this.$utils.number.toPrecision(liquidationPrice),
        ratio: collateralizationRatio,
        ratioText: this.$utils.number.toFixed(collateralizationRatio * 100, 2),
      };
    }
    const decreasedDebt = Number(this.amount);
    const price =
      ((debtAmount - decreasedDebt) * liquidationRatio) / collateralAmount;
    const ratio =
      (collateralAmount * Number(this.collateral?.price)) /
      (debtAmount - decreasedDebt);
    let ratioText = this.$utils.number.toPrecision(ratio * 100);
    if (ratio < 0 || !this.$utils.number.isValid(ratio)) {
      ratioText = "N/A";
    }
    let newDebt = debtAmount - decreasedDebt;
    if (newDebt < 0) newDebt = 0;
    return {
      debtAmount: newDebt,
      price: this.$utils.number.toPrecision(price),
      ratio,
      ratioText,
    };
  }

  get predictions() {
    return [
      {
        title: this.$t("form.info.symbol-debt", { symbol: this.assetSymbol }),
        value: this.$utils.number.toPrecision(this.meta.debtAmount),
        valueUnit: this.assetSymbol,
      },
      {
        title: this.$t("form.info.new-liquidation-price"),
        value: this.meta.price,
        valueUnit: this.assetSymbol,
      },
      {
        title: this.$t("form.info.new-collateralization-ratio"),
        value: this.meta.ratioText,
        valueUnit: this.meta.ratio < 0 ? "" : "%",
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
    this.asset = this.getAssetById(this.collateral?.dai);
    this.updateWalletAsset();
    this.intervalid = (setInterval(async () => {
      await this.syncMyVaults();
      await this.syncMarkets();
      this.vault = this.getVault(this.vaultId);
      this.collateral = this.getCollateral(this.vault?.collateral_id);
    }, 5000) as any) as number;
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
    const request = {
      user_id: this.user_id,
      follow_id: this.follow_id,
      amount: this.amount,
      asset_id: this.asset?.id,
      parameters: ["bit", "34", "uuid", this.vaultId],
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
        this.$utils.helper.toast(this, {
          message: "Payback finish.",
          color: "success",
        });
        this.$router.replace("/me");
      }
    }, 3000);
  }
}
</script>

<style lang="scss" scoped></style>
