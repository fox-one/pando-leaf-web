<template>
  <div class="vault-name d-flex align-center">
    <base-pair-logo
      :base="meta.collateralAssetLogo"
      :quote="meta.debtAssetLogo"
    />
    <span class="caption ml-1">
      {{ meta.name }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getVaultFields } from "@/utils/vault";

@Component({})
class VaultName extends Vue {
  @Prop() id!: string;

  get meta() {
    const { vault, collateral, collateralAsset, debtAsset } = getVaultFields(
      this,
      this.id
    );

    return {
      name: `${collateral?.name ?? ""} #${vault?.identity_id ?? ""}`,
      collateralAssetLogo: collateralAsset?.logo ?? "",
      debtAssetLogo: debtAsset?.logo ?? "",
    };
  }
}
export default VaultName;
</script>

<style lang="scss" scoped>
.vault-name {
  display: inline;
}
</style>
