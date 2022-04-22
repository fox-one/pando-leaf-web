<template>
  <div class="vault-infos">
    <infomation-item
      v-for="item in infos.slice(0, 2)"
      :key="item.title"
      :label="item.title"
      :hint="item.hint"
      :learn-more="item.learnMore"
      :value="item.value"
    ></infomation-item>

    <f-divider class="my-3" />

    <infomation-item
      v-for="item in infos.slice(2, 3)"
      :key="item.title"
      :label="item.title"
      :hint="item.hint"
      :learn-more="item.learnMore"
      :value="item.value"
    ></infomation-item>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import InfomationItem from "@/components/base/InformationItem.vue";

@Component({
  components: {
    InfomationItem,
  },
})
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
