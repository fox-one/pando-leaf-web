<template>
  <v-row>
    <v-col
      v-for="(field, index) in fields"
      :key="index"
      :class="[{ 'field--emphasize': field.emphasize }]"
      cols="6"
      class="field"
    >
      <div class="field__title">
        <span class="mr-1" :style="[{ color: field.color }]">
          {{ field.title }}
        </span>
        <base-tooltip v-if="field.hint" :hint="field.hint" />
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

interface VaultField {
  title: TranslateResult;
  value: string;
  hint?: TranslateResult;
  emphasize?: boolean;
  color?: VuetifyThemeItem;
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

    const ratioText = debtAmount ? toPercent({ n: ratio }) : "N/A";
    const nextPriceText = nextPrice?.price
      ? format({ n: nextPrice?.price ?? "" })
      : "-";
    const nextPriceTime = nextPrice?.time ? time.format(nextPrice.time) : "-";

    let items: VaultField[] = [];

    if (vault?.ink) {
      items.push(
        {
          title: this.$t("me.vault-item.symbol-locked", {
            symbol: collateralSymbol,
          }),
          value: `${format({ n: collateralAmount })} ${collateralSymbol}`,
          emphasize: true,
        },
        {
          title: this.$t("me.vault-item.outstanding-symbol-debt", {
            symbol: debtSymbol,
          }),
          value: `${format({ n: debtAmount })} ${debtSymbol}`,
          emphasize: true,
        }
      );

      if (debtAmount > 0) {
        items.push(
          {
            title: this.$t("me.vault-item.collateral-ratio"),
            value: ratioText,
            emphasize: true,
            color: this.$vuetify.theme.currentTheme[riskLevelMeta.color],
          },
          {
            title: this.$t("form.info.current-symbol-price", {
              symbol: collateralSymbol,
            }),
            value: `${format({ n: price })} ${debtSymbol}`,
          },
          {
            title: this.$t("form.info.liquidation-price"), // debt * ratio / collateral
            value: `${format({ n: liquidationPrice })} ${debtSymbol}`,
          },
          {
            title: this.$t("me.vault-item.next-price"),
            value: `${nextPriceText} ${debtSymbol}`,
            hint: this.$t("form.info.oracle-price", {
              time: nextPriceTime,
            }),
          }
        );
      }
    }

    return items;
  }
}
export default VaultFields;
</script>

<style lang="scss" scoped>
.field {
  &__title {
    font-size: 12px;
    line-height: 18px;
    display: flex;
    align-items: center;
  }

  &__value {
    font-size: 14px;
    line-height: 18px;
  }

  &--emphasize {
    .field__title,
    .field__value {
      font-weight: bold;
    }
  }
}
</style>
