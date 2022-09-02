<template>
  <v-row no-gutters class="pb-4" @click="bindExpand = !bindExpand">
    <market-infos-item
      class="mb-6 px-6"
      cols="12"
      v-for="(item, ix) in infos.slice(0, expandCount)"
      :key="ix"
      :label-class="item.labelClass"
      :value-class="item.valueClass"
      :title="item.title"
      :value="item.value"
      :value-unit="item.valueUnit"
      :learn-more="item.learnMore"
      :hint="item.hint"
    >
    </market-infos-item>

    <v-row
      no-gutters
      class="expand-transition content"
      :class="bindExpand || disabled ? 'expanded' : 'collapse'"
      :style="{
        height:
          bindExpand || disabled
            ? (infos.length - expandCount) * 40 - 24 + 'px'
            : '0px',
      }"
    >
      <market-infos-item
        class="pb-6 px-6 opacity-transition"
        v-for="(item, ix) in infos.slice(expandCount, infos.length)"
        :key="ix"
        :class="`${bindExpand || disabled ? 'expanded' : 'collapse'} item-${
          bindExpand ? ix + 2 : infos.length - expandCount - ix - 1
        }`"
        cols="12"
        :label-class="item.labelClass"
        :value-class="item.valueClass"
        :title="item.title"
        :value="item.value"
        :value-unit="item.valueUnit"
        :learn-more="item.learnMore"
        :hint="item.hint"
      >
      </market-infos-item>
    </v-row>

    <v-col class="d-flex justify-center mb-n1" cols="12" v-if="!disabled">
      <v-icon
        size="16"
        color="greyscale_4"
        class="expand-transition"
        :class="bindExpand ? 'expand' : ''"
      >
        $FIconChevronDown4P
      </v-icon>
    </v-col>
  </v-row>
</template>

<script lang="ts" scoped>
import dayjs from "dayjs";
import { Vue, Component, Prop, Watch, PropSync } from "vue-property-decorator";
import MarketInfosItem from "@/components/market/MarketInfosItem.vue";
import { Get, Sync } from "vuex-pathify";
import { LINKS } from "~/constants";

@Component({
  components: {
    MarketInfosItem,
  },
})
export default class MarketItemInfos extends Vue {
  @Prop() collateral!: API.Collateral;

  @Sync("state/app@settings") settings;

  @Get("oracle/getOracleById") getOracleById;

  @PropSync("expand") bindExpand!: boolean;

  @Prop({ default: false }) disabled!: boolean;

  @Prop({ default: 5 }) expandCount!: number;

  @Prop({ default: false }) newVaultSorted!: boolean;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const {
      collateralSymbol,
      debtSymbol,
      collateralPrice,
      collateralAsset,
      collateralAmount,
      debtAmount,
      debtAsset,
      collateralFiat,
      maxAvailable,
      nextPrice,
      minimumRatio,
      minimumRatioText,
      stabilityFee,
    } = getters.getMarketFields(this.collateral?.id);
    const { toPrecision, toPercent, simplize } = this.$utils.number;

    const rate = collateralFiat / Number(this.collateral?.art ?? "0");

    const riskLevel = this.$utils.vault.getRiskLevelMeta(rate, minimumRatio);

    const isValidOracle =
      collateralPrice !== nextPrice?.price &&
      this.$utils.oracle.isValidOracle(nextPrice);
    return {
      name: this.collateral?.name ?? "",
      price: toPrecision({ n: this.collateral?.price ?? 0 }),
      available: simplize({ n: maxAvailable }),
      rate: Number.isNaN(rate) ? "-" : toPercent({ n: rate }),
      collateralAmount: simplize({ n: collateralAmount }),
      debtAmount: simplize({ n: debtAmount }),
      collateralFiat: "$" + toPrecision({ n: collateralFiat }),
      collateralSymbol,
      debtSymbol,
      collateralLogo: collateralAsset?.logo,
      debtLogo: debtAsset?.logo,
      nextPrice,
      isValidOracle,
      minimumRatioText,
      riskLevel,
      stabilityFee: toPercent({ n: stabilityFee }),
    };
  }

  get infos() {
    const minimumRatioItem = {
      title: this.$t("common.min-collateral-ratio"),
      value: this.meta.minimumRatioText,
    };
    const stabilityFeeItem = {
      title: this.$t("common.stability-fee"),
      value: this.meta.stabilityFee,
    };
    const collateralAmountItem = {
      title: this.$t("market.total-asset-symbol", {
        symbol: this.meta.collateralSymbol,
      }),
      value: this.meta.collateralAmount,
      valueUnit: this.meta.collateralSymbol,
      valueClass: "f-greyscale-1",
      hint: this.$t("tooltip.total-asset-in-market", {
        symbol: this.meta.collateralSymbol,
      }),
    };
    const maxAvailableItem = {
      title: this.$t("common.max-available"),
      value: this.meta.available,
      valueUnit: this.meta.debtSymbol,
      valueClass: "f-greyscale-1",
    };
    const debtItem = {
      title: this.$t("common.symbol-debt", {
        symbol: this.meta.debtSymbol,
      }),
      value: this.meta.debtAmount,
      valueUnit: this.meta.debtSymbol,
      valueClass: "f-greyscale-1",
    };
    const collateralRatioItem = {
      title: this.$t("common.collateral-ratio"),
      value: this.meta.rate,
      valueClass: `font-weight-bold ${this.meta.riskLevel.color}--text`,
      hint: this.$t("tooltip.collateralization-ratio"),
      learnMore: LINKS["vault.liquidation-ratio"],
    };
    const priceItem = {
      title: this.$t("common.price"),
      value: this.meta.price,
      valueUnit: this.meta.debtSymbol,
      valueClass: "f-greyscale-1",
    };
    const nextPriceItem = {
      title: this.$t("common.next-price"),
      value: this.meta.isValidOracle
        ? this.$utils.number.toPrecision({
            n: this.meta.nextPrice?.price ?? "0",
          })
        : "-",
      valueUnit: this.meta.debtSymbol,
      hint: this.meta.isValidOracle
        ? this.$t("tooltip.next-price", {
            time: this.countDownText,
          })
        : false,
      learnMore: LINKS["vault.price-oracles"],
      valueClass: "f-greyscale-1",
    };
    if (this.newVaultSorted) {
      return [
        minimumRatioItem,
        stabilityFeeItem,
        priceItem,
        nextPriceItem,
        collateralAmountItem,
        maxAvailableItem,
        debtItem,
        collateralRatioItem,
      ];
    }
    const infoList = [
      minimumRatioItem,
      stabilityFeeItem,
      collateralAmountItem,
      maxAvailableItem,
      debtItem,
      collateralRatioItem,
      priceItem,
      nextPriceItem,
    ];
    return infoList;
  }

  @Watch("meta.nextPrice", { immediate: true })
  onDaiOracleUpdate(newVal: Utils.NextPrice) {
    if (newVal && this.meta.isValidOracle) {
      clearInterval(this.countId);
      this.countDownTimer =
        dayjs(this.meta.nextPrice?.time).diff(Date.now()) / 1000;
      this.startCountDown();
    }
  }

  countDownTimer = 0;
  countDownText = "";
  countId = 0 as any;

  startCountDown() {
    if (this.countDownTimer <= 0) return;
    clearInterval(this.countId);
    this.countId = setInterval(() => {
      this.countDownTimer =
        dayjs(this.meta.nextPrice?.time).diff(Date.now()) / 1000;
      this.countDownText = dayjs
        .duration(this.countDownTimer, "seconds")
        .format("mm:ss");
      if (this.countDownTimer <= 0) {
        clearInterval(this.countId);
        this.$utils.app.loadMarket(this);
      }
    }, 100);
  }
}
</script>

<style lang="scss" scoped>
.vertical-center {
  vertical-align: middle;
}
.expand {
  transform: rotateX(180deg);
}
.expand-transition {
  transition: cubic-bezier(0.65, 0, 0.2, 1) 0.6s;

  &.content {
    transition-property: height, margin-top;
  }

  &.collapse {
    margin-top: -16px;
    transition-delay: 0.2s;
  }

  &.expand {
    margin-top: 8px;
  }
}

.opacity-transition {
  transition: linear 0.3s;
  transition-property: opacity;

  @for $i from 0 through 9 {
    &.item-#{$i} {
      transition-delay: 0.08s * $i;
    }
  }

  &.collapse {
    opacity: 0;
  }

  &.expanded {
    opacity: 1;
  }
}
</style>
