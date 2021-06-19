<template>
  <div @click="toDetail(flip)">
    <f-panel column class="pa-0 f-bg-greyscale-7">
      <v-layout align-center justify-space-between class="ma-2">
        <div class="f-body-2 font-weight-bold">
          {{ $t("auction.item.collateral-type") }} {{ meta.colType }}
        </div>
        <div class="f-caption">
          {{
            meta.isDone
              ? $t("auction.item.status.done")
              : $t("auction.item.status.in-auction")
          }}
        </div>
      </v-layout>
      <v-divider />
      <v-layout column class="ma-2">
        <v-layout align-center justify-space-between class="f-caption mb-2">
          <div>{{ $t("auction.item.info") }}</div>
          <div>{{ $t("form.info.liquidation-penalty") }} {{ meta.chop }}</div>
        </v-layout>
        <v-layout align-center class="mb-2" style="flex: 1">
          <f-mixin-asset-logo
            :size="32"
            :logo="meta.auctionLogo"
          ></f-mixin-asset-logo>
          <v-layout column class="ml-2">
            <div class="f-caption">
              {{
                $t("auction.item.collateral-symbol", {
                  symbol: meta.auctionSymbol,
                })
              }}
            </div>
            <div class="f-body-1">{{ flip.lot }}</div>
          </v-layout>
        </v-layout>
        <v-layout align-center style="flex: 1">
          <f-mixin-asset-logo
            :size="32"
            :logo="meta.debtLogo"
          ></f-mixin-asset-logo>
          <v-layout column class="ml-2">
            <div class="f-caption">
              {{ $t("auction.item.debt-symbol", { symbol: meta.debtSymbol }) }}
            </div>
            <div class="f-body-1">{{ flip.bid }}</div>
          </v-layout>
        </v-layout>
      </v-layout>
      <v-divider />
      <v-layout class="f-caption ma-2" justify-space-between>
        <div>{{ $t("auction.item.end-time") }}</div>
        <div>
          {{ meta.endTime }}
        </div>
      </v-layout>
    </f-panel>
  </div>
</template>

<script lang="ts" scoped>
import dayjs from "dayjs";
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
    let endTime;
    if (isDone) {
      endTime = this.$utils.time.format(this.flip?.tic);
    } else {
      if (dayjs(this.flip.tic).unix() === 0) {
        endTime = this.$utils.time.format(this.flip?.tic);
      } else {
        endTime = dayjs(this.flip.tic).isBefore(dayjs(this.flip.end))
          ? this.$utils.time.format(this.flip.tic)
          : this.$utils.time.format(this.flip.end);
      }
    }
    return {
      title: this.flip.vault_id,
      colType: this.collateral?.name,
      chop: this.$utils.number.toPercent(Number(this.collateral?.chop) - 1),
      auctionLogo: this.auctionAsset?.logo,
      debtLogo: this.debtAsset?.logo,
      auctionSymbol: this.auctionAsset?.symbol,
      debtSymbol: this.debtAsset?.symbol,
      isDone,
      endTime,
    };
  }

  doneTime(time) {
    return this.$utils.time.format(time);
  }

  inAuctionTime(time) {
    return this.$utils.time.format(time);
  }

  toDetail(flip: IFlip) {
    this.$router.push(`/auction?id=${flip.id}`);
  }
}
</script>

<style lang="scss" scoped></style>
