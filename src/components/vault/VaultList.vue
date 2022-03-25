<template>
  <v-row>
    <v-col v-for="vault in sortedVaults" :key="vault.id" cols="12" md="6">
      <vault-list-item :id="vault.id" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VaultListItem from "./VaultListItem.vue";
import { Get, Sync } from "vuex-pathify";

import { getVaultRisk } from "@/utils/vault";
import { SortBy } from "~/enums";

@Component({
  components: {
    VaultListItem,
  },
})
class VaultList extends Vue {
  @Get("vault/vaults") vaults!: API.Vault[];

  @Sync("page/home@sorter") sort!: SortBy;

  get sortedVaults() {
    const { isValid } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;

    const filteredVaults = this.vaults.filter((v) => {
      const { collateralAmount, debtAmount } = getters.getVaultFields(v.id);
      return collateralAmount !== 0 || debtAmount !== 0;
    });

    if (this.sort === SortBy.COLLATERAL_VALUE_ASC) {
      return filteredVaults.sort((a, b) => {
        const aValue = getters.getVaultFields(a.id).collateralAmountUSD;
        const bValue = getters.getVaultFields(b.id).collateralAmountUSD;
        return aValue < bValue ? -1 : 1;
      });
    }

    if (this.sort === SortBy.COLLATERAL_VALUE_DESC) {
      return filteredVaults.sort((a, b) => {
        const aValue = getters.getVaultFields(a.id).collateralAmountUSD;
        const bValue = getters.getVaultFields(b.id).collateralAmountUSD;
        return aValue > bValue ? -1 : 1;
      });
    }

    if (this.sort === SortBy.COLLATERAL_RATIO_ASC) {
      return filteredVaults.sort((a, b) => {
        const collateralRatioA = getters.getVaultFields(a.id).ratio;
        const collateralRatioB = getters.getVaultFields(b.id).ratio;

        if (!isValid(collateralRatioA) || collateralRatioA === 0) return 1;
        if (!isValid(collateralRatioB) || collateralRatioB === 0) return -1;
        return collateralRatioA - collateralRatioB;
      });
    }

    if (this.sort === SortBy.COLLATERAL_RATIO_DESC) {
      return filteredVaults.sort((a, b) => {
        const collateralRatioA = getters.getVaultFields(a.id).ratio;
        const collateralRatioB = getters.getVaultFields(b.id).ratio;

        if (!isValid(collateralRatioA) || collateralRatioA === 0) return 1;
        if (!isValid(collateralRatioB) || collateralRatioB === 0) return -1;
        return collateralRatioB - collateralRatioA;
      });
    }

    return filteredVaults.sort((a, b) => {
      const riskA = getVaultRisk(this, a);
      const riskB = getVaultRisk(this, b);

      if (!isValid(riskA)) return 1;
      if (!isValid(riskB)) return -1;
      return riskA - riskB;
    });
  }
}
export default VaultList;
</script>
