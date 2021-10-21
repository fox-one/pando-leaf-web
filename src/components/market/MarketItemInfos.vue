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
        <base-tooltip v-if="item.hint" class="ml-1" :hint="item.hint" />
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
import { isValidOracle } from "@/utils/oracle";

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
      collateralAsset,
      collateralAmount,
      debtAmount,
      debtAsset,
      collateralFiat,
      maxAvailable,
      nextPrice,
    } = getters.getMarketFields(this.collateral.id);
    const { toPrecision, toPercent } = this.$utils.number;

    const rate = collateralFiat / Number(this.collateral.art);
    return {
      name: this.collateral.name,
      price: toPrecision({ n: this.collateral.price }),
      available: toPrecision({ n: maxAvailable }),
      rate: Number.isNaN(rate) ? "-" : toPercent({ n: rate }),
      collateralAmount: toPrecision({ n: collateralAmount }),
      debtAmount: toPrecision({ n: debtAmount }),
      collateralFiat: "$" + toPrecision({ n: collateralFiat }),
      collateralSymbol,
      debtSymbol,
      collateralLogo: collateralAsset?.logo,
      debtLogo: debtAsset?.logo,
      nextPrice,
      isValidOracle: this.$utils.oracle.isValidOracle(nextPrice),
    };
  }

  get infos() {
    const infoList = [
      {
        title: this.$t("market.item.total-asset-symbol", {
          symbol: this.meta.collateralSymbol,
        }),
        value: this.meta.collateralAmount,
        valueUnit: this.meta.collateralSymbol,
        labelClass: "font-weight-bold f-greyscale-1",
        valueClass: "font-weight-bold f-greyscale-1",
        hint: this.$t("market.item.hint.total-asset", {
          symbol: this.meta.collateralSymbol,
        }),
      },
      {
        title: this.$t("market.item.max-available"),
        value: this.meta.available,
        valueUnit: this.meta.debtSymbol,
        labelClass: "font-weight-bold f-greyscale-1",
        valueClass: "font-weight-bold f-greyscale-1",
      },
      {
        title: this.$t("market.item.collateral-rate"),
        value: this.meta.rate,
        labelClass: "font-weight-bold market-green",
        valueClass: "font-weight-bold market-green",
        hint: this.$t("form.tooltip.collateralization-ratio"),
      },
      {
        title: this.$t("market.item.price"),
        value: this.meta.price,
        valueUnit: this.meta.debtSymbol,
        labelClass: "text--disabled f-greyscale-1 font-weight-regular",
        valueClass: "f-greyscale-1",
      },
      {
        title: this.$t("market.item.symbol-debt", {
          symbol: this.meta.debtSymbol,
        }),
        value: this.meta.debtAmount,
        valueUnit: this.meta.debtSymbol,
        labelClass: "text--disabled f-greyscale-1 font-weight-regular",
        valueClass: "f-greyscale-1",
      },
      {
        title: this.meta.isValidOracle
          ? this.$t("market.item.oracle-next")
          : "",
        value: this.meta.isValidOracle
          ? this.$utils.number.toPrecision({
              n: this.meta.nextPrice?.price ?? "0",
            })
          : "",
        valueUnit: this.meta.isValidOracle ? this.meta.debtSymbol : "",
        hint: this.meta.isValidOracle
          ? this.$t("form.info.oracle-price", {
              time: this.countDownText,
            })
          : false,
        labelClass: "text--disabled f-greyscale-1 font-weight-regular",
        valueClass: "f-greyscale-1",
      },
    ];
    return infoList;
  }

  @Watch("meta.nextPrice")
  onDaiOracleUpdate(newVal: Utils.NextPrice) {
    if (newVal && this.meta.isValidOracle) {
      console.log(newVal, this.meta.nextPrice);
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
