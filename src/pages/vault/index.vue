<template>
  <v-container
    class="pa-4"
    :class="[{ 'fill-height': !isLogged || !haveVault }]"
  >
    <login-place-holder v-if="!isLogged" />

    <empty-vaults-place-holder v-else-if="!haveVault" />

    <v-layout column v-else class="pt-md-6">
      <v-row>
        <v-col cols="12" md="6">
          <position-overview />
        </v-col>

        <v-col cols="12" md="6" class="hidden-sm-and-down">
          <deskotp-position-ratio-card />
        </v-col>
      </v-row>

      <div class="d-flex align-center mt-8 mt-md-14">
        <span class="subtitle-1 font-weight-bold mr-1">{{ "My Vault" }}</span>
        <base-tooltip
          hint="'Pando leaf is product description product description product description product description'"
        />
      </div>

      <vault-list class="mt-3" />

      <div class="text-center mt-8">
        <action-create-vault @itemclick="handleItemclick" />
      </div>
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
import ActionCreateVault from "@/components/vault/ActionCreateVault.vue";
import mixins from "@/mixins";
import { Get } from "vuex-pathify";

@Component({
  components: {
    LoginPlaceHolder,
    EmptyVaultsPlaceHolder,
    PositionOverview,
    DeskotpPositionRatioCard,
    VaultList,
    ActionCreateVault,
  },
})
class VaultPage extends Mixins(mixins.page) {
  @Get("auth/isLogged") isLogged!: boolean;

  @Get("vault/haveVault") haveVault!: boolean;

  @Get("vault/vaults") vaults!: API.Vault[];

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

  handleItemclick(item: API.Collateral) {
    this.$router.push({ name: "vault-open", query: { id: item.id } });
  }
}
export default VaultPage;
</script>
