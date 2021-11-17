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

@Component
class VaultDetailInfos extends Vue {
  @Prop() id!: string;

  get infos() {
    const format = this.$utils.number.format;
    const toPercent = this.$utils.number.toPercent;

    const getters = this.$store.getters as Getter.GettersTree;
    const {
      avaliableWithdraw,
      avaliableDebt,
      collateralSymbol,
      debtSymbol,
      stabilityFee,
      liquidationPenalty,
    } = getters.getVaultFields(this.id);

    return [
      {
        title: this.$t("common.available-to-withdraw"),
        value: `${format({ n: avaliableWithdraw })} ${collateralSymbol}`,
      },
      {
        title: this.$t("common.available-to-generate"),
        value: `${format({ n: avaliableDebt })} ${debtSymbol}`,
      },
      {
        title: this.$t("common.stability-fee"),
        value: `${toPercent({ n: stabilityFee })}`,
        hint: this.$t("tooltip.stability-fee"),
      },
      {
        title: this.$t("common.liquidation-penalty"),
        value: `${toPercent({ n: liquidationPenalty - 1 })}`,
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
