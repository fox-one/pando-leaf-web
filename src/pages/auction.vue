<template>
  <v-container class="pa-0">
    <v-layout column>
      <div class="py-2" v-if="loading">
        <f-loading :loading="loading"></f-loading>
      </div>

      <v-layout
        v-else
        align-center
        justify-space-between
        class="pa-4 f-body-2 statusbar white--text"
        :class="auctionStatus.bgcls"
      >
        <div class="text-center statusbar-left">
          {{ auctionStatus.title }}
        </div>
        <div v-if="!meta.isDone" class="text-center statusbar-right">
          <span class="ml-2 statusbar-right-ends">
            {{ $t("auction.statusbar.ends") }}
          </span>
          {{ countDownText }}
        </div>
      </v-layout>

      <f-panel
        elevation="none"
        class="collateral pa-4 no-border-radius f-greyscale-1"
      >
        <v-layout column>
          <v-layout column>
            <div class="f-body-2 f-greyscale-3 mb-4">
              {{
                meta.isStage2
                  ? $t("auction.label.debt")
                  : $t("auction.label.collateral")
              }}
            </div>
            <v-layout align-center>
              <f-mixin-asset-logo
                :size="24"
                :logo="meta.isStage2 ? meta.debtLogo : meta.auctionLogo"
              />
              <div class="f-title-3 ml-2">
                {{
                  meta.isStage2
                    ? `= ${flip.tab} ${meta.debtSymbol}`
                    : `= ${flip.lot} ${meta.auctionSymbol}`
                }}
              </div>
            </v-layout>
            <div class="f-title-3 mt-3 ml-8">
              {{
                meta.isStage2
                  ? `≈ $${meta.debtFiatValue}`
                  : `≈ ${meta.colValue} ${meta.debtSymbol}`
              }}
            </div>
            <div v-if="meta.isStage1" class="f-caption mt-3 ml-8 f-greyscale-3">
              <div>{{ `≈ $${meta.collateralFiatValue}` }}</div>
              <div class="mt-2">
                {{ `${$t("form.info.current-price")}: ${meta.curPrice}` }}
              </div>
            </div>
          </v-layout>
          <v-divider class="my-4" />
          <v-layout v-if="meta.isDone" column>
            <div class="f-body-2 f-greyscale-3 mb-4">
              {{ $t("auction.label.debt.highest") }}
            </div>
            <v-layout align-center>
              <f-mixin-asset-logo :size="24" :logo="meta.debtLogo" />
              <div class="f-title-3 ml-2">
                {{ `= ${flip.bid} ${meta.debtSymbol}` }}
              </div>
            </v-layout>
          </v-layout>
          <v-layout v-else column>
            <div class="f-body-2 mb-4">
              {{
                $t(
                  meta.isStage1
                    ? "auction.label.stage.title.debt"
                    : "auction.label.stage.title.collateral"
                )
              }}
              <base-tooltip class="tooltip ml-1" :hint="true">
                <template v-slot:tip>
                  <div class="pa-4">
                    <p>
                      {{
                        meta.isStage1
                          ? $t("auction.rule.stage-price-1")
                          : $t("auction.rule.stage-collateral-1")
                      }}
                    </p>
                    <p>
                      {{
                        meta.isStage1
                          ? $t("auction.rule.stage-price-2", {
                              beg: begText,
                              amount: flip.tab,
                              symbol: meta.debtSymbol,
                            })
                          : $t("auction.rule.stage-collateral-2", {
                              beg: begText,
                            })
                      }}
                    </p>
                    <p>
                      {{
                        meta.isStage1
                          ? $t("auction.rule.stage-price-3")
                          : $t("auction.rule.stage-collateral-3")
                      }}
                    </p>
                  </div>
                </template>
              </base-tooltip>
            </div>
            <v-layout v-if="meta.isStage1" justify-start align-center>
              <f-mixin-asset-logo :size="24" :logo="meta.debtLogo" />
              <f-input
                v-model="inputDebtAmount"
                class="input-debt ml-2"
                type="number"
                :label="meta.debtSymbol"
                :rules="[meetDebt]"
              />
            </v-layout>
            <v-layout v-if="meta.isStage2" justify-start align-center>
              <f-mixin-asset-logo :size="24" :logo="meta.auctionLogo" />
              <f-input
                v-model="inputCollateralAmount"
                class="input-collateral ml-2"
                type="number"
                :label="meta.auctionSymbol"
                :rules="[meetCollateral]"
              />
            </v-layout>
            <v-layout v-if="!meta.isDone" column>
              <div class="mt-3 ml-8 f-greyscale-3 f-caption">
                {{
                  meta.isStage1
                    ? `≈ $${$utils.number.toPrecision(
                        meta.debtPrice * inputDebtAmount
                      )}`
                    : `≈ $${$utils.number.toPrecision(
                        meta.collateralPrice * inputCollateralAmount
                      )}`
                }}
              </div>
              <div
                v-if="meta.isStage1"
                class="mt-3 ml-8 f-greyscale-3 f-caption"
              >
                {{ $t("auction.label.stage.min.bid") }}
                <span
                  class="ml-1 f-greyscale-1 font-weight-bold"
                  @click="autoBid('min')"
                >
                  {{
                    `${meta.minBid} ${
                      meta.isStage1 ? meta.debtSymbol : meta.auctionSymbol
                    }`
                  }}
                  <v-icon class="ml-1 mt-n1" size="12">
                    $iconAuctionDetail
                  </v-icon>
                </span>
              </div>
              <div class="mt-3 ml-8 f-greyscale-3 f-caption">
                {{
                  $t(
                    meta.isStage1
                      ? "auction.label.stage.max.bid"
                      : "auction.label.stage.max.reduction"
                  )
                }}
                <span
                  class="ml-1 f-greyscale-1 font-weight-bold"
                  @click="autoBid('max')"
                >
                  {{
                    `${meta.maxBid} ${
                      meta.isStage1 ? meta.debtSymbol : meta.auctionSymbol
                    }`
                  }}
                  <v-icon class="ml-1 mt-n1" size="12">
                    $iconAuctionDetail
                  </v-icon>
                </span>
              </div>
              <div class="mt-3 ml-8 f-greyscale-3 f-caption">
                {{ $t("auction.label.stage.your.bid.price") }}
                <span class="ml-1 f-greyscale-1 font-weight-bold">
                  {{ meta.bidPrice }}
                </span>
              </div>
              <div
                v-if="meta.isStage2"
                class="mt-3 ml-8 f-caption waining--text"
              >
                {{
                  $t("auction.label.stage.reduction.agree", {
                    price: `${flip.tab} ${meta.debtSymbol}`,
                  })
                }}
              </div>
            </v-layout>

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
            <f-button
              v-else
              :disabled="confirmDisabled"
              color="primary"
              style="height: 48px"
              @click="bidding"
              class="mt-8 mb-4 px-8 align-self-center"
            >
              {{ $t("auction.button.confirm") }}
            </f-button>
          </v-layout>
        </v-layout>
      </f-panel>

      <f-panel
        elevation="none"
        v-if="events && events.length !== 0"
        class="mt-2 px-4 pt-6 pb-0 no-border-radius"
      >
        <div v-if="events && events.length !== 0" class="f-title-1 mb-2">
          {{ $t("auction.history") }}
        </div>
        <template v-for="(event, index) in events">
          <v-divider :key="`${index}_divider`" v-if="index !== 0" />
          <auction-history-item
            :key="`${event.lot}_${event.bid}_${event.created_at}`"
            :flipEvent="event"
            :flip="flip"
          />
        </template>
      </f-panel>
      <div style="height: 70px"></div>
    </v-layout>
  </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import { IAsset, ICollateral, IFlip, IFlipEvent } from "~/services/types/vo";
