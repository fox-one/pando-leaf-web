<template>
  <v-layout row align-center class="mx-0 my-2 pa-0">
    <f-mixin-asset-logo
      class="flex-grow-0 mr-1 z-index-2"
      :size="24"
      :logo="collateralLogo(item)"
    />
    <f-mixin-asset-logo
      class="flex-grow-0 ml-n3 mr-1"
      :size="24"
      :logo="debtLogo(item)"
    />
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
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";
import type { ICollateral } from "~/services/types/vo";

@Component
export default class extends Vue {
  @Getter("global/getAssetById") getAssetById;
  @Prop() item!: ICollateral;

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
}
</script>

<style scoped></style>
