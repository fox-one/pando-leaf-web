<template>
  <div>
    <v-row
      no-gutters
      v-for="(field, index) in fields"
      :key="index"
      class="field py-3"
    >
      <div class="field__title greyscale_3--text d-flex align-center">
        <span class="mr-1">
          {{ field.title }}
        </span>

        <base-tooltip
          v-if="field.hint"
          :hint="field.hint"
          :learn-more="field.learnMore"
        />
      </div>

      <v-spacer />

      <div class="field__value" :style="[{ color: field.color }]">
        {{ field.value }}
      </div>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import type { TranslateResult } from "vue-i18n";
import type { VuetifyThemeItem } from "vuetify/types/services/theme";
import { LINKS } from "~/constants";

interface VaultField {
  title: TranslateResult;
  value: string;
  hint?: TranslateResult;
  emphasize?: boolean;
  color?: VuetifyThemeItem;
  learnMore?: string;
}

@Component
class VaultFields extends Vue {
  @Prop() id!: string;

  get fields() {
    const time = this.$utils.time;
    const { format, toPercent } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;
    const {
      vault,
      collateral,
      collateralSymbol,
      collateralAmount,
      debtSymbol,
      debtAmount,
      ratio,
      riskLevelMeta,
      price,
      nextPrice,
      liquidationPrice,
    } = getters.getVaultFields(this.id);

    const { liquidationPenalty, minimumRatio } = getters.getMarketFields(
      collateral?.id ?? ""
    );

    const ratioText = debtAmount ? toPercent({ n: ratio }) : "N/A";
    const isValidPrice =
      price !== nextPrice?.price && this.$utils.oracle.isValidOracle(nextPrice);
    const nextPriceText = isValidPrice
      ? format({ n: nextPrice?.price ?? "" })
      : "-";
    const nextPriceTime = isValidPrice ? time.format(nextPrice?.time) : "-";

    let items: VaultField[] = [];

    if (vault?.ink) {
      items.push(
        {
          title: this.$t("common.collateral-ratio"),
          value: ratioText,
          color: this.$vuetify.theme.currentTheme[riskLevelMeta.color],
          hint: this.$t("tooltip.collateralization-ratio"),
          learnMore: LINKS["vault.liquidation-ratio"],
        },
        {
          title: this.$t("common.current-symbol-price", {
            symbol: collateralSymbol,
          }),
          value: `${format({ n: price })} ${debtSymbol}`,
        },
        {
          title: this.$t("common.next-price"),
          value: `${nextPriceText} ${debtSymbol}`,
          hint: isValidPrice
            ? this.$t("tooltip.next-price", {
                time: nextPriceTime,
              })
            : undefined,
          learnMore: LINKS["vault.price-oracles"],
        }
      );

      if (debtAmount > 0) {
        items.push(
          {
            title: this.$t("common.liquidation-price"), // debt * ratio / collateral
            value: `${format({ n: liquidationPrice })} ${debtSymbol}`,
            hint: this.$t("tooltip.liquidation-price"),
            learnMore: LINKS["vault.liquidation-price"],
          },
          {
            title: this.$t("common.liquidation-penalty"),
            value: toPercent({
              n: liquidationPenalty - 1,
              dp: 0,
            }),
          },
          {
            title: this.$t("common.minimum-ratio"),
            value: toPercent({ n: minimumRatio, dp: 0 }),
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
  align-items: center;

  &__title {
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
  }

  &__value {
    align-items: center;
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
    color: var(--v-greyscale_1-base);
  }
}
</style>
