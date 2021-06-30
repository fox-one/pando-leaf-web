<template>
  <v-container class="pa-0 desktop-support f-bg-greyscale-7">
    <v-layout column class="px-4">
      <div class="f-body-1 font-weight-medium mt-10">
        {{ $t("market.overview") }}
      </div>
      <v-row no-gutters class="pt-6">
        <v-col class="my-4 pa-0" cols="6" xs="6" sm="4" md="4" lg="3">
          <div class="f-caption">{{ $t("market.total-collaterals") }}</div>
          <h2>{{ total.collaterals }}</h2>
        </v-col>
        <v-col class="my-4 pa-0" cols="6" xs="6" sm="4" md="4" lg="3">
          <div class="f-caption">{{ $t("market.total-supply") }}</div>
          <h2>{{ total.supply }}</h2>
        </v-col>
        <v-col class="my-4 pa-0" cols="6" xs="6" sm="4" md="4" lg="3">
          <div class="f-caption">
            {{ $t("market.total-collateralization") }}
          </div>
          <h2 class="f-green">{{ total.collaterilazation }}</h2>
        </v-col>
      </v-row>
      <market-item
        v-for="item in collaterals"
        :collateral="item"
        :key="item.id"
      ></market-item>
    </v-layout>
  </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import { Action, Getter, State } from "vuex-class";
import MarketItem from "@/components/particles/MarketItem.vue";
import { ICollateral } from "~/services/types/vo";

@Component({
  components: {
    MarketItem,
  },
})
export default class Market extends Mixins(mixins.page) {
  @State((state) => state.global.collaterals) collaterals!: ICollateral[];
  @Getter("global/getAssetById") getAssetById;
  @Action("global/syncMarkets") syncMarkets;

  get appbar() {
    if (!this.isLogged) {
      return {
        back: false,
        avatar: false,
        customContent: true,
        mixinImmersive: this.$utils.helper.isMixin(),
      };
    }
    return {
      back: false,
      customContent: true,
      avatar: true,
      mixinImmersive: this.$utils.helper.isMixin(),
    };
  }

  get bottomNav() {
    return "market";
  }

  get total() {
    if (!this.collaterals || this.collaterals.length === 0) {
      return {
        supply: "-",
        collaterals: "-",
      };
    }
    let col = 0;
    let dai = 0;
    this.collaterals.forEach((c) => {
      const colAsset = this.getAssetById(c?.gem);
      const daiAsset = this.getAssetById(c?.dai);
      const colAmount = Number(c.ink || "0");
      const daiAmount = Number(c.art || "0") * Number(c.rate || "1");
      const colPrice = Number(colAsset?.price || "0");
      const daiPrice = Number(daiAsset?.price || "0");
      col += colAmount * colPrice;
      dai += daiAmount * daiPrice;
    });
    return {
      collaterals: "$" + this.$utils.number.toShort(col),
      supply: "$" + this.$utils.number.toShort(dai),
      collaterilazation: this.$utils.number.toPercent(col / dai),
    };
  }

  toTrade() {
    this.$router.replace("/");
  }

  intervalId = 0 as any;

  mounted() {
    if (this.isLogged) {
      this.$utils.helper.loadWalletAssets(this);
    }
    this.intervalId = setInterval(() => {
      this.syncMarkets();
      this.syncOracles();
    }, 3000);
    this.syncMarkets();
  }

  beforeDestroy() {
    clearInterval(this.intervalId);
  }
}
</script>

<style lang="scss" scoped>
.desktop-support {
  max-width: 1100px !important;
}

.market-table-title {
  opacity: 0.5;
  font-weight: normal;
  font-style: normal;
}

.arrow-right {
  position: relative;
  float: right;
  right: 30px;
  transform: translateY(52px);
}
.market-app-bar {
  width: 100% !important;
  left: unset !important;
  right: unset !important;
}
</style>
