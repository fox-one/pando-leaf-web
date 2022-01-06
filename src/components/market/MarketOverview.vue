<template>
  <div class="mx-4">
    <v-row no-gutters class="mt-5">
      <v-col
        v-for="info in infos"
        :key="`${info.title}_${info.value}`"
        class="mb-5 pa-0"
        cols="6"
        sm="4"
        md="4"
        lg="3"
      >
        <div class="market-overview-title greyscale_3--text">
          {{ info.title }}
        </div>

        <div align-center class="market-overview-value" :class="info.class">
          <span v-if="info.fiat" class="market-overview-value-symbol">
            US$
          </span>
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
    const { collaterals, supply, collaterilazation } =
      this.$store.getters["collateral/getOverview"];

    const { toPercent, simplize } = this.$utils.number;
    const collateralsText = collaterals ? simplize({ n: collaterals }) : "-";
    const supplyText = supply ? simplize({ n: supply }) : "-";
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
  margin-top: 16px;
  display: flex;
  align-items: baseline;
  letter-spacing: -0.02em;

  .market-overview-value-symbol {
    font-weight: bold;
    font-size: 16px;
  }
}
.market-green {
  color: #47bd61;
}
</style>
