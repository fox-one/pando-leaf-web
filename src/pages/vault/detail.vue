<template>
  <v-layout column>
    <v-layout class="f-bg-greyscale-7">
      <v-layout column flex-grow-1 class="pa-4 top-view-item">
        <v-layout align-center>
          <f-mixin-asset-logo
            :size="48"
            :logo="collateralAsset.logo"
          ></f-mixin-asset-logo>
          <div class="f-title-3 ml-4">{{ $t("vault.detail.collateral") }}</div>
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
          <div class="f-title-3 ml-4">{{ $t("vault.detail.debt") }}</div>
        </v-layout>
        <div class="f-body-1">{{ debtAmount }} {{ debtAsset.symbol }}</div>
      </v-layout>
    </v-layout>
    <f-info-grid class="mt-4 f-bg-greyscale-7" :window-size="2">
      <f-info-grid-item
        v-for="(item, ix) in infos"
        :key="ix"
        :index="ix"
        :title="item.title"
        :value="item.value"
        :value-unit="item.valueUnit"
        :value-color="item.valueColor"
        :value-custom-color="item.valueCustomColor"
        :hint="item.hint"
      ></f-info-grid-item>
    </f-info-grid>
    <vault-stats
      class="mb-4 custom-info-grid"
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

  get infos() {
    const debtAmount =
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1");
    const collateralAmount = Number(this.vault?.ink);
    const price = Number(this.collateral?.price);
    const mininumRatio = Number(this.collateral?.mat);
    const maxDebtAvaileble =
      (collateralAmount * price) / mininumRatio - debtAmount;
    const maxDebtAvailebleText = this.$utils.number.toPrecision(
      maxDebtAvaileble,
      8,
      BigNumber.ROUND_DOWN
    );

    if (debtAmount === 0) {
      return this.vault?.ink;
    }
    const maxWithdrawAvaileble =
      collateralAmount - (mininumRatio * debtAmount) / price;
    const maxWithdrawAvailebleText = this.$utils.number.toPrecision(
      maxWithdrawAvaileble,
      8,
      BigNumber.ROUND_DOWN
    );
    return [
      {
        title: this.$t("form.info.available-to-withdraw"),
        value: maxWithdrawAvailebleText,
        valueUnit: this.collateralAsset?.symbol,
      },
      {
        title: this.$t("form.info.available-to-generate"),
        value: maxDebtAvailebleText,
        valueUnit: this.debtAsset?.symbol,
      },
    ];
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
.custom-info-grid {
  ::v-deep {
    .f-info-grid {
      .f-info-grid-inner {
        padding-top: 0px !important;
      }
    }
  }
}
.top-view-item {
  flex-grow: 1;
  flex-shrink: 0;
  max-width: 50%;
  flex-basis: 50%;
}
</style>
