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
        {{ $t("form.withdraw.how-much") }}
      </div>

      <f-asset-amount-input
        v-model="amount"
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
      <div v-else class="f-caption f-greyscale-3 my-2 ml-4">
        {{ $t("form.info.max-available")
        }}<span class="f-blue" @click="amount = maxAvailable">
          {{ maxAvailable }} </span
        >{{ assetSymbol }}
      </div>
      <f-tip :type="validate.type" v-if="validate.tip !== null">{{
        validate.tip
      }}</f-tip>
      <f-button
        type="primary"
        class="mt-5"
        :disabled="validate.disabled"
        @click="confirm"
        >{{ $t("form.withdraw.button.confirm") }}</f-button
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
import BigNumber from "bignumber.js";
import { IActionsParams } from "~/services/types/dto";
import { RISK, TransactionStatus, VatAction } from "~/types";
import { ACTION_ASSET_ID } from "~/constants";
import number from "~/utils/number";

@Component({
  components: {
    VaultStats,
  },
})
export default class WithdrawForm extends Mixins(mixins.page) {
  @Getter("auth/isLogged") isLogged;
  @Getter("global/getCollateral") getCollateral;
  @Getter("global/getAssetById") getAssetById;
  @Getter("global/getVault") getVault;
  @Getter("global/getWalletAssetById") getWalletAssetById;
  @Action("global/syncWalletAsset") syncWalletAsset;
  @Action("global/syncMyVaults") syncMyVaults;
  @State((state) => state.auth.id) user_id!: string;

  vaultStatsType = VatAction.VatWithdraw;
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

  get maxAvailable() {
    const debtAmount =
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1");
    if (debtAmount === 0) {
      return this.vault?.ink;
    }
    const collateralAmount = Number(this.vault?.ink);
    const price = Number(this.collateral?.price);
    const mininumRatio = Number(this.collateral?.mat);
    const max = collateralAmount - (mininumRatio * debtAmount) / price;
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
      amount: "0.00000001",
      asset_id: ACTION_ASSET_ID,
      parameters: ["bit", "33", "uuid", this.vaultId, "decimal", this.amount],
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
          message: "Withdraw finish.",
          color: "success",
        });
        this.$router.replace("/me");
      }
    }, 3000);
  }
}
</script>

<style lang="scss" scoped></style>
