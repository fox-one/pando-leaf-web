<template>
  <v-layout column>
    <div class="py-2" v-if="loading">
      <f-loading :loading="loading"></f-loading>
    </div>

    <v-layout column v-if="!loading" class="f-bg-greyscale-7">
      <f-tip v-if="!meta.isDone" class="ma-4">{{ auctionStatus }}</f-tip>
      <div v-if="meta.isDone" class="text-center text-h4 my-4">
        {{ $t("auction.status.end") }}
      </div>
      <v-layout v-else column>
        <div class="f-body-2 ml-4">{{ $t("auction.status.timer-prev") }}</div>
        <div class="text-center text-h3 mb-4">
          {{ countDownText }}
        </div>
        <div class="f-body-2 text-right mr-4 mb-4">
          {{ $t("auction.status.timer-shuffix") }}
        </div>
      </v-layout>
      <v-divider />
    </v-layout>

    <div class="f-body-1 mx-6 my-2">
      {{ $t("auction.label.current-state") }}
    </div>
    <f-panel class="pa-0 mx-4">
      <v-layout>
        <v-layout column style="flex: 1" class="pl-4 pb-4">
          <div class="my-4 f-caption">{{ $t("auction.label.collateral") }}</div>
          <v-layout align-center>
            <f-mixin-asset-logo
              :size="32"
              :logo="meta.auctionLogo"
            ></f-mixin-asset-logo>
            <v-layout column class="ml-2 mt-1">
              <div class="f-caption">{{ auctionAsset.symbol }}</div>
            </v-layout>
          </v-layout>
          <div class="f-body-1 mt-1">{{ flip.lot }}</div>
        </v-layout>
        <v-layout column style="flex: 1" class="pl-4 pb-4">
          <div class="my-4 f-caption">{{ $t("auction.label.debt") }}</div>
          <v-layout align-center>
            <f-mixin-asset-logo
              :size="32"
              :logo="meta.debtLogo"
            ></f-mixin-asset-logo>
            <v-layout column class="ml-2">
              <div class="f-caption">{{ debtAsset.symbol }}</div>
            </v-layout>
          </v-layout>
          <div class="f-body-1 mt-1">{{ flip.bid }}</div>
        </v-layout>
      </v-layout>
    </f-panel>

    <f-panel v-if="!meta.isDone" class="mt-4 mx-4">
      <v-layout column>
        <v-layout v-if="meta.isStage1" column>
          <div class="f-caption">
            {{ $t("auction.label.stage-prev")
            }}<span class="f-body-1 font-weight-bold primary--text">{{
              $t("auction.label.stage-price")
            }}</span>
          </div>
          <div class="f-caption mt-2">
            {{
              $t("auction.rule.stage-price", {
                beg: begText,
                amount: flip.tab,
                symbol: debtAsset.symbol,
              })
            }}
          </div>
        </v-layout>
        <f-input
          v-if="meta.isStage1"
          v-model="inputDebtAmount"
          class="my-2"
          type="number"
          :label="hintLabel1"
        ></f-input>
        <v-layout v-if="meta.isStage2" column>
          <div class="f-caption">
            {{ $t("auction.label.stage-prev")
            }}<span class="f-body-1 font-weight-bold primary--text">{{
              $t("auction.label.stage-collateral")
            }}</span>
          </div>
          <div class="f-caption mt-2">
            {{
              $t("auction.rule.stage-collateral", {
                beg: begText,
              })
            }}
          </div>
        </v-layout>
        <f-input
          v-if="meta.isStage2"
          v-model="inputCollateralAmount"
          class="my-2"
          type="number"
          :label="hintLabel2"
        ></f-input>
        <base-connect-wallet-btn
          v-if="!isLogged"
          rounded
          large
          depressed
          color="primary"
          @click="handleLogin"
        >
          {{ $t("connect.wallet") }}
        </base-connect-wallet-btn>
        <v-btn
          v-else
          rounded
          depressed
          :disabled="confirmDisabled"
          color="primary"
          style="height: 48px"
          @click="bidding"
          class="mt-2 px-14 align-self-center"
        >
          {{ $t("auction.button.confirm") }}
        </v-btn>
      </v-layout>
    </f-panel>
    <div v-if="events && events.length !== 0" class="f-body-1 mx-6 my-2">
      {{ $t("auction.history") }}
    </div>
    <f-panel v-if="events && events.length !== 0" class="mx-4 py-0">
      <template v-for="(event, index) in events">
        <v-divider :key="`${index}_divider`" v-if="index !== 0" />
        <auction-history-item
          :key="`${event.lot}_${event.bid}_${event.created_at}`"
          :flipEvent="event"
          :flip="flip"
        ></auction-history-item>
      </template>
    </f-panel>
    <div style="height: 70px"></div>
  </v-layout>
