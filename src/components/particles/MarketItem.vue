<template>
  <v-layout
    @click="generateNewVault"
    align-center
    class="pt-3 f-bg-greyscale-7"
  >
    <v-layout column>
      <v-layout align-center class="ml-4">
        <f-mixin-asset-logo
          class="flex-grow-0 z-index-2"
          :size="24"
          :logo="resize(collateralLogo, 24)"
        ></f-mixin-asset-logo>
        <f-mixin-asset-logo
          class="flex-grow-0 ml-n2"
          :size="24"
          :logo="resize(debtLogo, 24)"
        ></f-mixin-asset-logo>

        <span class="f-body-2 ml-2"> {{ meta.name }}</span>
      </v-layout>
      <!-- <v-layout column class="ml-2"> -->

      <!-- <v-layout row class="ma-0" justify-space-between align-center>
        <span class="f-body-2"> {{ meta.name }}</span>
        <div class="f-greyscale-1 f-body-2 font-weight-bold">
          ${{ meta.collateralValue }}
        </div>
      </v-layout>
      <v-layout row class="ma-0" justify-space-between align-center>
        <div class="f-greyscale-3 f-body-2">
          {{ meta.available }}
        </div>
        <div class="f-greyscale-1 f-body-2">
          {{ meta.rate }}
        </div>
      </v-layout> -->
      <!-- </v-layout> -->
      <v-spacer />
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
    <v-icon class="icon" size="20">{{ "$vuetify.icons.iconListArrow" }}</v-icon>
  </v-layout>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter, State } from "vuex-class";
import { ICollateral } from "~/services/types/vo";

@Component
export default class MarketItem extends Vue {
  @Prop() collateral!: ICollateral;
  @State((state) => state.app.settings) settings;
  @Getter("global/getAssetById") getAssetById;

  get resize() {
    return this.$utils.helper.mixinImageResize;
  }

  get meta() {
    const collateralValue =
      Number(this.collateral.ink) * Number(this.collateral.price);
    const available =
      Number(this.collateral.line) - Number(this.collateral.debt);
    const rate = collateralValue / Number(this.collateral.debt);
    return {
      name: this.collateral.name,
      price: this.collateral.price,
      available: this.$utils.number.toShort(available),
      rate: this.$utils.number.toFixed(rate * 100, 2),
      collateralValue: "$" + this.$utils.number.toPrecision(collateralValue),
    };
  }

  get infos() {
    return [
      {
        title: this.$t("market.item.price"),
        value: this.meta.price,
        valueUnit: this.debtSymbol,
      },
      {
        title: this.$t("market.item.collateral-rate"),
        value: this.meta.rate,
        valueUnit: "%",
      },
      {
        title: this.$t("market.item.max-available"),
        value: this.meta.available,
        valueUnit: this.collateralSymbol,
      },
      {
        title: this.$t("market.item.collaterals"),
        value: this.meta.collateralValue,
        valueUnit: "",
      },
    ];
  }

  get collateralSymbol() {
    return this.getAssetById(this.collateral?.gem)?.symbol;
  }

  get debtSymbol() {
    return this.getAssetById(this.collateral?.dai)?.symbol;
  }

  get collateralLogo() {
    return this.getAssetById(this.collateral?.gem)?.logo;
  }

  get debtLogo() {
    return this.getAssetById(this.collateral?.dai)?.logo;
  }

  generateNewVault() {
    this.$router.push(`/vault/open?id=${this.collateral.id}`);
  }
}
</script>

<style lang="scss" scoped>
.icon {
  align-self: center;
  margin-right: 2px;
  margin-left: 8px;
}
.z-index-2 {
  z-index: 2;
}
.vertical-center {
  vertical-align: middle;
}
</style>
