<template>
  <v-sheet class="rounded pa-6" :color="meta.bgColor" @click="handleToDetail">
    <div class="name-text">
      {{ meta.name }}
    </div>

    <v-row>
      <v-col cols="6" class="py-0">
        <f-mixin-asset-logo :size="32" :logo="meta.debtAssetLogo" />
      </v-col>
      <v-col cols="6" class="py-0">
        <f-mixin-asset-logo :size="32" :logo="meta.collateralAssetLogo" />
      </v-col>
      <!--  <v-btn text fab circle rounded small>
        <v-icon size="40" color="primary">$iconMoreInfo</v-icon>
      </v-btn> -->
    </v-row>

    <vault-card-fields v-if="meta.hasCollateral" :id="id" />

    <empty-vault-place-holder class="py-6 mt-3" v-else />

    <vault-card-actions
      class="mt-4 rounded-pill actions__wrapper"
      :id="id"
      :has-collateral="meta.hasCollateral"
      :has-debt="meta.hasDebt"
    />
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import VaultName from "./VaultName.vue";
import VaultCardFields from "./VaultCardFields.vue";
import EmptyVaultPlaceHolder from "./EmptyVaultPlaceHolder.vue";
import VaultCardActions from "./VaultCardActions.vue";
import { getVaultFields } from "@/utils/vault";

@Component({
  components: {
    VaultName,
    VaultCardFields,
    EmptyVaultPlaceHolder,
    VaultCardActions,
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
      debtAmount,
      riskLevelMeta,
    } = getVaultFields(this, this.id);

    return {
      name: `#${vault?.identity_id}`,
      collateralAssetLogo: collateralAsset?.logo ?? "",
      debtAssetLogo: debtAsset?.logo ?? "",
      hasCollateral: Number(vault?.ink) > 0,
      hasDebt: debtAmount > 0,
      bgColor: riskLevelMeta.bg_color,
    };
  }

  handleToDetail() {
    this.$router.push({ name: "vault-detail", query: { id: this.id } });
  }
}
export default VaultListItem;
</script>
<style lang="scss" scoped>
.name-text {
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  text-align: right;
  margin-right: -4px;
  margin-top: -4px;
  opacity: 0.2;
}
.actions__wrapper {
  padding: 16px 32px;
  width: 100%;
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.03);
  background: var(--v-greyscale_7-base);
}
</style>
