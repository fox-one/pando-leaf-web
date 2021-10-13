<template>
  <v-layout column class="pt-5 ratio-chart-wrapper">
    <div class="ratio-chart pl-4 pl-md-0">
      <vault-position-ratio-item
        v-for="(item, index) in meta.ratioItems"
        :ratio="item"
        :benchmark="meta.benchmark"
        :key="index"
      />
    </div>
    <v-divider class="mt-2" />
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VaultPositionRatioItem from "./VaultPositionRatioItem.vue";
import { Sync } from "vuex-pathify";

@Component({
  components: {
    VaultPositionRatioItem,
  },
})
export default class VaultPositionRatio extends Vue {
  @Sync("vault/vaults") vaults!: API.Vault[];

  get meta() {
    const vaults = this.vaults;
    const ratioMap: Record<string, API.CollateralRatio> = vaults.reduce(
      (acc, vault) => {
        const getters = this.$store.getters as Getter.GettersTree;
        const getVaultFields = getters.getVaultFields;
        const fields = getVaultFields(vault.id);
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

    const ratioItems = Object.values(ratioMap).sort(
      (a, b) => b.value - a.value
    );

    return {
      ratioItems,
      benchmark: ratioItems[0]?.value,
    };
  }
}
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
