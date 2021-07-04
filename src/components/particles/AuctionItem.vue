<template>
  <div @click="toDetail(flip)">
    <v-card elevation="0" class="rounded-lg pa-0 f-bg-greyscale-6">
      <v-layout align-center class="mx-6 pt-6">
        <f-mixin-asset-logo
          class="z2"
          :size="40"
          :logo="meta.auctionLogo"
        ></f-mixin-asset-logo>
        <f-mixin-asset-logo
          class="ml-n2"
          :size="40"
          :logo="meta.debtLogo"
        ></f-mixin-asset-logo>

        <div class="f-caption ml-2 f-greyscale-4">
          #{{ meta.id.slice(0, 5) }}
        </div>
        <v-spacer />
        <span class="f-caption f-greyscale-4" justify-end>
          {{ meta.endTime }}
        </span>
      </v-layout>
      <v-layout column class="mx-6 pt-3">
        <v-layout
          v-for="item in infos"
          :key="item.label"
          align-center
          class="my-2"
        >
          <div class="f-caption f-greyscale-3">{{ item.label }}</div>
          <v-spacer />
          <div class="f-caption font-weight-medium f-greyscale-1">
            {{ item.value }}
          </div>
        </v-layout>
      </v-layout>
      <v-divider class="mx-6 mt-2" />
      <v-layout align-center class="mx-6" style="height: 49.5px">
        <div :class="`f-caption ${meta.isDone ? 'text--disabled' : ''}`">
          {{
            meta.isDone
              ? $t("auction.item.status.done")
              : $t("auction.item.status.in-auction")
          }}
        </div>
        <v-spacer style="border-color: rgba(0, 0, 0, 0.1) !important" />
        <v-icon size="16" color="primary">{{ $icons.mdiChevronRight }}</v-icon>
      </v-layout>
    </v-card>
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
      id: this.flip.id,
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

  get infos() {
    return [
      {
        label: this.$t("auction.item.collateral-symbol"),
        value: `${this.flip.lot} ${this.meta.auctionSymbol}`,
      },
      {
        label: this.$t("auction.item.debt-symbol"),
        value: `${this.flip.bid} ${this.meta.debtSymbol}`,
      },
      {
        label: this.$t("form.info.liquidation-penalty"),
        value: this.meta.chop,
      },
    ];
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

<style lang="scss" scoped>
.z2 {
  z-index: 2;
}
</style>
