<template>
  <v-container class="detail-page">
    <v-layout justify-center>
      <detail-tabs v-model="index" />
    </v-layout>

    <div v-show="index === 0">
      <vault-name :id="vaultId" class="my-8" />
      <vault-detail-fields
        v-if="meta.hasCollateral"
        :id="vaultId"
        class="mb-3"
      />
      <empty-vault-place-holder v-else />

      <div class="greyscale_6 pb-2 mx-n4" />

      <vault-detail-infos :id="vaultId" class="infos" />
    </div>

    <div v-show="index === 1">
      <vault-history :id="vaultId" class="mt-4" />
    </div>

    <div class="actions__wrapper">
      <vault-actions
        :id="id"
        :has-collateral="meta.hasCollateral"
        class="actions"
      />
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import DetailTabs from "@/components/vault/DetailTabs.vue";
import VaultName from "@/components/vault/VaultName.vue";
import VaultDetailFields from "@/components/vault/VaultDetailFields.vue";
import VaultDetailInfos from "@/components/vault/VaultDetailInfos.vue";
import VaultHistory from "@/components/vault/VaultHistory.vue";
import VaultActions from "@/components/vault/VaultActions.vue";
import mixins from "@/mixins";

@Component({
  components: {
    DetailTabs,
    VaultName,
    VaultDetailFields,
    VaultDetailInfos,
    VaultHistory,
    VaultActions,
  },
})
class VaultDetailPage extends Mixins(mixins.page) {
  index = 0;

  get title() {
    return this.$t("vault.detail.title") as string;
  }

  get appbar() {
    return {
      back: true,
    };
  }

  get vaultId() {
    return this.$route.query.id as string;
  }

  get meta() {
    const getVaultFields = this.$utils.vault.getVaultFields;
    const { vault } = getVaultFields(this, this.vaultId);

    return { vault, hasCollateral: Number(vault?.ink) > 0 };
  }
}
export default VaultDetailPage;
</script>

<style lang="scss" scoped>
.infos {
  margin-bottom: 200px;
}

.actions__wrapper {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 30px 16px 50px;
  display: flex;
  justify-content: center;

  .actions {
    background: var(--v-risk_mid_bg-base);
    max-width: 800px;
    border-radius: 8px;
    padding: 16px;
  }
}

.theme--light {
  .actions__wrapper {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 0%,
      #ffffff 24.4%
    );
  }
}
</style>
