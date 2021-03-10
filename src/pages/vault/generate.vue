<template>
  <v-container class="pa-0">
    <vault-stats :collateral="collateral" :vault="vault"></vault-stats>
    <v-layout column class="ma-0 pa-4 f-bg-greyscale-7">
      <div class="f-greyscale-3 f-body-1 mb-3 text-center">
        How much to Generate?
      </div>

      <f-asset-amount-input
        v-model="amount"
        label="Generate amount"
        :assets="[asset]"
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
        Connect Wallet
      </div>
      <div v-else class="f-caption f-greyscale-3 my-2 ml-4">
        Max available
        <span class="f-blue" @click="amount = maxAvailable">
          {{ maxAvailable }} </span
        >{{ assetSymbol }}
      </div>
      <f-button type="primary" class="mt-5" @click="confirm">Generate</f-button>
    </v-layout>

    <v-layout column class="my-4 f-bg-greyscale-7">
      <div class="mt-4 mx-4 f-title-1">Predication</div>
      <f-info-grid :window-size="2">
        <f-info-grid-item
          v-for="(item, ix) in predictions"
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

    <div class="mx-4 mt-4 risk-title f-caption">RISK WARNING</div>
    <div class="mx-4 f-caption">
      Price of the pair tokens fluctuates due to change in supply and demand of
      the tokens. Investors are expected to take caution and take full
      responsibilities of their own investment decisions.
    </div>
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
import { TransactionStatus } from "~/types";
import { ACTION_ASSET_ID } from "~/constants";

@Component({
  components: {
    VaultStats,
  },
})
export default class GenerateForm extends Mixins(mixins.page) {
  @Getter("auth/isLogged") isLogged;
  @Getter("global/getCollateral") getCollateral;
  @Getter("global/getAssetById") getAssetById;
  @Getter("global/getVault") getVault;
  @Getter("global/getWalletAssetById") getWalletAssetById;
  @Action("global/syncWalletAsset") syncWalletAsset;
  @Action("global/syncMyVaults") syncMyVaults;
  @State((state) => state.auth.id) user_id!: string;

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
    const collateralAmount = Number(this.vault?.ink);
    const price = Number(this.collateral?.price);
    const mininumRatio = Number(this.collateral?.mat);
    const max = (collateralAmount * price) / mininumRatio - debtAmount;
    return this.$utils.number.toPrecision(max, 8, BigNumber.ROUND_DOWN);
  }

  get assetSymbol() {
    return this.asset?.symbol || "";
  }

  get title() {
    return `Generate more ${this.assetSymbol}`;
  }

  get vaultId() {
    return this.$route.query["id"];
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
    const increasedDebt = Number(this.amount);
    const price =
      ((debtAmount + increasedDebt) * liquidationRatio) / collateralAmount;
    const ratio =
      (collateralAmount * Number(this.collateral?.price)) /
      (debtAmount + increasedDebt);
    return {
      price: this.$utils.number.toPrecision(price),
      ratio,
      ratioText: this.$utils.number.toFixed(ratio * 100, 2),
    };
  }

  get predictions() {
    return [
      {
        title: `New Liquidation Price`,
        value: this.meta.price,
        valueUnit: "USD",
      },
      {
        title: "New Collateralization Ratio",
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
      parameters: ["bit", "35", "uuid", this.vaultId, "decimal", this.amount],
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
          message: "Generate finish.",
          color: "success",
        });
        this.$router.replace("/me");
      }
    }, 3000);
  }
}
</script>

<style lang="scss" scoped></style>
