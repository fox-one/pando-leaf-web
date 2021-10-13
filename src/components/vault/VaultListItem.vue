<template>
  <v-sheet
    class="rounded pt-6 pb-4"
    :color="meta.bgColor"
    @click="handleToDetail"
  >
    <v-layout align-center class="mb-4 mx-6">
      <vault-name :id="id" />

      <v-spacer />

      <v-btn text fab circle rounded small>
        <v-icon size="40" color="primary">$iconMoreInfo</v-icon>
      </v-btn>
    </v-layout>

    <vault-detail-fields class="mx-4" v-if="meta.hasCollateral" :id="id" />
    <empty-vault-place-holder v-else class="mx-4" />

    <f-divider class="mt-6 mb-4" />

    <vault-actions class="mx-6" :id="id" :has-collateral="meta.hasCollateral" />
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import VaultName from "./VaultName.vue";
import VaultDetailFields from "./VaultDetailFields.vue";
import EmptyVaultPlaceHolder from "./EmptyVaultPlaceHolder.vue";
import VaultActions from "./VaultActions.vue";
import { getVaultFields } from "@/utils/vault";

@Component({
  components: {
    VaultName,
    VaultDetailFields,
    EmptyVaultPlaceHolder,
    VaultActions,
  },
})
class VaultListItem extends Vue {
  @Prop() id!: string;

  get meta() {
    const {
      vault,
      collateral,
      collateralAsset,
      debtAsset,
      riskLevelMeta,
    } = getVaultFields(this, this.id);

    return {
      name: `${collateral?.name ?? ""} #${vault?.identity_id}`,
      collateralAssetLogo: collateralAsset?.logo ?? "",
      debtAssetLogo: debtAsset?.logo ?? "",
      hasCollateral: Number(vault?.ink) > 0,
      bgColor: riskLevelMeta.bg_color,
    };
  }

  handleToDetail() {
    this.$router.push({ name: "vault-detail", query: { id: this.id } });
  }
}
export default VaultListItem;
</script>