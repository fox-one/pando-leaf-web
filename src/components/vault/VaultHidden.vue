<template>
  <f-bottom-sheet
    v-model="show"
    :persistent="false"
    :adaptive="true"
    :wapper-in-desktop="'dialog'"
    :title="meta.title"
  >
    <template #activator="{ on }">
      <div
        v-on="on"
        v-if="meta.hidden > 0"
        class="my-8 vault-hidden-text greyscale_3--text"
      >
        {{ meta.title }}
        <v-icon size="12" color="primary"> $FIconChevronRight</v-icon>
      </div>
    </template>

    <v-list class="mx-0 pb-16 dialog-content overflow-auto">
      <div v-for="vault in hiddenVaults" :key="vault.id" class="pa-4 mb-n4">
        <vault-list-item :id="vault.id" />
      </div>
    </v-list>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VaultListItem from "./VaultListItem.vue";
import { Get } from "vuex-pathify";

@Component({
  components: {
    VaultListItem,
  },
})
export default class VaultHidden extends Vue {
  @Get("vault/vaults") vaults!: API.Vault[];

  show = false;

  get hiddenVaults() {
    const getters = this.$store.getters as Getter.GettersTree;

    return this.vaults.filter((v) => {
      const { collateralAmount, debtAmount } = getters.getVaultFields(v.id);
      return collateralAmount === 0 && debtAmount === 0;
    });
  }

  get meta() {
    const hidden = this.hiddenVaults?.length;
    return {
      title: `${hidden} Vault Hidden`,
      hidden,
    };
  }
}
</script>
<style lang="scss" scoped>
.vault-hidden-text {
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: center;

  justify-content: center;
  text-align: center;
}

.dialog-content {
  max-height: calc(90vh - 88px);
  height: calc(90vh - 88px);
}
</style>
