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
    return this.vaults.sort((a, b) => {
      return getVaultRisk(this, a) - getVaultRisk(this, b);
    });
  }
}
export default VaultList;
</script>
