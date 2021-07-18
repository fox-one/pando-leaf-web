<template>
  <div class="py-4 event">
    <v-layout>
      <span class="event-title">{{ meta.title }}</span>
      <v-spacer />
      <span class="caption greyscale_4--text">{{ meta.time }}</span>
    </v-layout>
    <div class="caption greyscale_3--text mt-2">
      {{ meta.text }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { VatAction } from "@/enums";

import type { TranslateResult } from "vue-i18n";

@Component
class VaultHistoryItem extends Vue {
  @Prop() event!: API.VaultEvent;

  get meta() {
    const toRelative = this.$utils.time.toRelative;
    const getVaultFields = this.$utils.vault.getVaultFields;
    const { event } = this;

    const dink = event.dink?.replace("-", "");
    const debt = event.debt?.replace("-", "");
    const fields = getVaultFields(this, event.vault_id);
    const { vault, collateralSymbol, debtSymbol } = fields;

    const title = this.$t(`vault.event.action.${event.action?.toLowerCase()}`);
    const time = toRelative(event.created_at);

    const collateralText = `${dink} ${collateralSymbol}`;
    const debtText = `${debt} ${debtSymbol}`;
    let text: TranslateResult = "";

    switch (event.action) {
      case VatAction.VatOpen:
        text = this.$t("vault.event.content.vatopen", {
          id: vault?.identity_id,
          deposit: collateralText,
          generate: debtText,
        });
        break;

      case VatAction.VatDeposit:
        text = this.$t("vault.event.content.vatdeposit", {
          amount: collateralText,
        });
        break;

      case VatAction.VatWithdraw:
        text = this.$t("vault.event.content.vatwithdraw", {
          amount: collateralText,
        });
        break;

      case VatAction.VatPayback:
        text = this.$t("vault.event.content.vatpayback", {
          amount: debtText,
        });
        break;
      case VatAction.VatGenerate:
        text = this.$t("vault.event.content.vatgenerate", {
          amount: debtText,
        });
        break;

      case VatAction.FlipKick:
        text = this.$t("vault.event.content.flipkick", {
          collateral: collateralText,
          debt: debtText,
        });
        break;

      case VatAction.FlipBid:
        text = this.$t("vault.event.content.flipbid", {
          amount: collateralText,
        });
        break;
    }

    return {
      text,
      title,
      time,
    };
  }
}
export default VaultHistoryItem;
</script>

<style lang="scss" scoped>
.event {
  border-bottom: 0.5px solid var(--v-greyscale_6-base);
}

.event-title {
  font-weight: bold;
  font-size: 14px;
}
</style>
