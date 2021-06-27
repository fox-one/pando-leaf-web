<template>
  <f-bottom-sheet v-model="visible">
    <template #title>
      <div class="title f-title-1 text-center">
        {{ $t("vault.selector.title") }}
      </div>
    </template>
    <template #subheader>
      <div class="px-1 text-center">
        <div class="f-caption f-greyscale-3 px-2 mb-6">
          {{ $t("vault.selector.tips") }}
        </div>
        <f-input
          v-model="filter"
          :clearable="true"
          :label="$t('vault.selector.search')"
        >
          <template #prependInner>
            <icon-search class="mt-1 mr-2" />
          </template>
        </f-input>
      </div>
    </template>
    <v-layout class="px-4" justify-space-between>
      <div class="ml-11">{{ $t("vault.selector.min-collateral-ratio") }}</div>
      <div>
        {{ $t("vault.selector.stability-fee") }}
      </div>
    </v-layout>
    <v-divider class="px-4" />
    <v-list height="500">
      <v-list-item
        v-for="(item, index) in filtedItems"
        :key="index"
        @click="bindItem(item)"
      >
        <v-layout column>
          <v-divider v-if="index !== 0" />
          <add-vault-card-item :item="item" />
        </v-layout>
      </v-list-item>
    </v-list>
  </f-bottom-sheet>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop, PropSync } from "vue-property-decorator";
import { Getter, State } from "vuex-class";
import AddVaultCardItem from "./AddVaultCardItem.vue";
import { ICollateral } from "~/services/types/vo";

@Component({
  components: {
    AddVaultCardItem,
  },
})
export default class MarketSelectModal extends Vue {
  @PropSync("show") visible!: boolean;
  @PropSync("current") collateral!: ICollateral;
  @State((state) => state.global.collaterals) collaterals!: ICollateral[];
  @Getter("global/getAssetById") getAssetById;

  filter = "";

  get filtedItems() {
    return this.collaterals?.filter((item) => item.name.includes(this.filter));
  }

  collateralSymbol(col) {
    return this.getAssetById(col?.gem)?.symbol;
  }

  debtSymbol(col) {
    return this.getAssetById(col?.dai)?.symbol;
  }

  collateralLogo(col) {
    return this.getAssetById(col?.gem)?.logo;
  }

  debtLogo(col) {
    return this.getAssetById(col?.dai)?.logo;
  }

  normalize(col: ICollateral) {
    return {
      duty: this.$utils.number.toPercent(Number(col.duty) - 1),
      mat: this.$utils.number.toPercent(Number(col.mat)),
      chop: this.$utils.number.toPercent(Number(col.chop) - 1),
    };
  }

  bindItem(item) {
    this.visible = false;
    this.$emit("change", false);
    this.collateral = item;
  }
}
</script>

<style lang="scss" scoped>
.title {
  position: relative;
  width: 100%;
}
</style>
