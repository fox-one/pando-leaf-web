<template>
  <f-bottom-sheet v-model="visible" class="sheet">
    <template #title>
      <div class="title text-center">
        <icon-search class="title-search" />
        <span>
          {{ $t("vault.selector.title") }}
        </span>
      </div>
    </template>
    <template #subheader>
      <div class="f-caption text-center">
        {{ $t("vault.selector.tips") }}
      </div>
      <f-input v-model="filter" :label="$t('vault.selector.search')"></f-input>
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
          <v-layout row align-center class="mx-0 my-2 pa-0">
            <f-mixin-asset-logo
              class="flex-grow-0 mr-1 z-index-2"
              :size="24"
              :logo="collateralLogo(item)"
            ></f-mixin-asset-logo>
            <f-mixin-asset-logo
              class="flex-grow-0 ml-n3 mr-1"
              :size="24"
              :logo="debtLogo(item)"
            ></f-mixin-asset-logo>
            <v-layout justify-space-between>
              <v-layout column>
                <div class="f-title-2">{{ item.name }}</div>
                <div>{{ normalize(item).mat }}</div>
              </v-layout>
              <v-layout column align-end justify-center>
                <div>{{ normalize(item).duty }}</div>
                <!-- <div>{{ normalize(item).chop }}</div> -->
              </v-layout>
            </v-layout>
          </v-layout>
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
  &-search {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(0, -50%);
  }
}
</style>
