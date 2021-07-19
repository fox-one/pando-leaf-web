<template>
  <v-container class="pa-0">
    <v-layout column class="ma-0 pa-4 pb-8 f-bg-greyscale-7">
      <div class="mt-3 mb-5 pa-4 debt-intro f-caption" v-if="showDebtIntro">
        {{ $t("form.hint.debt.intro") }}
        <v-icon
          class="debt-intro-icon"
          size="14"
          color="error"
          @click="showDebtIntro = false"
        >
          {{ $icons.mdiCloseCircle }}
        </v-icon>
      </div>

      <asset-range-input
        v-model="amount"
        class="mt-2"
        :label="$t('form.hint.payback-amount')"
        :assets="assets"
        :asset.sync="asset"
        :selectable="false"
        :precision="precision"
        :max="+assetBalance"
        :btn-text="$t('form.payback.button.confirm')"
        :disabled-btn="validate.disabled"
        :error="validate.tip"
        :show-slider="false"
        @click:button="confirm"
        color="primary"
      >
        <template v-slot:inputTips>
          <connect-wallet class="mt-2" v-if="!isLogged" @click="requestLogin" />
          <v-layout
            class="mt-2 f-caption f-greyscale-1"
            v-else
            align-center
            justify-space-between
          >
            <span class="font-weight-bold" @click="handleAmount(maxPayback)">
              {{ $t("form.hint.set-max") }}
              <v-icon class="ml-1" size="12"> $iconSetMax </v-icon>
            </span>
            <span @click="handleAmount(assetBalance)">
              <span class="f-greyscale-3">
                {{ $t("form.info.wallet-balance") }}
              </span>
              {{ assetBalance }}
            </span>
          </v-layout>
        </template>
      </asset-range-input>
    </v-layout>

    <div class="f-bg-greyscale-6" style="height: 8px"></div>

    <prediction
      class="my-2"
      :collateral="collateral"
      :vault="vault"
      :amount="amount"
      :type="vaultStatsType"
    />
  </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import { IAsset, ICollateral, IVault } from "~/services/types/vo";
import { Action, Getter } from "vuex-class";
import Prediction from "@/components/particles/Prediction.vue";
import BigNumber from "bignumber.js";
import { IActionsParams } from "~/services/types/dto";
import { TransactionStatus, VatAction } from "~/types";
import { isDesktop } from "~/utils/helper";

@Component({
  components: {
    Prediction,
  },
})
export default class PaybackForm extends Mixins(mixins.page) {
  @Getter("global/getCollateral") getCollateral;
  @Getter("global/getAssetById") getAssetById;
  @Getter("global/getVault") getVault;
  @Getter("global/getWalletAssetById") getWalletAssetById;
  @Action("global/syncMarkets") syncMarkets;
  @Action("global/syncMyVaults") syncMyVaults;

  vaultStatsType = VatAction.VatPayback;
  collateral = {} as ICollateral;
  vault = {} as IVault;
  asset = {} as IAsset;
  amount = "";
  precision = 8;
  showDebtIntro = true;

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
    const t = this.$t("form.title.payback");
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
      // if (amountNum > debtAmount) {
      //   return {
      //     disabled: true,
      //     type: "error",
      //     tip: this.$t("form.validate.pay-back-over"),
      //   };
      // }
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
        ratioText: this.$utils.number.toFixed(collateralizationRatio * 100, 1),
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
    this.follow_id = this.$utils.helper.uuidV4();
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
        this.$utils.helper.handleTxResult(this, response.data);
      }
    }, 3000);
  }

  handleAmount(val) {
    this.amount = val;
  }
}
</script>

<style lang="scss" scoped>
.debt-intro {
  position: relative;
  background-color: rgba(244, 76, 76, 0.1);
  border-radius: 8px;
  color: #f44c4c;
  &-icon {
    position: absolute;
    top: 6px;
    right: 6px;
    cursor: pointer;
  }
}

.theme--dark.v-application {
  .debt-intro {
    background-color: rgba(246, 112, 112, 0.3);
    color: #f67070;
  }
}
</style>
