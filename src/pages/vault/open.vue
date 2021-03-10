<template>
  <v-container class="pa-0">
    <v-layout column class="ma-0 pa-4 f-bg-greyscale-7">
      <div class="f-body-1 f-greyscale-3 mb-3 text-center">
        How much {{ deposit.symbol }} would you deposit?
        <f-tooltip v-model="depositTips" bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              class="icon-tips"
              @click="depositTips = !depositTips"
              v-on="on"
              v-bind="attrs"
              size="20"
              >{{ $icons.mdiHelpCircleOutline }}</v-icon
            >
          </template>
          <div>
            <div class="f-body-1">
              How much {{ depositSymbol }} would you like to lock in your Vault.
            </div>
            <div class="f-caption">
              The amount of {{ depositSymbol }} you lock up determines how much
              {{ mintSymbol }} you can generate.
            </div>
          </div>
        </f-tooltip>
      </div>

      <f-asset-amount-input
        v-model="depositAmount"
        label="Deposit amount"
        :assets="[deposit]"
        :asset.sync="deposit"
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
        Wallet Bal.<span class="f-blue" @click="depositAmount = depositBalance">
          {{ depositBalance }} </span
        >{{ depositSymbol }}
      </div>
      <div class="f-body-1 f-greyscale-3 my-3 text-center">
        How much {{ mintSymbol }} would you generate?
        <f-tooltip v-model="mintTips" bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              class="icon-tips"
              @click="mintTips = !mintTips"
              v-on="on"
              v-bind="attrs"
              size="20"
              >{{ $icons.mdiHelpCircleOutline }}</v-icon
            >
          </template>
          <div>
            <div class="f-body-1">
              How much {{ mintSymbol }} would you like to generate?
            </div>
            <div class="f-caption">
              Generate an amount that is safely above the liquidation ratio.
            </div>
          </div>
        </f-tooltip>
      </div>
      <div class="f-caption f-greyscale-2"></div>
      <f-asset-amount-input
        v-model="mintAmount"
        label="Mint amount"
        :assets="[mint]"
        :asset.sync="mint"
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
      <!-- <div v-else class="f-caption f-greyscale-3 my-2 ml-4">
        Max avail to generate<span
          class="f-blue"
          @click="mintAmount = mintBalance"
        >
          {{ mintBalance }} </span
        >{{ mintSymbol }}
      </div> -->
      <f-button type="primary" class="mt-5" @click="confirm"
        >Deposit to Generate</f-button
      >
    </v-layout>

    <v-layout column class="my-4 f-bg-greyscale-7">
      <div class="mt-4 mx-4 f-title-1">Predication</div>
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
import { Action, Getter, State } from "vuex-class";
import { IAsset, ICollateral } from "~/services/types/vo";
import { mdiAbTesting } from "@mdi/js";
import { IActionsParams } from "~/services/types/dto";
import { TransactionStatus } from "~/types";
import { toast } from "~/utils/helper";

@Component({
  components: {},
})
export default class GenerateVault extends Mixins(mixins.page) {
  @Getter("auth/isLogged") isLogged;
  @Getter("global/getCollateral") getCollateral;
  @Getter("global/getAssetById") getAssetById;
  @Getter("global/getWalletAssetById") getWalletAssetById;
  @Action("global/syncWalletAsset") syncWalletAsset;
  @Action("global/syncMyVaults") syncMyVaults;
  @State((state) => state.auth.id) user_id!: string;

  depositAmount = "";
  depositTips = false;
  mintAmount = "";
  mintTips = false;
  selectable = true;
  precision = 8;

  collateral = {} as ICollateral;
  deposit = ({} as any) as IAsset;
  mint = ({} as any) as IAsset;

  get depositBalance() {
    return this.getWalletAssetById(this.deposit?.id)?.balance;
  }

  get mintBalance() {
    return this.getWalletAssetById(this.mint?.id)?.balance;
  }

  get depositSymbol() {
    return this.deposit?.symbol || "";
  }

  get mintSymbol() {
    return this.mint?.symbol || "";
  }

  get appbar() {
    return {
      back: true,
      align: "center",
    };
  }

  get title() {
    return `Open a new Vault`;
  }

  get vaultId() {
    return this.$route.query["id"];
  }

  get meta() {
    const depositNum = Number(this.depositAmount);
    const mintNum = Number(this.mintAmount);
    const collateralizationRatio =
      (depositNum * Number(this.collateral?.price)) / mintNum;
    let collateralizationRatioText = `${this.$utils.number.toFixed(
      collateralizationRatio * 100,
      2
    )}`;
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
    const stabilityFee =
      this.$utils.number.toPrecision(Number(this.collateral.duty) - 1) * 100;
    const maxToGenerate =
      Number(this.collateral.line) - Number(this.collateral.debt);
    const maxToGenerateText = this.$utils.number.toPrecision(maxToGenerate);
    if (!this.$utils.number.isValid(collateralizationRatio)) {
      collateralizationRatioText = "-";
      // }else {
      // collateralizationRatioText = `${this.$utils.number.toPercent(collateralizationRatio)}`
    }
    return {
      collateralizationRatio: collateralizationRatioText,
      liquidationPrice: liquidationPriceText,
      currentDepositPrice: `${this.$utils.number.toPrecision(
        this.collateral?.price || "0"
      )}`,
      stabilityFee: this.$utils.number.toFixed(stabilityFee, 2),
      maxToGenerate: maxToGenerateText,
    };
  }

  get infos() {
    return [
      {
        title: "Liquidation Price", // mint * mat / deposit
        value: this.meta.liquidationPrice,
        valueUnit: `${this.mint.symbol}`,
        hint: "Some description about profit.",
      },
      {
        title: "Collateralization Ratio", // deposit * price / mint
        value: this.meta.collateralizationRatio,
        valueUnit: "%",
        valueCustomColor: "green",
        hint: "Some description about profit.",
      },
      {
        title: `Current ${this.deposit?.symbol}/${this.mint?.symbol} Price`,
        value: this.meta.currentDepositPrice,
        valueUnit: `${this.mint.symbol}`,
      },
      {
        title: "Minimum ratio",
        value: this.$utils.number.toFixed(
          Number(this.collateral?.mat) * 100,
          2
        ),
        valueUnit: "%",
      },
      {
        title: "Max available to Generate", // line- debt
        value: this.meta.maxToGenerate,
        valueUnit: this.mint?.symbol,
      },
      {
        title: "Stability Fee",
        value: this.meta.stabilityFee,
        valueUnit: "%",
        hint: "Some description about profit.",
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
    this.collateral = this.getCollateral(this.vaultId);
    this.deposit = this.getAssetById(this.collateral?.gem);
    this.mint = this.getAssetById(this.collateral?.dai);
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
      amount: this.depositAmount,
      asset_id: this.deposit?.id,
      parameters: [
        "bit",
        "31",
        "uuid",
        this.collateral.id,
        "decimal",
        this.mintAmount,
      ],
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
          message: "New Vault has been created.",
          color: "success",
        });
        this.$router.replace("/me");
      }
    }, 3000);
  }
}
</script>
<style lang="scss" scoped>
.icon-tips {
  vertical-align: middle;
}
</style>
