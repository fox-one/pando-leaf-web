<template>
  <div class="mx-4">
    <div class="market-overview-label mt-10 greyscale_1--text">
      {{ $t("market.overview") }}
    </div>

    <v-row no-gutters class="pt-6 mb-6">
      <v-col
        v-for="info in infos"
        :key="`${info.title}_${info.value}`"
        class="my-4 pa-0"
        cols="6"
        sm="4"
        md="4"
        lg="3"
      >
        <div class="market-overview-title greyscale_3--text">
          {{ info.title }}
        </div>

        <div align-center class="market-overview-value" :class="info.class">
          <span v-if="info.fiat" class="market-overview-value-symbol"> $ </span>
          {{ info.value }}
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class MarketOverview extends Vue {
  get infos() {
    const { collaterals, supply, collaterilazation } = this.$store.getters[
      "collateral/getOverview"
    ];

    const { toPercent, toFiat } = this.$utils.number;
    const collateralsText = collaterals
      ? toFiat(this, { n: collaterals, short: true })
      : "-";
    const supplyText = supply ? toFiat(this, { n: supply, short: true }) : "-";
    const collaterilazationText = !Number.isNaN(collaterilazation)
      ? toPercent({ n: collaterilazation })
      : "-";
    return [
      {
        title: this.$t("market.total-collaterals"),
        value: collateralsText,
        fiat: true,
      },
      {
        title: this.$t("market.total-supply"),
        value: supplyText,
        fiat: true,
      },
      {
        title: this.$t("market.total-collateralization"),
        value: collaterilazationText,
        class: "market-green",
      },
    ];
  }
}
</script>

<style lang="scss" scoped>
.market-overview-label {
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
}
.market-overview-title {
  font-size: 14px;
  line-height: 17px;
  letter-spacing: -0.006em;
}
.market-overview-value {
  font-weight: bold;
  font-size: 25px;
  line-height: 30px;
  display: flex;
  align-items: center;
  letter-spacing: -0.02em;

  .market-overview-value-symbol {
    font-weight: bold;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 0.011em;
    margin-top: -2px;
  }
}
.market-green {
  color: #47bd61;
}
</style>
