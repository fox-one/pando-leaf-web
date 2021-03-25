<template>
  <v-layout column>
    <v-layout class="f-bg-greyscale-7">
      <v-layout column flex-grow-1 class="pa-4 top-view-item">
        <f-mixin-asset-logo
          :size="48"
          :logo="collateralAsset.logo"
        ></f-mixin-asset-logo>
        <div class="f-title-3">抵押物</div>
        <div class="f-body-1">
          {{ collateralAmount }} {{ collateralAsset.symbol }}
        </div>
      </v-layout>
      <v-layout column flex-grow-1 class="pa-4 top-view-item">
        <f-mixin-asset-logo
          :size="48"
          :logo="debtAsset.logo"
        ></f-mixin-asset-logo>
        <div class="f-title-3">债务</div>
        <div class="f-body-1">{{ debtAmount }} {{ debtAsset.symbol }}</div>
      </v-layout>
    </v-layout>
    <vault-stats
      class="my-4"
      :title="''"
      :vault="vault"
      :collateral="collateral"
    />
    <f-action-bar
      class="mx-2 my-4"
      fixed
      @click="handleActionClick"
      :actions="actionButtons"
    ></f-action-bar>
  </v-layout>
</template>

<script lang="ts" scoped>
import { Component, Mixins } from "vue-property-decorator";
import mixins from "~/mixins";
import VaultStats from "@/components/particles/VaultStats.vue";
import BigNumber from "bignumber.js";

@Component({
  components: {
    VaultStats,
  },
})
export default class VaultDetail extends Mixins(mixins.vault) {
  get title() {
    return `${this.collateral?.name} #${this.vault?.identity_id}`;
  }

  get appbar() {
    return {
      align: "center",
    };
  }

  get collateralAmount() {
    return this.vault.ink;
  }

  get debtAmount() {
    return this.$utils.number.toPrecision(
      Number(this.vault.art) * Number(this.collateral.rate),
      8,
      BigNumber.ROUND_UP
    );
  }

  actionButtons = [
    {
      text: this.$t("button.deposit"),
      icon: this.$icons.mdiPlusCircle,
      size: "22",
      color: "primary",
      onClick: (id) => {
        this.$router.push(`/vault/deposit?id=${id}`);
      },
    },
    {
      text: this.$t("button.withdraw"),
      icon: this.$icons.mdiMinusCircle,
      size: "22",
      color: "primary",
      onClick: (id) => {
        this.$router.push(`/vault/withdraw?id=${id}`);
      },
    },
    {
      text: this.$t("button.generate"),
      icon: this.$icons.mdiLock,
      size: "22",
      color: "green",
      onClick: (id) => {
        this.$router.push(`/vault/generate?id=${id}`);
      },
    },
    {
      text: this.$t("button.pay-back"),
      icon: this.$icons.mdiLockOpen,
      size: "22",
      color: "deep-orange",
      onClick: (id) => {
        this.$router.push(`/vault/payback?id=${id}`);
      },
    },
  ];

  handleActionClick({ onClick }) {
    onClick(this.vaultId);
  }
}
</script>

<style lang="scss" scoped>
.top-view-item {
  flex-grow: 1;
  flex-shrink: 0;
  max-width: 50%;
  flex-basis: 50%;
}
</style>
