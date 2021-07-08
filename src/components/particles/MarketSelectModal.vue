<template>
  <f-bottom-sheet overlay-opacity="0.9" v-model="visible">
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
          @focus="handleFocus(true)"
          @blur="handleFocus(false)"
          class="search"
          :label="$t('common.search')"
        >
          <template #prependInner>
            <icon-search v-show="prependInner" class="mt-1 mr-2" />
          </template>
        </f-input>
      </div>
    </template>
    <v-list height="500">
      <v-list-item
        v-for="(item, index) in filtedItems"
        class="card-item"
        :key="index"
      >
        <add-vault-card-item :item="item" @add="bindItem(item)" />
      </v-list-item>
    </v-list>
  </f-bottom-sheet>
</template>

<script lang="ts" scoped>
import { Vue, Component, PropSync } from "vue-property-decorator";
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

  isFocus = false;

  get filtedItems() {
    return this.collaterals?.filter((item) =>
      item.name?.toLowerCase().includes(this.filter?.toLowerCase())
    );
  }

  get prependInner() {
    return !this.filter && !this.isFocus;
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

  handleFocus(bool: boolean) {
    this.isFocus = bool;
  }
}
</script>

<style lang="scss" scoped>
.theme--dark.v-application {
  .search {
    &:focus,
    &:hover {
      background-color: #36383b;
    }
  }
}

.title {
  position: relative;
  width: 100%;
}

.search {
  overflow: hidden;
  border-radius: 8px;
  &:focus,
  &:hover {
    background-color: #ebebeb;
  }
}

.card-item {
  &:nth-of-type(1) {
    margin-top: 0;
  }
  margin-top: 16px;
}
</style>
