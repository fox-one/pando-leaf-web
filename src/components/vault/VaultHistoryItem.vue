<template>
  <div class="py-4 event">
    <v-layout>
      <span class="event-title">{{ meta.title }}</span>
      <v-spacer />
      <span class="caption greyscale_4--text">{{ meta.time }}</span>
    </v-layout>

    <div class="d-flex justify-space-between caption greyscale_3--text mt-2">
      <span class="d-flex align-center">
        <f-mixin-asset-logo
          v-if="meta.logo"
          class="mr-1"
          :size="16"
          :logo="meta.logo"
        />
        {{ meta.text }}
      </span>

      <span v-if="meta.fiat"> {{ meta.fiat }} </span>
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
    const getters = this.$store.getters as Getter.GettersTree;
    const { toFiat } = this.$utils.number;
    const { event } = this;

    const dink = event.dink?.replace("-", "");
    const debt = event.debt?.replace("-", "");
    const fields = getters.getVaultFields(event.vault_id);
    const { vault, collateralSymbol, debtSymbol, collateralAsset, debtAsset } =
      fields;

    const title = this.$t(`event.action.${event.action?.toLowerCase()}`);
    const time = toRelative(event.created_at);

    const collateralText = `${dink} ${collateralSymbol}`;
    const debtText = `${debt} ${debtSymbol}`;

    const collateralPrice = +(collateralAsset?.price ?? "0");
    const debtPrice = +(debtAsset?.price ?? "0");

    let text: TranslateResult = "";
    let logo: string | undefined = "";
    let fiat = "";

    switch (event.action) {
      case VatAction.VatOpen:
        text = this.$t("event.content.vatopen", {
          id: vault?.identity_id,
          deposit: collateralText,
          generate: debtText,
        });
        break;

      case VatAction.VatDeposit:
        text = collateralText;
        logo = fields.collateralAsset?.logo;
        fiat = toFiat(this, {
          n: +(dink ?? 0) * collateralPrice,
        });
        break;

      case VatAction.VatWithdraw:
        text = collateralText;
        logo = fields.collateralAsset?.logo;
        fiat = toFiat(this, {
          n: +(dink ?? 0) * collateralPrice,
        });
        break;

      case VatAction.VatPayback:
        text = debtText;
        logo = fields.debtAsset?.logo;
        fiat = toFiat(this, {
          n: +(debt ?? 0) * debtPrice,
        });
        break;

      case VatAction.VatGenerate:
        text = debtText;
        logo = fields.debtAsset?.logo;
        fiat = toFiat(this, {
          n: +(debt ?? 0) * debtPrice,
        });
        break;

      case VatAction.FlipKick:
        text = this.$t("event.content.flipkick", {
          collateral: collateralText,
          debt: debtText,
        });
        break;

      case VatAction.FlipBid:
        text = collateralText;
        logo = fields.collateralAsset?.logo;
        fiat = toFiat(this, {
          n: +(dink ?? 0) * collateralPrice,
        });
        break;
    }

    return {
      text,
      logo,
      title,
      time,
      fiat,
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
  font-weight: 500;
  font-size: 14px;
}
</style>
