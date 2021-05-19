<template>
  <div @click="toDetail(flip)">
    <f-panel column class="pa-0 f-bg-greyscale-7">
      <v-layout align-center justify-space-between class="ma-2">
        <div class="f-body-2 font-weight-bold">
          {{ "拍卖类型 " }} {{ meta.colType }}
        </div>
        <div class="f-caption">{{ meta.isDone ? "已结束" : "拍卖中" }}</div>
      </v-layout>
      <v-divider />
      <v-layout column class="ma-2">
        <v-layout align-center justify-space-between class="f-caption mb-2">
          <div>{{ "拍卖详情" }}</div>
          <div>{{ $t("form.info.liquidation-penalty") }} {{ meta.chop }}</div>
        </v-layout>
        <v-layout align-center class="mb-2" style="flex: 1">
          <f-mixin-asset-logo
            :size="32"
            :logo="meta.auctionLogo"
          ></f-mixin-asset-logo>
          <v-layout column class="ml-2">
            <div class="f-caption">{{ `抵押物 ${auctionAsset.symbol}` }}</div>
            <div class="f-body-1">{{ flip.lot }}</div>
          </v-layout>
        </v-layout>
        <v-layout align-center style="flex: 1">
          <f-mixin-asset-logo
            :size="32"
            :logo="meta.debtLogo"
          ></f-mixin-asset-logo>
          <v-layout column class="ml-2">
            <div class="f-caption">{{ `债务 ${debtAsset.symbol}` }}</div>
            <div class="f-body-1">{{ flip.bid }}</div>
          </v-layout>
        </v-layout>
      </v-layout>
      <v-divider />
      <v-layout class="f-caption ma-2" justify-space-between>
        <div>{{ "结束时间" }}</div>
        <div>{{ meta.isDone ? dayjs(flip.tic) : dayjs(flip.tic) }}</div>
      </v-layout>
    </f-panel>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { IAsset, ICollateral, IFlip } from "~/services/types/vo";
import { FlipAction } from "~/types";

@Component
export default class AuctionItem extends Vue {
  @Prop() flip!: IFlip;
  @Getter("global/getCollateral") getCollateral!: (id) => ICollateral;
  @Getter("global/getAssetById") getAssetById!: (id) => IAsset;

  get collateral() {
    return this.getCollateral(this.flip?.collateral_id);
  }

  get auctionAsset() {
    return this.getAssetById(this.collateral?.gem);
  }

  get debtAsset() {
    return this.getAssetById(this.collateral?.dai);
  }

  get meta() {
    const isDone = this.flip.action === FlipAction.FlipDeal;
    return {
      title: this.flip.vault_id,
      colType: this.collateral?.name,
      chop: this.$utils.number.toPercent(Number(this.collateral?.chop) - 1),
      auctionLogo: this.auctionAsset?.logo,
      debtLogo: this.debtAsset?.logo,
      isDone,
    };
  }

  dayjs(time) {
    return this.$utils.time.toRelative(time);
  }

  toDetail(flip: IFlip) {
    this.$router.push(`/auction?id=${flip.id}`);
  }
}
</script>

<style lang="scss" scoped></style>
