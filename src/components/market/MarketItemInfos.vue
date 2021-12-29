<template>
  <v-row no-gutters class="pb-2" @click="bindExpand = !bindExpand">
    <market-infos-item
      class="mb-4 px-6"
      cols="12"
      v-for="(item, ix) in infos.slice(0, 5)"
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
    >
      <market-infos-item
        class="mb-4 px-6"
        cols="12"
        v-for="(item, ix) in infos.slice(5, infos.length)"
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
    </v-row>

    <v-col class="d-flex justify-center" v-if="!disabled">
      <v-icon
        size="14"
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
import MarketInfosItem from "./MarketInfosItem.vue";
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
    const infoList = [
      {
        title: this.$t("common.min-collateral-ratio"),
        value: this.meta.minimumRatioText,
      },
      {
        title: this.$t("common.stability-fee"),
        value: this.meta.stabilityFee,
      },
      {
        title: this.$t("market.total-asset-symbol", {
          symbol: this.meta.collateralSymbol,
        }),
        value: this.meta.collateralAmount,
        valueUnit: this.meta.collateralSymbol,
        valueClass: "font-weight-bold f-greyscale-1",
        hint: this.$t("tooltip.total-asset-in-market", {
          symbol: this.meta.collateralSymbol,
        }),
      },
      {
        title: this.$t("common.max-available"),
        value: this.meta.available,
        valueUnit: this.meta.debtSymbol,
        valueClass: "font-weight-bold f-greyscale-1",
      },
      {
        title: this.$t("common.symbol-debt", {
          symbol: this.meta.debtSymbol,
        }),
        value: this.meta.debtAmount,
        valueUnit: this.meta.debtSymbol,
        valueClass: "f-greyscale-1",
      },

      {
        title: this.$t("common.collateral-ratio"),
        value: this.meta.rate,
        valueClass: `font-weight-bold ${this.meta.riskLevel.color}--text`,
        hint: this.$t("tooltip.collateralization-ratio"),
        learnMore: LINKS["vault.liquidation-ratio"],
      },
      {
        title: this.$t("common.price"),
        value: this.meta.price,
        valueUnit: this.meta.debtSymbol,
        valueClass: "f-greyscale-1",
      },
      {
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
      },
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
  transition: cubic-bezier(0.6, 0, 0.2, 1) 1s;

  &.content {
    transition-property: height, opacity, margin-top;
  }

  &.collapse {
    height: 0px;
    opacity: 0;
    margin-top: -16px;
  }

  &.expanded {
    height: 96px;
    opacity: 1;
  }
}
</style>