import AuctionItem from "~/components/particles/AuctionItem.vue";
import AuctionHistoryItem from "~/components/particles/AuctionHistoryItem.vue";
import { Action, Getter } from "vuex-class";
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
  @Action("global/syncMarkets") syncMarkets;
  @Action("global/syncAssets") syncAssets;

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
    const status = {
      title: "",
      bgcls: "",
    };
    if (this.meta.isDone) {
      status.title = this.$t("auction.statusbar.done") as string;
      status.bgcls = "f-bg-greyscale-3";
    } else if (this.meta.isStage1) {
      status.title = this.$t("auction.statusbar.debt") as string;
      status.bgcls = "statusbar-debt";
    } else if (this.meta.isStage2) {
      status.title = this.$t("auction.statusbar.collateral", {
        symbol: this.meta.auctionSymbol,
      }) as string;
      status.bgcls = "statusbar-collateral";
    }
    return status;
  }

  get begText() {
    return this.$utils.number.toPercent(this.collateral?.beg);
  }

  get collateral() {
    return this.getCollateral?.(this.flip?.collateral_id) ?? {};
  }

  get auctionAsset() {
    return this.getAssetById?.(this.collateral?.gem) || {};
  }

  get debtAsset() {
    return this.getAssetById?.(this.collateral?.dai) || {};
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
      return !this.inputDebtAmount || !this.meetDebt(this.inputDebtAmount);
    }
    if (this.meta.isStage2) {
      return (
        !this.inputCollateralAmount ||
        !this.meetCollateral(this.inputCollateralAmount)
      );
    }
    return true;
  }

  get meta() {
    const isDone =
      this.flip.action === FlipAction.FlipDeal || this.countDownTimer <= 0;
    const isStage1 = Number(this.flip.bid) < Number(this.flip.tab);
    const isStage2 = this.flip.bid >= this.flip.tab;
    const collateralPrice = this.getAssetById?.(this.collateral?.gem)?.price;
    const debtPrice = this.getAssetById?.(this.collateral?.dai)?.price;
    const colValue = this.$utils.number.toPrecision(
      (Number(collateralPrice) * Number(this.flip?.lot)) / Number(debtPrice)
    );
    const auctionSymbol = this.auctionAsset?.symbol;
    const debtSymbol = this.debtAsset?.symbol;
    let minBid = 0,
      maxBid = 0,
      curPrice = "",
      bidPrice = "",
      debtFiatValue = 0,
      collateralFiatValue = 0;
    if (!isDone) {
      const debt2collateral = this.$utils.number.toPrecision(
        +debtPrice / +collateralPrice
      );
      const collateral2debt = this.$utils.number.toPrecision(
        1 / debt2collateral
      );
      minBid = this.$utils.number.toPrecision(
        +this.flip.bid * (1 + +this.collateral?.beg),
        8,
        2
      );
      maxBid = isStage1
        ? this.$utils.number.toPrecision(this.flip.tab, 8)
        : this.$utils.number.toPrecision(
            +this.flip.lot * (1 - +this.collateral?.beg),
            8
          );
      if (minBid >= maxBid) minBid = maxBid;

      curPrice = isStage1
        ? `1 ${debtSymbol} = ${debt2collateral} ${auctionSymbol}`
        : `1 ${auctionSymbol} = ${collateral2debt} ${debtSymbol}`;
      bidPrice = isStage1
        ? `1 ${debtSymbol} = ${this.$utils.number.toPrecision(
            (+this.inputDebtAmount || 0) * debt2collateral
          )} ${auctionSymbol}`
        : `1 ${auctionSymbol} = ${this.$utils.number.toPrecision(
            (+this.inputCollateralAmount || 0) * collateral2debt
          )} ${debtSymbol}`;

      debtFiatValue = +debtPrice * +this.flip.tab;
      collateralFiatValue = +collateralPrice * +this.flip.lot;
    }

    return {
      isDone,
      auctionLogo: this.auctionAsset?.logo,
      debtLogo: this.debtAsset?.logo,
      auctionSymbol,
      debtSymbol,
      isStage1,
      isStage2,
      colValue,
      curPrice,
      minBid,
      maxBid,
      bidPrice,
      debtPrice,
      collateralPrice,
      debtFiatValue,
      collateralFiatValue,
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
      if (
        dayjs(this.flip.tic).unix() === 0 ||
        dayjs(this.flip.tic).isAfter(dayjs(this.flip.end))
      ) {
        this.countDownTimer = dayjs(this.flip.end).diff(dayjs(), "seconds");
      }
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
      if (
        dayjs(this.flip.tic).unix() === 0 ||
        dayjs(this.flip.tic).isAfter(dayjs(this.flip.end))
      ) {
        this.countDownTimer = dayjs(this.flip.end).diff(dayjs(), "seconds");
      }
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

  autoBid(type: "min" | "max") {
    // !逻辑强依赖变量名
    if (this.meta.isDone) return;
    if (this.meta.isStage1) {
      this.inputDebtAmount = this.meta[`${type}Bid`];
    } else {
      this.inputCollateralAmount = this.meta[`${type}Bid`];
    }
  }

  meetDebt(val) {
    const isMeet = +val >= this.meta.minBid && +val <= this.meta.maxBid;
    return isMeet;
  }

  meetCollateral(val) {
    return +val <= this.meta.maxBid;
  }

  get title() {
    return `${this.$t("auction.title.details")}`;
  }
}
</script>

<style lang="scss" scoped>
.statusbar {
  position: fixed;
  top: 44px;
  left: 0;
  z-index: 99;
  width: 100vw;
  line-height: 17px;
  &-debt {
    background-color: #2cc94e !important;
  }
  &-collateral {
    background-color: #f58721 !important;
  }

  &-left {
    font-weight: 500;
  }

  &-right {
    font-weight: bold !important;
    &-ends {
      font-weight: normal !important;
      opacity: 0.5;
    }
  }
}

.collateral {
  margin-top: 49px;
}

.input {
  &-debt,
  &-collateral {
    width: 100%;
  }
}

.tooltip {
  display: inline-block;
}
</style>
