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
import { Get } from "vuex-pathify";

import { getVaultRisk } from "@/utils/vault";

@Component({
  components: {
    VaultListItem,
  },
})
class VaultList extends Vue {
  @Get("vault/vaults") vaults!: API.Vault[];

  get sortedVaults() {
    const { isValid } = this.$utils.number;
    return this.vaults.sort((a, b) => {
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
