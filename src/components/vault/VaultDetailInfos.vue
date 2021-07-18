<template>
  <div class="vault-infos">
    <v-layout
      v-for="(item, index) in infos"
      :key="index"
      class="info-item py-4"
    >
      <div class="greyscale_3--text">
        <span class="mr-1">{{ item.title }}</span>
        <base-tooltip v-if="item.hint" :hint="item.hint"></base-tooltip>
      </div>
      <v-spacer />
      <div>{{ item.value }}</div>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getVaultFields } from "@/utils/vault";

@Component
class VaultDetailInfos extends Vue {
  @Prop() id!: string;

  get infos() {
    const format = this.$utils.number.format;
    const toPercent = this.$utils.number.toPercent;

    const {
      avaliableWithdraw,
      avaliableDebt,
      collateralSymbol,
      debtSymbol,
      stabilityFee,
      liquidationPenalty,
    } = getVaultFields(this, this.id);

    return [
      {
        title: this.$t("form.info.available-to-withdraw"),
        value: `${format({ n: avaliableWithdraw })} ${collateralSymbol}`,
      },
      {
        title: this.$t("form.info.available-to-generate"),
        value: `${format({ n: avaliableDebt })} ${debtSymbol}`,
      },
      {
        title: this.$t("form.info.stability-fee"),
        value: `${toPercent({ n: stabilityFee })}`,
        hint: this.$t("form.tooltip.stability-fee"),
      },
      {
        title: this.$t("form.info.liquidation-penalty"),
        value: `${toPercent({ n: liquidationPenalty })}`,
      },
    ];
  }
}
export default VaultDetailInfos;
</script>

<style lang="scss" scoped>
.vault-infos {
  .info-item {
    font-size: 14px;
    border-bottom: 0.5px solid var(--v-greyscale_6-base);
  }
}
</style>
