<template>
  <div class="vault-name" :style="[{ background: meta.color }]">
    <div class="name-text">
      {{ meta.name }}
    </div>

    <v-row no-gutters class="pb-6">
      <v-col cols="6" class="vault-content">
        <f-mixin-asset-logo :size="32" :logo="meta.debtAssetLogo" />

        <p class="content-text">
          {{ meta.debtAmount }} {{ meta.debtAssetSymbol }}
        </p>

        <p class="label-text mt-2 mb-0">{{ $t("common.debt") }}</p>
      </v-col>

      <v-col cols="6" class="vault-content">
        <f-mixin-asset-logo :size="32" :logo="meta.collateralAssetLogo" />

        <p class="content-text">
          {{ meta.collateralAmount }} {{ meta.collateralAssetSymbol }}
        </p>

        <p class="label-text mt-2 mb-0">{{ $t("common.collateral") }}</p>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
class VaultName extends Vue {
  @Prop() id!: string;

  get meta() {
    const { format } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;
    const {
      vault,
      collateralAsset,
      debtAsset,
      riskLevelMeta,
      debtAmount,
      collateralAmount,
    } = getters.getVaultFields(this.id);

    return {
      name: `#${vault?.identity_id ?? ""}`,
      collateralAssetLogo: collateralAsset?.logo ?? "",
      collateralAssetSymbol: collateralAsset?.symbol ?? "",
      collateralAmount: format({ n: collateralAmount ?? 0 }),
      debtAssetLogo: debtAsset?.logo ?? "",
      debtAssetSymbol: debtAsset?.symbol ?? "",
      debtAmount: format({ n: debtAmount ?? 0 }),
      color: this.$vuetify.theme.currentTheme[riskLevelMeta.bg_color],
    };
  }
}
export default VaultName;
</script>

<style lang="scss" scoped>
.vault-name {
  border-radius: 8px;
}
.name-text {
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  text-align: right;
  padding-right: 12px;
  padding-top: 12px;
  opacity: 0.2;
}
.vault-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.content-text {
  margin-top: 10px;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  margin-bottom: 0px;
  color: var(--v-greyscale_1-base);
}
.label-text {
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: var(--v-greyscale_1-base);
  opacity: 0.4;
}
</style>
