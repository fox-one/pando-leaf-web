<template>
  <v-layout column class="wrapper mx-0 pa-6">
    <v-layout justify-space-between>
      <v-layout align-center>
        <f-mixin-asset-logo
          class="flex-grow-0 z-index-2"
          :size="40"
          :logo="collateralLogo(item)"
        />
        <f-mixin-asset-logo
          class="flex-grow-0 ml-n2 mr-2"
          :size="40"
          :logo="debtLogo(item)"
        />
        <span class="f-title-1 f-greyscale-1">{{ item.name }}</span>
      </v-layout>
      <v-icon class="btn-add" @click="$emit('add')">
        {{ $icons.mdiPlus }}
      </v-icon>
    </v-layout>
    <v-layout justify-space-between class="mt-6 mb-4">
      <div class="f-caption f-greyscale-3">
        {{ $t("vault.selector.min-collateral-ratio") }}
      </div>
      <div class="f-caption f-greyscale-1">{{ normalize(item).mat }}</div>
    </v-layout>
    <v-layout justify-space-between>
      <div class="f-caption f-greyscale-3">
        {{ $t("vault.selector.stability-fee") }}
      </div>
      <div class="f-caption f-greyscale-1">{{ normalize(item).duty }}</div>
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

<style scoped lang="scss">
.theme--dark.v-application {
  .wrapper {
    background-color: #191919;
  }
  .btn {
    &-add {
      color: #000000;
      background-color: #ffffff;
    }
  }
}
.wrapper {
  background-color: #f5f5f5;
  border-radius: 8px;
}

.btn {
  &-add {
    width: 40px;
    height: 40px;
    line-height: 1.97em;
    border-radius: 50%;
    display: inline-block;
    color: #ffffff;
    text-align: center;
    background-color: #000000;
  }
}
</style>
