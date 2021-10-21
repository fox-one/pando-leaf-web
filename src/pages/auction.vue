<template>
  <v-container class="pa-0">
    <v-layout column>
      <auction-status :flip="flip" />

      <f-panel
        elevation="none"
        class="collateral pa-4 no-border-radius greyscale_1--text"
      >
        <v-layout column>
          <auction-detail :flip="flip" />

          <f-divider class="my-4" />

          <auction-done-detail v-if="meta.isDone" :flip="flip" />

          <v-layout v-else column>
            <auction-rules :flip="flip" />

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

              <auction-min-bid
                v-if="meta.isStage1"
                :flip="flip"
                :debt-amount.sync="inputDebtAmount"
              />

              <auction-max-bid
                :flip="flip"
                :debt-amount.sync="inputDebtAmount"
                :collateral-amount.sync="inputCollateralAmount"
              />

              <auction-bid-warning
                v-if="meta.isStage2"
                :flip="flip"
                :collateral-amount.sync="inputCollateralAmount"
              />
            </v-layout>

            <base-connect-wallet-btn
              rounded
              large
              depressed
              color="primary"
              @click="handleLogin"
            >
              <f-button
                :disabled="confirmDisabled"
                color="primary"
                style="height: 48px"
                @click="bidding"
                class="mt-8 mb-4 px-8 align-self-center"
              >
                {{ $t("auction.button.confirm") }}
              </f-button>
            </base-connect-wallet-btn>
          </v-layout>
        </v-layout>
      </f-panel>

      <div class="mt-2 f-bg-greyscale-6" style="height: 8px"></div>
      <f-panel
        elevation="none"
        v-if="events && events.length !== 0"
        class="px-4 pt-6 pb-0 no-border-radius"
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
import dayjs from "dayjs";
import AuctionStatus from "@/components/auction/AuctionStatus.vue";
import AuctionRules from "@/components/auction/AuctionRules.vue";
import AuctionDetail from "@/components/auction/AuctionDetail.vue";
import AuctionDoneDetail from "@/components/auction/AuctionDoneDetail.vue";
import AuctionMinBid from "@/components/auction/AuctionMinBid.vue";
import AuctionMaxBid from "@/components/auction/AuctionMaxBid.vue";
import AuctionBidWarning from "@/components/auction/AuctionBidWarning.vue";
import { Get } from "vuex-pathify";
import { FlipAction, FlipRequestAction, TransactionStatus } from "~/enums";
import { isDesktop } from "@foxone/utils/helper";
import { EVENTS } from "~/constants";

@Component({
  components: {
    AuctionStatus,
    AuctionRules,
    AuctionDetail,
    AuctionDoneDetail,
    AuctionMinBid,
    AuctionMaxBid,
    AuctionBidWarning,
  },
})
export default class AuctionPage extends Mixins(mixins.page) {
  @Get("collateral/getCollateralById") getCollateral!: (id) => API.Collateral;
  @Get("asset/getAssetById") getAssetById!: (id) => API.Asset;
  @Get("account/userId") user_id;

  loading = false;
  flip = {} as API.Flip;
  events = [] as API.FlipEvent[];
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

  get begText() {
    return this.$utils.number.toPercent({ n: +this.collateral?.beg - 1 });
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
    const colValue = this.$utils.number.toPrecision({
      n: (Number(collateralPrice) * Number(this.flip?.lot)) / Number(debtPrice),
    });
    const auctionSymbol = this.auctionAsset?.symbol;
    const debtSymbol = this.debtAsset?.symbol;
    let minBid = 0 as any,
      maxBid = 0 as any,
      curPrice = "",
      bidPrice = "",
      debtFiatValue = 0,
      collateralFiatValue = 0;
    if (!isDone) {
      const debt2collateral = this.$utils.number.toPrecision({
        n: +debtPrice / +collateralPrice,
      });
      const collateral2debt = this.$utils.number.toPrecision({
        n: 1 / +debt2collateral,
      });
      minBid = this.$utils.number.toPrecision({
        n: +this.flip.bid * +this.collateral?.beg,
        dp: 8,
        mode: 2,
      });
      maxBid = isStage1
        ? this.$utils.number.toPrecision({ n: this.flip.tab, dp: 8 })
        : this.$utils.number.toPrecision({
            n: +this.flip.lot / +this.collateral?.beg,
            dp: 8,
          });
      if (minBid >= maxBid) minBid = maxBid;

      curPrice = isStage1
        ? `1 ${debtSymbol} = ${debt2collateral} ${auctionSymbol}`
        : `1 ${auctionSymbol} = ${collateral2debt} ${debtSymbol}`;
      bidPrice = isStage1
        ? `1 ${debtSymbol} = ${this.$utils.number.toPrecision({
            n: (+this.inputDebtAmount || 0) * +debt2collateral,
          })} ${auctionSymbol}`
        : `1 ${auctionSymbol} = ${this.$utils.number.toPrecision({
            n: (+this.inputCollateralAmount || 0) * +collateral2debt,
          })} ${debtSymbol}`;

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
    this.events = res?.events?.reverse();
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
      this.flip = res;
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
    } as API.ActionPayload;
    const pay_url = await this.$utils.payment.requestPayment(this, request);
    if (pay_url && isDesktop() && !this.$fennec.connected) {
      this.$emit(EVENTS.PAY_QR_CODE, { pay_url, follow_id: this.follow_id });
    } else {
      this.$utils.payment.showPaying(this);
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
    } as API.ActionPayload;
    const url = await this.$utils.payment.requestPayment(this, request);
    if (url && isDesktop() && !this.$fennec.connected) {
      this.$utils.payment.showPayQrDialog(this, {
        pay_url: url as string,
        follow_id: this.follow_id,
      });
    } else {
      this.$utils.payment.showPaying(this);
    }
    this.checkTransaction(this.follow_id);
  }

  checkTransaction(follow_id: string) {
    let intervalId = 0 as any;
    clearInterval(intervalId);
    intervalId = setInterval(async () => {
      const response = await this.$http.getTransaction(follow_id);
      if (
        response.status === TransactionStatus.OK ||
        response.status === TransactionStatus.Abort
      ) {
        clearInterval(intervalId);
        this.requestFlip();
        this.$utils.payment.hidePaying(this);
        this.$uikit.toast.success({
          message: `${this.$t("message.auction.success")}`,
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
</style>
