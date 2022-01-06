<template>
  <v-row>
    <v-col
      v-for="(field, index) in fields"
      :key="index"
      :class="[{ 'field--emphasize': field.emphasize }]"
      cols="6"
      md="4"
      class="field"
    >
      <div class="field__title">
        <span class="mr-1" :style="[{ opacity: field.opacity }]">
          {{ field.title }}
        </span>
      </div>

      <div class="field__value mt-1" :style="[{ color: field.color }]">
        {{ field.value }}
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getVaultFields } from "@/utils/vault";

import type { TranslateResult } from "vue-i18n";
import type { VuetifyThemeItem } from "vuetify/types/services/theme";
import { LINKS } from "~/constants";

interface VaultField {
  title: TranslateResult;
  value: string;
  hint?: TranslateResult;
  emphasize?: boolean;
  color?: VuetifyThemeItem;
  opacity?: number;
  learnMore?: string;
}

@Component
class VaultFields extends Vue {
  @Prop() id!: string;

  get fields() {
    const time = this.$utils.time;
    const format = this.$utils.number.format;
    const toPercent = this.$utils.number.toPercent;

    const {
      vault,
      collateralSymbol,
      collateralAmount,
      debtSymbol,
      debtAmount,
      ratio,
      riskLevelMeta,
      price,
      nextPrice,
      liquidationPrice,
    } = getVaultFields(this, this.id);

    const ratioText = debtAmount ? toPercent({ n: ratio }) : "-";
    const isValidPrice =
      price !== nextPrice?.price && this.$utils.oracle.isValidOracle(nextPrice);
    const nextPriceText = isValidPrice
      ? format({ n: nextPrice?.price ?? "" })
      : "-";
    const nextPriceTime = isValidPrice ? time.format(nextPrice?.time) : "-";
    let liquidationPriceText = "-";
    if (liquidationPrice !== 0) {
      liquidationPriceText = `${format({ n: liquidationPrice })} ${debtSymbol}`;
    }

    let items: VaultField[] = [];

    if (vault?.ink) {
      items.push(
        {
          title: this.$t("common.outstanding-symbol-debt", {
            symbol: debtSymbol,
          }),
          value: `${format({ n: debtAmount })} ${debtSymbol}`,
          emphasize: true,
        },
        {
          title: this.$t("me.symbol-locked", {
            symbol: collateralSymbol,
          }),
          value: `${format({ n: collateralAmount })} ${collateralSymbol}`,
          emphasize: true,
        }
      );

      //   if (debtAmount > 0) {
      items.push(
        {
          title: this.$t("common.collateral-ratio"),
          value: ratioText,
          color: this.$vuetify.theme.currentTheme[riskLevelMeta.color],
          opacity: 0.4,
          hint: this.$t("tooltip.collateralization-ratio"),
          learnMore: LINKS["vault.liquidation-ratio"],
        },
        {
          title: this.$t("common.current-symbol-price", {
            symbol: collateralSymbol,
          }),
          opacity: 0.4,
          value: `${format({ n: price })} ${debtSymbol}`,
        },
        {
          title: this.$t("common.liquidation-price"), // debt * ratio / collateral
          value: liquidationPriceText,
          opacity: 0.4,
          hint: this.$t("tooltip.liquidation-price"),
          learnMore: LINKS["vault.liquidation-price"],
        },
        {
          title: this.$t("common.next-price"),
          opacity: 0.4,
          value: `${nextPriceText} ${debtSymbol}`,
          hint: isValidPrice
            ? this.$t("tooltip.next-price", {
                time: nextPriceTime,
              })
            : undefined,
          learnMore: LINKS["vault.price-oracles"],
        }
      );
      //   }
    }

    return items;
  }
}
export default VaultFields;
</script>

<style lang="scss" scoped>
.field {
  font-weight: 500;

  &__title {
    font-size: 12px;
    line-height: 18px;
    display: flex;
    align-items: center;
    color: var(--v-greyscale_1-base);
  }

  &__value {
    font-size: 14px;
    line-height: 18px;
  }

  &--emphasize {
    .field__title,
    .field__value {
      font-weight: 600;
    }
  }
}
</style>
