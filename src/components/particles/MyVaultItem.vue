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
          <v-icon class="mx-2" size="12"> {{ $icons.mdiCloseThick }} </v-icon>
          <f-mixin-asset-logo
            class="flex-grow-0 mr-1"
            :size="16"
            :logo="debtLogo"
          ></f-mixin-asset-logo>
          <span>{{ debtSymbol }}</span>
        </v-layout>
        <f-info-grid :window-size="2">
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
        <v-flex d-flex flex-row justify-space-around class="buttons">
          <v-btn
            text
            class="f-actionbar-button-label f-caption f-weight-m mt-4"
            @click="toDeposit"
          >
            <v-flex d-flex flex-column justify-center align-center>
              <v-icon color="primary">{{ $icons.mdiPlusCircle }}</v-icon>
              <div class="caption">{{ $t("button.deposit") }}</div>
            </v-flex>
          </v-btn>
          <v-btn
            text
            class="f-actionbar-button-label f-caption f-weight-m mt-4"
            @click="toWithdraw"
          >
            <v-flex d-flex flex-column justify-center align-center>
              <v-icon :color="colors.redeem">{{
                $icons.mdiMinusCircle
              }}</v-icon>
              <div class="caption">{{ $t("button.withdraw") }}</div>
            </v-flex>
          </v-btn>
          <v-btn
            text
            class="f-actionbar-button-label f-caption f-weight-m mt-4"
            @click="toGenerate"
          >
            <v-flex d-flex flex-column justify-center align-center>
              <v-icon :color="colors.pledge">{{ $icons.mdiLock }}</v-icon>
              <div class="caption">{{ $t("button.generate") }}</div>
            </v-flex>
          </v-btn>
          <v-btn
            text
            class="f-actionbar-button-label f-caption f-weight-m mt-4"
            @click="toPayback"
          >
            <v-flex d-flex flex-column justify-center align-center>
              <v-icon :color="colors.unpledge">{{ $icons.mdiLockOpen }}</v-icon>
              <div class="caption">{{ $t("button.pay-back") }}</div>
            </v-flex>
          </v-btn>
        </v-flex>
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

  get colors() {
    return {
      redeem: "primary",
      pledge: "#32cd70",
      unpledge: "#dd783f",
    };
  }

  get meta() {
    return {
      name: this.collateral?.name,
      price: this.collateral?.price,
      rate: this.$utils.number.toPercent(this.collateral?.duty),
      rho: this.$utils.time.format(this.collateral?.rho),
    };
  }

  get infos() {
    return [
      //   {
      //     title: "Liquidation Price", // debt * ratio / collateral
      //     value: this.meta?.liquidationPrice,
      //     valueUnit: "USD",
      //   },
      //   {
      //     title: `Collateralization ratio`, //
      //     value: this.meta?.collateralizationRatio,
      //     valueUnit: `%`,
      //   },
      {
        title: `Current ${this.collateral?.name} price`,
        value: this.collateral?.price,
        valueUnit: "USD",
      },
      {
        title: "Minimum ratio",
        value: this.$utils.number.toFixed(
          Number(this.collateral?.mat) * 100,
          2
        ),
        valueUnit: "%",
        hint: "Some description about profit.",
      },
      //   {
      //     title: "Liquidation penalty",
      //     value: this.meta?.liquidationPenalty,
      //     valueUnit: "%",
      //   },
      //   {
      //     title: "Stability fee",
      //     value: this.meta?.stabilityFee,
      //     valueUnit: "%",
      //   },
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
  .buttons {
    padding-bottom: 16px;
  }
}
</style>
