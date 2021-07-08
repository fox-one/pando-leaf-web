<template>
  <v-card elevation="0" class="pa-0 rounded-lg f-bg-greyscale-6">
    <v-layout column>
      <v-row class="ma-4 align-center">
        <f-mixin-asset-logo
          class="flex-grow-0 z-index-2"
          :size="40"
          :logo="collateralLogo"
        ></f-mixin-asset-logo>
        <f-mixin-asset-logo
          class="flex-grow-0 ml-n2"
          :size="40"
          :logo="debtLogo"
        ></f-mixin-asset-logo>
        <span class="f-title-1 ml-2"> {{ meta.name }}</span>
        <v-spacer />
      </v-row>
      <v-row class="ma-0 pa-0 pb-2">
        <v-col
          class="ma-0 mt-2 mb-4 pa-0 pl-6"
          cols="6"
          xs="6"
          sm="6"
          md="4"
          lg="3"
          v-for="(item, ix) in infos"
          :key="ix"
        >
          <v-layout align-center :class="`f-caption ${item.labelClass}`">
            {{ item.title }} <base-tooltip class="ml-1" :hint="item.hint" />
          </v-layout>
          <div :class="`f-body-2 font-weight-medium ${item.valueClass}`">
            {{ item.value }} {{ item.valueUnit }}
          </div>
        </v-col>
      </v-row>
      <f-button class="mx-6 mb-6" @click="generateNewVault"
        >+ {{ $t("market.item.add-a-vault") }}</f-button
      >
    </v-layout>
  </v-card>
</template>

<script lang="ts" scoped>
import dayjs from "dayjs";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Action, Getter, State } from "vuex-class";
import { ICollateral, IOracle } from "~/services/types/vo";
import MarketSelectModal from "@/components/particles/MarketSelectModal.vue";

@Component({
  components: {
    MarketSelectModal,
  },
})
export default class MarketItem extends Vue {
  @Prop() collateral!: ICollateral;
  @State((state) => state.app.settings) settings;
  @Getter("global/getAssetById") getAssetById;
  @Getter("oracle/findByAssetId") getOracle!: (id) => IOracle;
  @Action("oracle/sync") syncOracles;
  @Action("global/syncMarkets") syncMarkets;

  get resize() {
    return this.$utils.helper.mixinImageResize;
  }

  get gemOracle() {
    return this.getOracle(this.collateral.gem);
  }

  get daiOracle() {
    return this.getOracle(this.collateral.dai);
  }

  get meta() {
    const collateralValue =
      Number(this.collateral.ink) * Number(this.collateral.price);
    const available = this.$utils.collateral.maxAvailable(this.collateral);
    const rate = collateralValue / Number(this.collateral.art);
    return {
      name: this.collateral.name,
      price: this.collateral.price,
      available: this.$utils.number.toPrecision(available),
      rate: this.$utils.number.toFixed(rate * 100, 2),
      collateralAmount: this.collateral.ink,
      debtAmount: Number(this.collateral.art) * Number(this.collateral.rate),
      collateralValue: "$" + this.$utils.number.toPrecision(collateralValue),
    };
  }

  get infos() {
    return [
      {
        title: this.$t("market.item.total-asset-symbol", {
          symbol: this.collateralSymbol,
        }),
        value: this.$utils.number.toPrecision(this.meta.collateralAmount),
        valueUnit: this.collateralSymbol,
        labelClass: "font-weight-bold f-greyscale-1",
        valueClass: "font-weight-bold f-greyscale-1",
        hint: "",
      },
      {
        title: this.$t("market.item.max-available"),
        value: this.meta.available,
        valueUnit: this.debtSymbol,
        labelClass: "font-weight-bold f-greyscale-1",
        valueClass: "font-weight-bold f-greyscale-1",
      },
      {
        title: this.$t("market.item.collateral-rate"),
        value: this.meta.rate,
        valueUnit: "%",
        labelClass: "font-weight-bold market-green",
        valueClass: "font-weight-bold market-green",
        hint: "",
      },
      {
        title: this.$t("market.item.price"),
        value: this.$utils.number.toPrecision(this.meta.price),
        valueUnit: this.debtSymbol,
        labelClass: "text--disabled f-greyscale-1 font-weight-regular",
        valueClass: "f-greyscale-1",
      },
      {
        title: this.$t("market.item.symbol-debt", {
          symbol: this.debtSymbol,
        }),
        value: this.$utils.number.toPrecision(this.meta.debtAmount),
        valueUnit: this.debtSymbol,
        labelClass: "text--disabled f-greyscale-1 font-weight-regular",
        valueClass: "f-greyscale-1",
      },
      {
        title: this.isValidOracle ? this.$t("market.item.oracle-next") : "",
        value: this.isValidOracle
          ? this.$utils.number.toPrecision(
              this.$utils.time.oracleNext(this.gemOracle, this.daiOracle)?.price
            )
          : "",
        valueUnit: this.isValidOracle ? this.debtSymbol : "",
        hint: this.isValidOracle
          ? this.$t("market.item.oracle-content", {
              time: this.countDownText,
            })
          : "",
        labelClass: "text--disabled f-greyscale-1 font-weight-regular",
        valueClass: "f-greyscale-1",
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

  get isValidOracle() {
    const next = this.$utils.time.oracleNext(this.gemOracle, this.daiOracle);
    return next && next.peek_at && dayjs(next.peek_at).isAfter(Date.now());
  }

  @Watch("gemOracle")
  onOracleUpdate(newVal: IOracle) {
    if (newVal && this.isValidOracle) {
      clearInterval(this.countId);
      this.countDownTimer =
        this.$utils.time
          .oracleNext(this.gemOracle, this.daiOracle)
          .peek_at.diff(Date.now()) / 1000;
      this.startCountDown();
    }
  }

  @Watch("daiOracle")
  onDaiOracleUpdate(newVal: IOracle) {
    if (newVal && this.isValidOracle) {
      clearInterval(this.countId);
      this.countDownTimer =
        this.$utils.time
          .oracleNext(this.gemOracle, this.daiOracle)
          .peek_at.diff(Date.now()) / 1000;
      this.startCountDown();
    }
  }

  countDownTimer = 0;
  countDownText = "";
  countId = 0 as any;

  startCountDown() {
    if (this.countDownTimer <= 0) return;
    clearInterval(this.countId);
    this.countId = setInterval(() => {
      this.countDownTimer =
        this.$utils.time
          .oracleNext(this.gemOracle, this.daiOracle)
          .peek_at.diff(Date.now()) / 1000;
      this.countDownText = dayjs
        .duration(this.countDownTimer, "seconds")
        .format("mm:ss");
      if (this.countDownTimer <= 0) {
        clearInterval(this.countId);
        this.syncMarkets();
        this.syncOracles();
      }
    }, 100);
  }

  toMarketDetail() {
    this.$router.push(`/market/${this.collateral.id}`);
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
.market-green {
  color: #47bd61;
}
</style>
