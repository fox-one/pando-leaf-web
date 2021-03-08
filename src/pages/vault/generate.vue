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
              How much {{ deposit.symbol }} would you like to lock in your
              Vault.
            </div>
            <div class="f-caption">
              The amount of {{ deposit.symbol }} you lock up determines how much
              {{ mint.symbol }} you can generate.
            </div>
          </div>
        </f-tooltip>
      </div>

      <f-asset-amount-input
        v-model="depositAmount"
        label="Deposit amount"
        :asset.sync="deposit"
        :selectable="false"
        :precision="precision"
      >
      </f-asset-amount-input>
      <div class="f-caption f-greyscale-3 mt-1">Wallet Bal.</div>
      <div class="f-body-1 f-greyscale-3 my-3 text-center">
        How much {{ mint.symbol }} would you generate?
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
              How much {{ mint.symbol }} would you like to generate?
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
        :asset.sync="mint"
        :selectable="false"
        :precision="precision"
      >
      </f-asset-amount-input>
      <div class="f-caption f-greyscale-3 mt-1">Wallet Bal.</div>
      <f-button type="primary" class="mt-7">Deposit to Generate</f-button>
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
import { Getter, State } from "vuex-class";
import { IAsset, ICollateral } from "~/services/types/vo";
import { mdiAbTesting } from "@mdi/js";

@Component({
  components: {},
})
export default class GenerateVault extends Mixins(mixins.page) {
  @Getter("global/getCollateral") getCollateral;
  @Getter("global/getAssetById") getAssetById;
  depositAmount = "";
  depositTips = false;
  mintAmount = "";
  mintTips = false;
  selectable = true;
  precision = 8;

  collateral = {} as ICollateral;
  deposit = ({} as any) as IAsset;
  mint = ({} as any) as IAsset;

  get appbar() {
    return {
      back: true,
    };
  }

  get title() {
    return "Generate Vault";
  }

  get vaultId() {
    return this.$route.query["id"];
  }

  get meta() {
    const depositNum = Number(this.depositAmount);
    const mintNum = Number(this.mintAmount);
    const collateralizationRatio =
      (depositNum * Number(this.deposit.price)) / mintNum;
    let collateralizationRatioText = `${this.$utils.number.toPercent(
      collateralizationRatio
    )}`;
    const liquidationPrice =
      (mintNum * Number(this.collateral?.mat || "0")) / depositNum;
    const liquidationPriceText = `${this.$utils.number.toPrecision(
      liquidationPrice
    )}`;
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
      currentDepositPrice: `$${this.$utils.number.toPrecision(
        this.deposit?.price || "0"
      )}`,
      stabilityFee,
      maxToGenerate: maxToGenerateText,
    };
  }

  get infos() {
    return [
      {
        title: "Collateralization Ratio", // deposit * price / mint
        value: this.meta.collateralizationRatio,
        valueCustomColor: "green",
        hint: "Some description about profit.",
      },
      {
        title: "Liquidation Price", // mint * mat / deposit
        value: this.meta.liquidationPrice,
        valueUnit: `${this.mint.symbol}/${this.deposit.symbol}`,
        hint: "Some description about profit.",
      },
      {
        icon: mdiAbTesting,
        title: `Current ${this.deposit?.symbol} Price`,
        value: this.meta.currentDepositPrice,
        // valueUnit: "USD",
      },
      {
        icon: mdiAbTesting,
        title: "Stability Fee",
        value: this.meta.stabilityFee,
        valueUnit: "%",
        hint: "Some description about profit.",
      },
      {
        icon: mdiAbTesting,
        title: "Max available to Generate", // line- debt
        value: this.meta.maxToGenerate,
        valueUnit: this.mint?.symbol,
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
    this.collateral = this.getCollateral(this.vaultId);
    this.deposit = this.getAssetById(this.collateral.gem);
    this.mint = this.getAssetById(this.collateral.dai);
  }
}
</script>
<style lang="scss" scoped>
.generate-pos-btn-wrapper {
  padding-left: 16px;
  margin-top: -14px;
  margin-bottom: -14px;
  .generate-pos-btn {
    width: 36px;
    height: 36px;
    min-width: 36px !important;
    padding: 0 !important;
  }
}
.risk-title {
  font-family: "SF Pro Text";
  font-weight: 700;
}
.icon-tips {
  vertical-align: middle;
}
</style>
