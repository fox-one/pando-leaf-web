<template>
  <v-layout column>
    <v-layout class="f-bg-greyscale-7">
      <v-layout column flex-grow-1 class="pa-4 top-view-item">
        <v-layout align-center>
          <f-mixin-asset-logo
            :size="48"
            :logo="collateralAsset.logo"
          ></f-mixin-asset-logo>
          <div class="f-title-3 ml-4">抵押</div>
        </v-layout>
        <div class="f-body-1">
          {{ collateralAmount }} {{ collateralAsset.symbol }}
        </div>
      </v-layout>
      <v-layout column flex-grow-1 class="pa-4 top-view-item">
        <v-layout align-center>
          <f-mixin-asset-logo
            :size="48"
            :logo="debtAsset.logo"
          ></f-mixin-asset-logo>
          <div class="f-title-3 ml-4">债务</div>
        </v-layout>
        <div class="f-body-1">{{ debtAmount }} {{ debtAsset.symbol }}</div>
      </v-layout>
    </v-layout>
    <vault-stats
      class="my-4"
      :title="''"
      :vault="vault"
      :collateral="collateral"
    />
    <div class="px-4">
      <div class="f-greyscale-1 f-title-1 mb-4">
        {{ $t("vault.detail.history") }}
      </div>
      <f-panel
        class="py-0"
        v-infinite-scroll="requestTx"
        infinite-scroll-distance="10"
      >
        <template v-for="(item, index) in histories">
          <v-divider
            :key="`${item.action}_${item.created_at}`"
            v-if="index !== 0"
          />
          <div :key="index" style="overflow: hidden">
            <history-item
              :history="item"
              :vault="vault"
              :collateral="collateral"
            ></history-item>
          </div>
        </template>
        <f-loading class="my-4" v-if="loading" :loading="loading" />
        <template v-else-if="histories.length === 0">
          <base-empty-section />
        </template>
      </f-panel>
    </div>
    <div style="height: 100px"></div>
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
import HistoryItem from "@/components/particles/HistoryItem.vue";
import BigNumber from "bignumber.js";
import { IVaultEvent } from "~/services/types/vo";

@Component({
  components: {
    VaultStats,
    HistoryItem,
  },
})
export default class VaultDetail extends Mixins(mixins.vault) {
  histories = [] as IVaultEvent[];
  has_next = true;
  cursor = null as string | null;
  loading = false;
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

  mounted() {
    this.requestTx();
  }

  async requestTx() {
    if (this.loading || !this.has_next) {
      return;
    }
    this.loading = true;
    try {
      const res = await this.$http.getVaultEvents({
        id: this.vaultId,
        limit: 20,
        cursor: this.cursor,
      });
      const transactions = res?.data?.events || [];
      this.histories = [...this.histories, ...transactions];
      this.has_next = res?.data?.pagination?.has_next || false;
      this.cursor = res?.data?.pagination?.next_cursor || null;
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
    this.loading = false;
  }

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
