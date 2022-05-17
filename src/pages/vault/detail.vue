<template>
  <v-container class="pa-0">
    <detail-tabs v-if="desktop" />
    <div v-show="index === 0" class="px-4">
      <vault-name :id="vaultId" class="mt-4" />

      <vault-detail-fields
        v-if="meta.hasCollateral"
        :id="vaultId"
        class="my-3"
      />

      <f-divider v-if="meta.hasCollateral" class="my-3" />

      <vault-detail-infos :id="vaultId" class="infos mt-3" />

      <div
        class="my-3 mx-n4 greyscale_1"
        :style="`height: 8px; opacity: ${dividerOpacity}`"
      />

      <v-layout justify-space-between class="mt-5 mb-2 greyscale_1--text title">
        {{ $t("common.history") }}

        <vault-history-filter :filter.sync="filter" />
      </v-layout>

      <vault-history class="end-blank" :id="vaultId" :filter="filter" />
    </div>

    <div v-show="index === 1">
      <market-item
        :collateral="meta.collateral"
        :show-button="false"
        :disabled="true"
        :expanded="true"
      />
    </div>

    <div class="actions__wrapper">
      <f-divider />

      <v-container class="pa-0">
        <vault-actions
          :id="vaultId"
          :has-collateral="meta.hasCollateral"
          :has-debt="meta.hasDebt"
          old-icons
          class="actions"
        />
      </v-container>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import DetailTabs from "@/components/vault/DetailTabs.vue";
import VaultName from "@/components/vault/VaultName.vue";
import EmptyVaultPlaceHolder from "@/components/vault/EmptyVaultPlaceHolder.vue";
import VaultDetailFields from "@/components/vault/VaultDetailFields.vue";
import VaultDetailInfos from "@/components/vault/VaultDetailInfos.vue";
import VaultHistory from "@/components/vault/VaultHistory.vue";
import VaultHistoryFilter from "@/components/vault/VaultHistoryFilter.vue";
import VaultActions from "@/components/vault/VaultActions.vue";
import MarketItem from "@/components/market/MarketItem.vue";
import mixins from "@/mixins";
import { VatAction } from "~/enums";
import { Sync } from "vuex-pathify";

@Component({
  components: {
    DetailTabs,
    VaultName,
    EmptyVaultPlaceHolder,
    VaultDetailFields,
    VaultDetailInfos,
    VaultHistory,
    VaultHistoryFilter,
    VaultActions,
    MarketItem,
  },
})
class VaultDetailPage extends Mixins(mixins.page) {
  @Sync("page/detail@tabIndex") index!: number;

  filter: VatAction | "all" = "all";

  get dividerOpacity() {
    return this.$vuetify.theme.dark ? 0.2 : 0.05;
  }

  get title() {
    return this.$t("common.vault-detail") as string;
  }

  get appbar() {
    const h = this.$createElement;
    return {
      back: true,
      extension: h(DetailTabs),
    };
  }

  get vaultId() {
    return this.$route.query.id as string;
  }

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { vault, debtAmount, collateral } = getters.getVaultFields(
      this.vaultId
    );

    const hasCollateral = Number(vault?.ink) > 0;
    const hasDebt = debtAmount > 0;

    return { vault, hasCollateral, hasDebt, collateral };
  }
}
export default VaultDetailPage;
</script>

<style lang="scss" scoped>
.actions__wrapper {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .actions {
    background: var(--v-greyscale_7-base);
    height: calc(110px + env(safe-area-inset-bottom));
    align-items: flex-start;
    border-radius: 0px;
    padding: 16px;
  }
}
.title {
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
}
.end-blank {
  margin-bottom: 200px;
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
