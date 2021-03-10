<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="pa-0">
      <v-layout column>
        <v-layout row align-center class="ma-0 mt-4 pa-0">
          <f-mixin-asset-logo
            class="flex-grow-0 ml-4 mr-1"
            :size="16"
            :logo="collateralLogo"
          ></f-mixin-asset-logo>
          <span class="f-body-1">{{ collateralSymbol }}</span>
          <v-icon class="mx-1" size="12"> {{ $icons.mdiCloseThick }} </v-icon>
          <f-mixin-asset-logo
            class="flex-grow-0 mr-1"
            :size="16"
            :logo="debtLogo"
          ></f-mixin-asset-logo>
          <span>{{ debtSymbol }}</span>
        </v-layout>
        <f-info-grid :window-size="2" class="mt-2">
          <f-info-grid-item
            v-for="(item, ix) in infos"
            :key="ix"
            :index="ix"
            :title="item.title"
            :value="item.value"
            :value-unit="item.valueUnit"
            :value-color="item.valueColor"
            :hint="item.hint"
          ></f-info-grid-item>
        </f-info-grid>
      </v-layout>
    </v-expansion-panel-header>
    <v-expansion-panel-content class="content-panel">
      <v-layout column class="ma-0 pa-0">
        <f-info-grid :window-size="2">
          <f-info-grid-item
            v-for="(item, ix) in collapseInfos"
            :key="ix"
            :index="ix"
            :title="item.title"
            :value="item.value"
            :value-unit="item.valueUnit"
            :value-color="item.valueColor"
            :hint="item.hint"
          ></f-info-grid-item>
        </f-info-grid>
        <v-layout justify-space-around class="buttons">
          <v-btn
            text
            :min-height="68"
            class="f-actionbar-button-label f-caption f-weight-m"
            @click="toDeposit"
          >
            <v-layout column justify-center align-center>
              <v-icon color="primary">{{ $icons.mdiPlusCircle }}</v-icon>
              <div class="caption">{{ $t("button.deposit") }}</div>
            </v-layout>
          </v-btn>
          <v-btn
            text
            :min-height="68"
            class="f-actionbar-button-label f-caption f-weight-m"
            @click="toWithdraw"
          >
            <v-layout column justify-center align-center>
              <v-icon color="primary">{{ $icons.mdiMinusCircle }}</v-icon>
              <div class="caption">{{ $t("button.withdraw") }}</div>
            </v-layout>
          </v-btn>
          <v-btn
            text
            class="f-actionbar-button-label f-caption f-weight-m"
            :min-height="68"
            @click="toGenerate"
          >
            <v-layout column justify-center align-center>
              <v-icon color="green">{{ $icons.mdiLock }}</v-icon>
              <div class="caption">{{ $t("button.generate") }}</div>
            </v-layout>
          </v-btn>
          <v-btn
            text
            :min-height="68"
            class="f-actionbar-button-label f-caption f-weight-m"
            @click="toPayback"
          >
            <v-layout column justify-center align-center>
              <v-icon color="deep-orange">{{ $icons.mdiLockOpen }}</v-icon>
              <div class="caption">{{ $t("button.pay-back") }}</div>
            </v-layout>
          </v-btn>
        </v-layout>
      </v-layout>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter, State } from "vuex-class";
import { ICollateral, IVault } from "~/services/types/vo";

@Component
export default class MyVaultItem extends Vue {
  @Prop() vault!: IVault;
  @State((state) => state.app.settings) settings;
  @Getter("global/getCollateral") getCollateral!: (id) => ICollateral;
  @Getter("global/getAssetById") getAssetById;

  get collateral() {
    return this.getCollateral(this.vault?.collateral_id);
  }

  get collateralAsset() {
    return this.getAssetById(this.collateral?.gem);
  }

  get debtAsset() {
    return this.getAssetById(this.collateral?.dai);
  }

  get collateralLogo() {
    return this.getAssetById(this.collateral?.gem)?.logo;
  }

  get collateralSymbol() {
    return this.collateralAsset?.symbol;
  }

  get debtLogo() {
    return this.getAssetById(this.collateral?.dai)?.logo;
  }

  get debtSymbol() {
    return this.debtAsset?.symbol;
  }

  get meta() {
    const debtAmount =
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1");
    const collateralAmount = Number(this.vault?.ink);
    const collateralizationRatio =
      (collateralAmount * Number(this.collateral?.price)) / debtAmount;
    const collateralizationRatioText = this.$utils.number.toFixed(
      collateralizationRatio * 100,
      2
    );
    const liquidationRatio = Number(this.collateral?.mat);
    const liquidationPrice = (debtAmount * liquidationRatio) / collateralAmount;
    const liquidationPenalty = this.$utils.number.toFixed(
      (Number(this.collateral?.chop) - 1) * 100,
      2
    );
    const stabilityFee = this.$utils.number.toFixed(
      (Number(this.collateral?.duty) - 1) * 100,
      2
    );
    return {
      liquidationPrice: this.$utils.number.toPrecision(liquidationPrice),
      collateralizationRatio: collateralizationRatioText,
      liquidationPenalty,
      stabilityFee,
    };
  }

  get infos() {
    return [
      {
        title: "Collateralization ratio",
        value: this.meta.collateralizationRatio,
        valueUnit: "%",
        hint:
          "The current collateralization ratio, when the ratio reach the minimum ratio, your collateralization will be auctioned.",
      },
      {
        title: "Minimum ratio",
        value: this.$utils.number.toFixed(
          Number(this.collateral?.mat) * 100,
          2
        ),
        valueUnit: "%",
      },
    ];
  }

  get collapseInfos() {
    return [
      {
        title: "Liquidation Price", // debt * ratio / collateral
        value: this.meta?.liquidationPrice,
        valueUnit: "USD",
      },
      {
        title: `Current ${this.collateralSymbol} price`,
        value: this.collateral?.price,
        valueUnit: "USD",
      },
      {
        title: "Liquidation penalty",
        value: this.meta?.liquidationPenalty,
        valueUnit: "%",
      },
      {
        title: "Stability fee",
        value: this.meta?.stabilityFee,
        valueUnit: "%",
      },
    ];
  }
  toDeposit() {
    this.$router.push(`/vault/deposit?id=${this.vault.id}`);
  }
  toWithdraw() {
    this.$router.push(`/vault/withdraw?id=${this.vault.id}`);
  }
  toGenerate() {
    this.$router.push(`/vault/generate?id=${this.vault.id}`);
  }
  toPayback() {
    this.$router.push(`/vault/payback?id=${this.vault.id}`);
  }
}
</script>

<style lang="scss" scoped>
.content-panel {
  ::v-deep {
    .v-expansion-panel-content__wrap {
      padding: 0px 0px;
    }
  }
}
</style>
