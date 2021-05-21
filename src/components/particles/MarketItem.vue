<template>
  <v-layout align-center class="f-bg-greyscale-7">
    <v-layout column>
      <v-row align-center class="ma-4">
        <f-mixin-asset-logo
          class="flex-grow-0 z-index-2"
          :size="24"
          :logo="collateralLogo"
        ></f-mixin-asset-logo>
        <f-mixin-asset-logo
          class="flex-grow-0 ml-n2"
          :size="24"
          :logo="debtLogo"
        ></f-mixin-asset-logo>

        <span class="f-title-2 ml-2"> {{ meta.name }}</span>

        <v-spacer />
        <!-- <v-btn
          text
          class="f-caption primary--text align-self-center"
          @click="toMarketDetail"
        >
          <span class="f-caption">{{ $t("common.detail") }}</span>
          <v-icon color="primary" size="14">{{
            $icons.mdiChevronRight
          }}</v-icon>
        </v-btn> -->
      </v-row>
      <v-divider />
      <v-row class="ma-0 pa-4">
        <v-col
          class="mx-0 mb-2 pa-0"
          cols="12"
          xs="6"
          sm="6"
          md="4"
          lg="3"
          v-for="(item, ix) in infos"
          :key="ix"
        >
          <div class="f-caption">{{ item.title }}</div>
          <h2>
            {{ item.value
            }}<span v-if="item.valueUnit" class="f-caption text--secondary">{{
              item.valueUnit
            }}</span>
          </h2>
          <h4 v-if="item.exTitle">
            {{ item.exTitle }} {{ item.exValue
            }}<span v-if="item.valueUnit" class="f-caption text--secondary">{{
              item.exValueUnit
            }}</span>
          </h4>
        </v-col>
      </v-row>
    </v-layout>
    <!-- <v-icon class="icon" size="20">{{ "$vuetify.icons.iconListArrow" }}</v-icon> -->
  </v-layout>
</template>

<script lang="ts" scoped>
import dayjs from "dayjs";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Action, Getter, State } from "vuex-class";
import { ICollateral, IOracle } from "~/services/types/vo";

@Component
export default class MarketItem extends Vue {
  @Prop() collateral!: ICollateral;
  @State((state) => state.app.settings) settings;
  @Getter("global/getAssetById") getAssetById;
  @Getter("oracle/findByAssetId") getOracle!: (id) => IOracle;
  @Action("oracle/sync") syncOracles;
  @Action("global/syncMarkets") syncMarkets;

  get resize() {
    return this.$utils.helper.mixinImageResize;
  }

  get oracle() {
    return this.getOracle(this.collateral.gem);
  }

  get meta() {
    const collateralValue =
      Number(this.collateral.ink) * Number(this.collateral.price);
    const available = this.$utils.collateral.maxAvailable(this.collateral);
    const rate = collateralValue / Number(this.collateral.art);
    return {
      name: this.collateral.name,
      price: this.collateral.price,
      available: this.$utils.number.toShort(available),
      rate: this.$utils.number.toFixed(rate * 100, 2),
      collateralAmount: this.collateral.ink,
      debtAmount: Number(this.collateral.art) * Number(this.collateral.rate),
      collateralValue: "$" + this.$utils.number.toPrecision(collateralValue),
    };
  }

  get infos() {
    return [
      {
        title: this.$t("market.item.total-asset-symbol", {
          symbol: this.collateralSymbol,
        }),
        value: this.meta.collateralAmount,
        valueUnit: this.collateralSymbol,
      },
      {
        title: this.$t("market.item.price"),
        value: this.meta.price,
        valueUnit: this.debtSymbol,
        exTitle: this.isValidOracle ? "Next: " : "",
        exValue: this.oracle?.next,
        exValueUnit: `(将于:${this.countDownText}后生效)`,
      },
      {
        title: this.$t("market.item.collateral-rate"),
        value: this.meta.rate,
        valueUnit: "%",
      },
      {
        title: this.$t("market.item.symbol-debt", {
          symbol: this.debtSymbol,
        }),
        value: this.meta.debtAmount,
        valueUnit: this.debtSymbol,
      },
      {
        title: this.$t("market.item.max-available"),
        value: this.meta.available,
        valueUnit: this.debtSymbol,
      },
    ];
  }

  get collateralSymbol() {
    return this.getAssetById(this.collateral?.gem)?.symbol;
  }

  get debtSymbol() {
    return this.getAssetById(this.collateral?.dai)?.symbol;
  }

  get collateralLogo() {
    return this.getAssetById(this.collateral?.gem)?.logo;
  }

  get debtLogo() {
    return this.getAssetById(this.collateral?.dai)?.logo;
  }

  get isValidOracle() {
    return dayjs(this.oracle?.peek_at)
      .add(this.oracle?.hop, "second")
      .isAfter(Date.now());
  }

  @Watch("oracle")
  onOracleUpdate(newVal: IOracle) {
    if (newVal) {
      clearInterval(this.countId);
      this.countDownTimer =
        dayjs(newVal.peek_at).add(newVal.hop, "second").diff(Date.now()) / 1000;
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
      this.countDownTimer = this.countDownTimer - 1;
      this.countDownText = dayjs
        .duration(this.countDownTimer, "seconds")
        .format("HH:mm:ss");
      if (this.countDownTimer <= 0) {
        clearInterval(this.countId);
        this.syncMarkets();
        this.syncOracles();
      }
    }, 1000);
  }

  toMarketDetail() {
    this.$router.push(`/market/${this.collateral.id}`);
  }

  generateNewVault() {
    this.$router.push(`/vault/open?id=${this.collateral.id}`);
  }
}
</script>

<style lang="scss" scoped>
.icon {
  align-self: center;
  margin-right: 2px;
  margin-left: 8px;
}
.z-index-2 {
  z-index: 2;
}
.vertical-center {
  vertical-align: middle;
}
</style>