</template>

<script lang="ts" scoped>
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import { IAsset, ICollateral, IFlip, IFlipEvent } from "~/services/types/vo";
import AuctionItem from "~/components/particles/AuctionItem.vue";
import AuctionHistoryItem from "~/components/particles/AuctionHistoryItem.vue";
import { Action, Getter, State } from "vuex-class";
import { FlipAction, FlipRequestAction, TransactionStatus } from "~/types";
import { IActionsParams } from "~/services/types/dto";
import { isDesktop } from "~/utils/helper";
import dayjs from "dayjs";

@Component({
  components: {
    AuctionItem,
    AuctionHistoryItem,
  },
})
export default class AuctionDetail extends Mixins(mixins.page) {
  @Getter("global/getCollateral") getCollateral!: (id) => ICollateral;
  @Getter("global/getAssetById") getAssetById!: (id) => IAsset;
  @Getter("auth/isLogged") isLogged;
  @Action("global/syncMarkets") syncMarkets;
  @State((state) => state.auth.id) user_id!: string;

  loading = false;
  flip = {} as IFlip;
  events = [] as IFlipEvent[];
  inputDebtAmount = "";
  inputCollateralAmount = "";
  follow_id = "";
  countDownTimer = 0;
  countDownText = "";

  get appbar() {
    return {
      align: "center",
      back: true,
    };
  }

  get auctionStatus() {
    if (this.meta.isDone) return this.$t("auction.status.end");
    if (this.meta.isStage1) return this.$t("auction.label.stage-price");
    if (this.meta.isStage2) return this.$t("auction.label.stage-collateral");
    return "";
  }

  get begText() {
    return this.$utils.number.toPercent(this.collateral?.beg);
  }

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

  get hintLabel1() {
    return this.$t("auction.hint.stage-price", {
      debtsymbol: this.debtAsset?.symbol,
      colsymbol: this.auctionAsset?.symbol,
    });
  }

  get hintLabel2() {
    return this.$t("auction.hint.stage-collateral", {
      debtsymbol: this.debtAsset?.symbol,
      colsymbol: this.auctionAsset?.symbol,
    });
  }

  get confirmDisabled() {
    if (this.meta.isStage1) {
      return !this.inputDebtAmount;
    }
    if (this.meta.isStage2) {
      return !this.inputCollateralAmount;
    }
    return true;
  }

  get meta() {
    const isDone =
      this.flip.action === FlipAction.FlipDeal || this.countDownTimer <= 0;
    const isStage1 = Number(this.flip.bid) < Number(this.flip.tab);
    const isStage2 = this.flip.bid === this.flip.tab;
    return {
      isDone,
      auctionLogo: this.auctionAsset?.logo,
      debtLogo: this.debtAsset?.logo,
      isStage1,
      isStage2,
    };
  }

  format(duration) {
    return dayjs.duration(duration, "seconds").format("HH:mm:ss");
  }
  intervalId = 0 as any;
  mounted() {
    this.syncMarkets();
    this.requestFlip(true);
    this.requestEvents();
    this.follow_id = this.$utils.helper.uuidV4();
    this.intervalId = setInterval(() => {
      if (this.flip?.action === FlipAction.FlipDeal) {
        clearInterval(this.intervalId);
        return;
      }
      this.requestFlip();
      this.requestEvents();
    }, 3000);
  }

