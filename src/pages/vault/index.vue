<template>
  <v-container
    class="pa-4"
    :class="[{ 'fill-height': !isLogged || !haveVault }]"
  >
    <login-place-holder v-if="!isLogged" />

    <empty-vaults-place-holder v-else-if="!haveVault" />

    <v-layout column v-else>
      <position-overview class="mb-4" />

      <div class="d-flex align-center py-4 sticky greyscale_7">
        <span class="subtitle-1 font-weight-bold mr-1">
          {{ $t("me.my-vault") }}
        </span>

        <v-spacer />

        <action-create-vault @itemclick="handleItemclick" />
      </div>

      <vault-sorter />

      <vault-list class="mt-1" />

      <div class="mt-6 text-center">
        <action-create-vault @itemclick="handleItemclick">
          <template #activator="{ on }">
            <slot name="activator" :on="on">
              <f-button rounded depressed color="primary" v-on="on">
                <v-icon size="16">$FIconAdd4P</v-icon>
                <span class="text-2 ml-2">{{ $t("common.add-a-vault") }}</span>
              </f-button>
            </slot>
          </template>
        </action-create-vault>
      </div>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import LoginPlaceHolder from "@/components/vault/LoginPlaceHolder.vue";
import EmptyVaultsPlaceHolder from "~/components/vault/EmptyVaultsPlaceHolder.vue";
import PositionOverview from "@/components/vault/PositionOverview.vue";
import VaultList from "@/components/vault/VaultList.vue";
import VaultSorter from "@/components/vault/VaultSorter.vue";
import ActionCreateVault from "@/components/vault/ActionCreateVault.vue";
import mixins from "@/mixins";
import { Get } from "vuex-pathify";
import { LINKS } from "~/constants";

@Component({
  components: {
    LoginPlaceHolder,
    EmptyVaultsPlaceHolder,
    PositionOverview,
    VaultList,
    VaultSorter,
    ActionCreateVault,
  },
})
class VaultPage extends Mixins(mixins.page) {
  @Get("auth/isLogged") isLogged!: boolean;

  @Get("vault/haveVault") haveVault!: boolean;

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

<style lang="scss" scoped>
.sticky {
  position: sticky;
  top: 44px;
  z-index: 14;
}
</style>
