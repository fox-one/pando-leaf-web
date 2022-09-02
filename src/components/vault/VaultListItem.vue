<template>
  <v-sheet class="rounded pa-6" :color="meta.bgColor" @click="handleToDetail">
    <v-row class="pt-3">
      <v-col
        class="py-0"
        :cols="meta.hasCollateral ? 6 : 12"
        :class="meta.hasCollateral ? '' : 'text-center'"
      >
        <f-mixin-asset-logo :size="32" :logo="meta.collateralAssetLogo" />
      </v-col>
      <v-col cols="6" v-if="meta.hasCollateral" class="py-0">
        <f-mixin-asset-logo :size="32" :logo="meta.debtAssetLogo" />
      </v-col>
    </v-row>

    <vault-card-fields v-if="meta.hasCollateral" class="pt-2" :id="id" />

    <empty-vault-place-holder class="pt-5 mt-3" v-else :id="id" />

    <div
      v-if="meta.inHighRisk"
      class="risk_high--text mt-4 mb-1 f-caption font-weight-medium"
    >
      *{{ $t("vault.high-risk") }}
    </div>

    <vault-card-actions
      class="mt-6 rounded actions__wrapper"
      :class="meta.actionColor"
      :id="id"
      :has-collateral="meta.hasCollateral"
      :has-debt="meta.hasDebt"
    />
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import VaultName from "@/components/vault/VaultName.vue";
import VaultCardFields from "@/components/vault/VaultCardFields.vue";
import EmptyVaultPlaceHolder from "@/components/vault/EmptyVaultPlaceHolder.vue";
import VaultCardActions from "@/components/vault/VaultCardActions.vue";
import { getVaultFields } from "@/utils/vault";
import { RISK } from "~/enums";

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
    const { vault, collateralAsset, debtAsset, debtAmount, riskLevelMeta } =
      getVaultFields(this, this.id);

    const bgColor = riskLevelMeta.bg_color;
    const isDark = this.$vuetify.theme.dark;
    const actionColor = isDark
      ? riskLevelMeta.value === RISK.NA
        ? "greyscale_5"
        : bgColor + "_action"
      : "greyscale_7";
    const inHighRisk = riskLevelMeta.value === RISK.HIGH;

    return {
      name: `#${vault?.identity_id}`,
      collateralAssetLogo: collateralAsset?.logo ?? "",
      debtAssetLogo: debtAsset?.logo ?? "",
      hasCollateral: Number(vault?.ink) > 0,
      hasDebt: debtAmount > 0,
      bgColor,
      actionColor,
      inHighRisk,
    };
  }

  handleToDetail() {
    this.$router.push(
      this.localePath({ name: "vault-detail", query: { id: this.id } })
    );
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
  padding: 16px 16px;
  width: 100%;
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.03);
}
</style>