  async requestEvents() {
    const res = await this.$http.getFlipEvents(this.flipId);
    this.events = res?.data?.events?.reverse();
  }

  beforeDestroy() {
    clearInterval(this.intervalId);
    clearInterval(this.countId);
  }

  countId = 0 as any;

  startCountDown() {
    if (this.countDownTimer <= 0) return;
    clearInterval(this.countId);
    this.countId = setInterval(() => {
      this.countDownTimer = dayjs(this.flip.tic).diff(dayjs(), "seconds");
      this.countDownText = this.format(this.countDownTimer);
      if (this.countDownTimer <= 0) {
        clearInterval(this.countId);
      }
    }, 1000);
  }

  async requestFlip(withLoading = false) {
    this.loading = withLoading;
    try {
      const res = await this.$http.getFlip(this.flipId);
      this.flip = res.data;
      this.countDownTimer = dayjs(this.flip.tic).diff(dayjs(), "seconds");
      this.countDownText = this.format(this.countDownTimer);
      this.startCountDown();
    } catch (error) {
      this.loading = false;
    } finally {
      this.loading = false;
    }
  }

  // 拍卖第一阶段 付款为输入金额，拍卖第二阶段，付款为总债务数额
  // 第二阶段才需要在parameter上附带 decimal 和 amount
  async stage1Confirm() {
    this.follow_id = this.$utils.helper.uuidV4();
    const request = {
      user_id: this.user_id,
      follow_id: this.follow_id,
      amount: this.inputDebtAmount,
      asset_id: this.debtAsset?.id,
      parameters: [
        "bit",
        FlipRequestAction.FlipBid,
        "uuid",
        this.flipId,
        "decimal",
        this.flip.lot,
      ],
    } as IActionsParams;
    const url = await this.$utils.helper.requestPayment(this, request);
    if (url && isDesktop() && !this.$fennec.connected) {
      this.$utils.helper.showPayDialog(this, {
        paymentUrl: url,
      });
    } else {
      this.$utils.helper.showPaying(this, {
        timer: this.$utils.helper.uuidV4(),
      });
    }
    this.checkTransaction(this.follow_id);
  }

  async stage2Confirm() {
    this.follow_id = this.$utils.helper.uuidV4();
    const request = {
      user_id: this.user_id,
      follow_id: this.follow_id,
      amount: this.flip.tab,
      asset_id: this.debtAsset?.id,
      parameters: [
        "bit",
        FlipRequestAction.FlipBid,
        "uuid",
        this.flipId,
        "decimal",
        this.inputCollateralAmount,
      ],
    } as IActionsParams;
    const url = await this.$utils.helper.requestPayment(this, request);
    if (url && isDesktop() && !this.$fennec.connected) {
      this.$utils.helper.showPayDialog(this, {
        paymentUrl: url,
      });
    } else {
      this.$utils.helper.showPaying(this, {
        timer: this.$utils.helper.uuidV4(),
      });
    }
    this.checkTransaction(this.follow_id);
  }

  checkTransaction(follow_id: string) {
    let intervalId = 0 as any;
    clearInterval(intervalId);
    intervalId = setInterval(async () => {
      const response = await this.$http.getTransaction(follow_id);
      if (
        response.data?.status === TransactionStatus.OK ||
        response.data?.status === TransactionStatus.Abort
      ) {
        clearInterval(intervalId);
        this.requestFlip();
        this.$utils.helper.hidePaying(this);
        this.$utils.helper.hidePaymentDialog(this);
        this.$utils.helper.toast(this, {
          message: "Try bidding finish.",
          color: "success",
        });
      }
    }, 3000);
  }

  bidding() {
    if (this.meta.isStage1) {
      this.stage1Confirm();
    }
    if (this.meta.isStage2) {
      this.stage2Confirm();
    }
  }

  get title() {
    return `${this.$t("auction.title.details")}`;
  }
}
</script>

<style></style>
