<template>
  <v-layout column class="pt-5 ratio-chart-wrapper">
    <div class="ratio-chart pl-4 pl-md-0">
      <vault-position-ratio-item
        v-for="(item, index) in ratioItems"
        :ratio="item"
        :benchmark="benchmark"
        :key="index"
      />
    </div>
    <v-divider class="mt-2" />
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VaultPositionRatioItem from "./VaultPositionRatioItem.vue";
import { Get } from "vuex-pathify";

@Component({
  components: {
    VaultPositionRatioItem,
  },
})
class VaultPositionRatio extends Vue {
  @Get("vault/vaults") vaults!: API.Vault[];

  ratioItems: API.CollateralRatio[] = [];

  benchmark = 0;

  mounted() {
    this.init();
  }

  init() {
    const vaults = this.vaults;

    const ratioMap: Record<string, API.CollateralRatio> = vaults.reduce(
      (acc, vault) => {
        const getVaultFields = this.$utils.vault.getVaultFields;
        const fields = getVaultFields(this, vault.id);
        const { collateralAsset, collateralAmountUSD } = fields;

        if (!collateralAsset) return acc;

        if (acc[collateralAsset.id]) {
          acc[collateralAsset.id].value += collateralAmountUSD;
        } else {
          acc[collateralAsset.id] = {
            value: collateralAmountUSD,
            asset: collateralAsset,
          };
        }

        return acc;
      },
      {}
    );

    // const ratioMap: Record<string, API.CollateralRatio> = {};

    // const assets = this.$store.state.asset.assets;
    // for (let i = 0; i < 10; i++) {
    //   const random = Math.random();
    //   const asset = assets[Math.floor(assets.length * random)];
    //   ratioMap[asset.id] = {
    //     value: 100 * random,
    //     asset,
    //   };
    // }

    const ratioItems = Object.values(ratioMap).sort(
      (a, b) => b.value - a.value
    );

    this.ratioItems = ratioItems;
    this.benchmark = ratioItems[0]?.value;
  }
}
export default VaultPositionRatio;
</script>

<style lang="scss" scoped>
.ratio-chart-wrapper {
  height: 188px;
  justify-content: center;
}

.ratio-chart {
  display: flex;
}

.ratio-chart::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.ratio-chart {
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
