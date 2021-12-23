<template>
  <v-container
    class="pa-4"
    :class="[{ 'fill-height': !isLogged || !haveVault }]"
  >
    <login-place-holder v-if="!isLogged" />

    <empty-vaults-place-holder v-else-if="!haveVault" />

    <v-layout column v-else>
      <position-overview class="mb-4" />

      <div class="d-flex align-center py-4">
        <span class="subtitle-1 font-weight-bold mr-1">
          {{ $t("me.my-vault") }}
        </span>

        <v-spacer />

        <action-create-vault @itemclick="handleItemclick" />
      </div>

      <vault-sorter :sort.sync="sortedBy" />

      <vault-list class="mt-1" :sort="sortedBy" />
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import LoginPlaceHolder from "@/components/vault/LoginPlaceHolder.vue";
import EmptyVaultsPlaceHolder from "~/components/vault/EmptyVaultsPlaceHolder.vue";
import PositionOverview from "@/components/vault/PositionOverview.vue";
import DeskotpPositionRatioCard from "@/components/vault/desktop/PositionRatioCard.vue";
import VaultList from "@/components/vault/VaultList.vue";
import VaultSorter from "@/components/vault/VaultSorter.vue";
import ActionCreateVault from "@/components/vault/ActionCreateVault.vue";
import mixins from "@/mixins";
import { Get } from "vuex-pathify";
import { LINKS } from "~/constants";
import { SortBy } from "~/enums";

@Component({
  components: {
    LoginPlaceHolder,
    EmptyVaultsPlaceHolder,
    PositionOverview,
    DeskotpPositionRatioCard,
    VaultList,
    VaultSorter,
    ActionCreateVault,
  },
})
class VaultPage extends Mixins(mixins.page) {
  @Get("auth/isLogged") isLogged!: boolean;

  @Get("vault/haveVault") haveVault!: boolean;

  sortedBy: SortBy = SortBy.CREATE_TIME_ASC;

  get title() {
    return this.$t("tab.home") as string;
  }

  get appbar() {
    return {
      style: "home" as const,
    };
  }

  get bottomNav() {
    return "vault";
  }

  get meta() {
    return {
      learnMore: LINKS["home.vault"],
    };
  }

  get myVaultHint() {
    return [
      this.$t("tooltip.my-vault-hint-1"),
      this.$t("tooltip.my-vault-hint-2"),
      this.$t("tooltip.my-vault-hint-3"),
    ];
  }

  handleItemclick(item: API.Collateral) {
    this.$router.push({ name: "vault-open", query: { id: item.id } });
  }
}
export default VaultPage;
</script>
