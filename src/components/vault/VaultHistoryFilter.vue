<template>
  <f-bottom-sheet
    v-model="show"
    :persistent="false"
    :adaptive="true"
    wapper-in-desktop="menu"
    :title="$t('history.filter-title')"
  >
    <template #activator="{ on }">
      <div v-on="on" class="history-activator">
        {{ filterItem.text }}
        <v-icon color="greyscale_1" size="16">$FIconChevronDown4P</v-icon>
      </div>
    </template>

    <f-list>
      <f-list-item
        v-for="item in filters"
        :key="item.value"
        :title="item.text"
        @click="handleClick(item)"
      >
        <template #tail>
          <v-icon v-if="item.value === filterItem.value">$FIconCheck</v-icon>
          <div v-else></div>
        </template>
      </f-list-item>
    </f-list>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from "vue-property-decorator";
import { VatAction } from "~/enums";
import type { TranslateResult } from "vue-i18n";

export type VaultFilterItem = {
  text: string | TranslateResult;
  value: VatAction | "all";
};

@Component({
  components: {},
})
export default class VaultHistoryFilter extends Vue {
  @PropSync("filter") bindFilter!: VatAction | "all";

  filterItem: VaultFilterItem = { text: this.$t("all"), value: "all" };

  show = false;

  get filters(): VaultFilterItem[] {
    return [
      {
        text: this.$t("all"),
        value: "all",
      },
      {
        text: this.$t("event.action.vatdeposit"),
        value: VatAction.VatDeposit,
      },
      {
        text: this.$t("event.action.vatwithdraw"),
        value: VatAction.VatWithdraw,
      },
      {
        text: this.$t("event.action.vatgenerate"),
        value: VatAction.VatGenerate,
      },
      {
        text: this.$t("event.action.vatpayback"),
        value: VatAction.VatPayback,
      },
      {
        text: this.$t("event.action.vatopen"),
        value: VatAction.VatOpen,
      },
      {
        text: this.$t("event.action.flipkick"),
        value: VatAction.FlipKick,
      },
      {
        text: this.$t("event.action.flipbid"),
        value: VatAction.FlipBid,
      },
    ];
  }

  handleClick(item: VaultFilterItem) {
    this.filterItem = item;
    this.bindFilter = item.value;
    this.show = false;
  }
}
</script>

<style lang="scss" scoped>
.history-activator {
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  padding: 8px 8px 8px 12px;
  background: var(--v-greyscale_6-base);
  border-radius: 8px;
}
</style>
