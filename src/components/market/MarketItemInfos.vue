<template>
  <v-row no-gutters class="pb-2">
    <v-col
      class="mt-2 mb-4 pl-6"
      cols="6"
      md="4"
      lg="3"
      v-for="(item, ix) in infos"
      :key="ix"
    >
      <div :class="`market-item-label ${item.labelClass}`">
        {{ item.title }}
        <base-tooltip
          v-if="item.hint"
          class="ml-1"
          :hint="item.hint"
          :learn-more="item.learnMore"
        />
      </div>

      <div :class="`market-item-value ${item.valueClass}`">
        {{ item.value }} {{ item.valueUnit }}
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts" scoped>
import dayjs from "dayjs";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Get, Sync } from "vuex-pathify";
import { LINKS } from "~/constants";

@Component({
  components: {},
})
export default class MarketItemInfos extends Vue {
  @Prop() collateral!: API.Collateral;

  @Sync("state/app@settings") settings;

  @Get("oracle/getOracleById") getOracleById;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const {
      collateralSymbol,
      debtSymbol,
      collateralPrice,
      collateralAsset,
      collateralAmount,
      debtAmount,
      debtAsset,
      collateralFiat,
      maxAvailable,
      nextPrice,
    } = getters.getMarketFields(this.collateral.id);
    const { toPrecision, toPercent, toFiat } = this.$utils.number;

    const rate = collateralFiat / Number(this.collateral.art);

    const isValidOracle =
      collateralPrice !== nextPrice?.price &&
      this.$utils.oracle.isValidOracle(nextPrice);
    return {
      name: this.collateral.name,
      price: toPrecision({ n: this.collateral.price }),
      available: toFiat(this, { n: maxAvailable, short: true }),
      rate: Number.isNaN(rate) ? "-" : toPercent({ n: rate }),
      collateralAmount: toFiat(this, { n: collateralAmount, short: true }),
      debtAmount: toFiat(this, { n: debtAmount, short: true }),
      collateralFiat: "$" + toPrecision({ n: collateralFiat }),
      collateralSymbol,
      debtSymbol,
      collateralLogo: collateralAsset?.logo,
      debtLogo: debtAsset?.logo,
      nextPrice,
      isValidOracle,
    };
  }

  get infos() {
    const infoList = [
      {
        title: this.$t("market.total-asset-symbol", {
          symbol: this.meta.collateralSymbol,
        }),
        value: this.meta.collateralAmount,
        valueUnit: this.meta.collateralSymbol,
        labelClass: "font-weight-bold f-greyscale-1",
        valueClass: "font-weight-bold f-greyscale-1",
        hint: this.$t("tooltip.total-asset-in-market", {
          symbol: this.meta.collateralSymbol,
        }),
      },
      {
        title: this.$t("common.max-available"),
        value: this.meta.available,
        valueUnit: this.meta.debtSymbol,
        labelClass: "font-weight-bold f-greyscale-1",
        valueClass: "font-weight-bold f-greyscale-1",
      },
      {
        title: this.$t("common.collateral-ratio"),
        value: this.meta.rate,
        labelClass: "font-weight-bold market-green",
        valueClass: "font-weight-bold market-green",
        hint: this.$t("tooltip.collateralization-ratio"),
        learnMore: LINKS["vault.liquidation-ratio"],
      },
      {
        title: this.$t("common.price"),
        value: this.meta.price,
        valueUnit: this.meta.debtSymbol,
        labelClass: "text--disabled f-greyscale-1 font-weight-regular",
        valueClass: "f-greyscale-1",
      },
      {
        title: this.$t("common.symbol-debt", {
          symbol: this.meta.debtSymbol,
        }),
        value: this.meta.debtAmount,
        valueUnit: this.meta.debtSymbol,
        labelClass: "text--disabled f-greyscale-1 font-weight-regular",
        valueClass: "f-greyscale-1",
      },
      {
        title: this.$t("common.next-price"),
        value: this.meta.isValidOracle
          ? this.$utils.number.toPrecision({
              n: this.meta.nextPrice?.price ?? "0",
            })
          : "-",
        valueUnit: this.meta.debtSymbol,
        hint: this.meta.isValidOracle
          ? this.$t("tooltip.next-price", {
              time: this.countDownText,
            })
          : false,
        learnMore: LINKS["vault.price-oracles"],
        labelClass: "text--disabled f-greyscale-1 font-weight-regular",
        valueClass: "f-greyscale-1",
      },
    ];
    return infoList;
  }

  @Watch("meta.nextPrice", { immediate: true })
  onDaiOracleUpdate(newVal: Utils.NextPrice) {
    if (newVal && this.meta.isValidOracle) {
      clearInterval(this.countId);
      this.countDownTimer =
        dayjs(this.meta.nextPrice?.time).diff(Date.now()) / 1000;
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
        dayjs(this.meta.nextPrice?.time).diff(Date.now()) / 1000;
      this.countDownText = dayjs
        .duration(this.countDownTimer, "seconds")
        .format("mm:ss");
      if (this.countDownTimer <= 0) {
        clearInterval(this.countId);
        this.$utils.app.loadMarket(this);
      }
    }, 100);
  }
}
</script>

<style lang="scss" scoped>
.market-item-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 12px;
}
.market-item-value {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: -0.006em;
}
.vertical-center {
  vertical-align: middle;
}
</style>
