<template>
  <v-layout column>
    <div class="py-2" v-if="loading">
      <f-loading :loading="loading"></f-loading>
    </div>

    <v-layout column v-if="!loading" class="f-bg-greyscale-7">
      <f-tip v-if="!meta.isDone" class="ma-4">竞拍已结束</f-tip>
      <div v-if="meta.isDone" class="text-center text-h4 my-4">竞拍已结束</div>
      <v-layout column>
        <div class="f-body-2 ml-4">拍卖将于</div>
        <div class="text-center text-h3 mb-4">00:00:00</div>
        <div class="f-body-2 text-right mr-4 mb-4">后结束</div>
      </v-layout>
      <v-divider />
    </v-layout>

    <div class="f-body-1 mx-6 my-2">{{ "当前状态" }}</div>
    <f-panel class="pa-0 mx-4">
      <v-layout>
        <v-layout column style="flex: 1" class="pl-2 pb-2">
          <div class="my-2 f-caption">{{ "竞标抵押物" }}</div>
          <v-layout align-center>
            <f-mixin-asset-logo
              :size="32"
              :logo="meta.auctionLogo"
            ></f-mixin-asset-logo>
            <v-layout column class="ml-2">
              <div class="f-caption">{{ auctionAsset.symbol }}</div>
            </v-layout>
          </v-layout>
          <div class="f-body-1">{{ flip.lot }}</div>
        </v-layout>
        <v-layout column style="flex: 1" class="pl-2 pb-2">
          <div class="my-2 f-caption">{{ "竞标出价" }}</div>
          <v-layout align-center>
            <f-mixin-asset-logo
              :size="32"
              :logo="meta.debtLogo"
            ></f-mixin-asset-logo>
            <v-layout column class="ml-2">
              <div class="f-caption">{{ debtAsset.symbol }}</div>
            </v-layout>
          </v-layout>
          <div class="f-body-1">{{ flip.bid }}</div>
        </v-layout>
      </v-layout>
    </f-panel>

    <f-panel class="ma-4">
      <v-layout column>
        <div class="f-caption">
          当前为<span class="f-body-1 font-weight-bold primary--text"
            >竞标出价阶段</span
          >
        </div>
        <div class="f-caption mt-2">
          {{
            `每次加价不得少于总出价的3%，最高出价为${flip.tab} ${debtAsset.symbol}`
          }}
        </div>
        <f-input
          v-model="amount"
          class="my-2"
          type="number"
          :label="`出价多少 ${debtAsset.symbol} 以竞标抵押物 ${auctionAsset.symbol}`"
        ></f-input>
        <v-btn
          rounded
          depressed
          :disabled="!amount"
          color="primary"
          style="height: 48px"
          @click="bidding"
          class="mt-2 px-14 align-self-center"
        >
          {{ $t("auction.button.confirm") }}
        </v-btn></v-layout
      >
    </f-panel>
  </v-layout>
</template>

<script lang="ts" scoped>
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import { IAsset, ICollateral, IFlip } from "~/services/types/vo";
import AuctionItem from "~/components/particles/AuctionItem.vue";
import { Getter } from "vuex-class";
import { FlipAction } from "~/types";

@Component({
  components: {
    AuctionItem,
  },
})
export default class AuctionDetail extends Mixins(mixins.page) {
  @Getter("global/getCollateral") getCollateral!: (id) => ICollateral;
  @Getter("global/getAssetById") getAssetById!: (id) => IAsset;

  loading = false;
  flip = {} as IFlip;
  amount = "";

  get collateral() {
    return this.getCollateral(this.flip?.collateral_id);
  }

  get auctionAsset() {
    return this.getAssetById(this.collateral?.gem) || {};
  }

  get debtAsset() {
    return this.getAssetById(this.collateral?.dai) || {};
  }

  get flipId() {
    return this.$route.query["id"] as string;
  }

  get meta() {
    const isDone = this.flip.action === FlipAction.FlipDeal;
    return {
      isDone,
      auctionLogo: this.auctionAsset?.logo,
      debtLogo: this.debtAsset?.logo,
    };
  }

  mounted() {
    this.requestFlip(true);
  }

  async requestFlip(withLoading = false) {
    this.loading = withLoading;
    try {
      const res = await this.$http.getFlip(this.flipId);
      this.flip = res.data;
    } catch (error) {
      this.loading = false;
    } finally {
      this.loading = false;
    }
  }

  bidding() {
    console.log("onBidding");
  }

  get title() {
    return `拍卖详情`;
  }
}
</script>

<style></style>
