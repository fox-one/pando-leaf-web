<template>
  <f-panel :class="`my-vault-card pa-0 f-bg-${risk}`">
    <v-layout column class="my-vault-card">
      <v-layout
        @click="toDetail"
        row
        align-center
        class="ma-0 mt-4 pa-0 flex-grow-0"
      >
        <f-mixin-asset-logo
          class="flex-grow-0 ml-6 mr-1 z-index-2"
          :size="40"
          :logo="collateralLogo"
        ></f-mixin-asset-logo>
        <f-mixin-asset-logo
          class="flex-grow-0 ml-n2 mr-1"
          :size="40"
          :logo="debtLogo"
        ></f-mixin-asset-logo>
        <span class="f-caption ml-1">{{
          `${collateralName} #${vault.identity_id}`
        }}</span>
        <v-spacer></v-spacer>
        <!-- <div :class="`mr-1 f-${risk}`">
          {{ this.meta.collateralizationRatioText }}
        </div> -->
        <v-btn text fab circle rounded class="mr-2" @click="toDetail">
          <v-icon size="40" color="primary">$iconMoreInfo</v-icon>
        </v-btn>
      </v-layout>
      <v-row
        @click="toDetail"
        no-gutters
        class="px-2 mb-3 f-body-2 font-weight-bold"
      >
        <v-col
          class="py-3 pl-4"
          v-for="item in infos"
          :key="item.title"
          sm="6"
          xs="6"
          md="6"
          cols="6"
        >
          <v-layout align-center>
            <span :class="`f-caption font-weight-bold ` + item.titleClass">
              {{ item.title }}</span
            >
            <span><base-tooltip :hint="item.hint" /></span>
          </v-layout>
          <div :class="`f-body-2 ` + item.valueClass">
            {{ item.value }} <span>{{ item.valueUnit }}</span>
          </div>
        </v-col>
      </v-row>
      <div
        v-if="collateralAmount === 0"
        class="f-caption f-greyscale-1 opacity4 mt-2 mb-6 ml-6"
      >
        {{ "This vault don’t have any collateral" }}
      </div>
      <v-spacer />
      <v-layout column class="ma-0 pa-0 flex-grow-0">
        <v-divider class="mx-6" />
        <v-layout justify-space-around class="buttons">
          <v-btn
            text
            :disabled="meta.debtAmount === 0"
            :min-height="68"
            color="primary"
            class="f-actionbar-button-label f-caption f-weight-m"
            @click="toPayback"
          >
            <v-layout column justify-center align-center>
              <v-icon size="32">$iconPayback</v-icon>
              <div class="f-caption">{{ $t("button.pay-back") }}</div>
            </v-layout>
          </v-btn>
          <v-btn
            text
            color="primary"
            :disabled="inLiquidation || meta.collateralAmount === 0"
            class="f-actionbar-button-label f-caption f-weight-m"
            :min-height="68"
            @click="toGenerate"
          >
            <v-layout column justify-center align-center>
              <v-icon size="32">$iconGenerate</v-icon>
              <div class="f-caption">{{ $t("button.generate") }}</div>
            </v-layout>
          </v-btn>
          <v-btn
            text
            color="primary"
            :min-height="68"
            class="f-actionbar-button-label f-caption f-weight-m"
            @click="toWithdraw"
          >
            <v-layout column justify-center align-center>
              <v-icon size="32">$iconWithdraw</v-icon>
              <div class="f-caption">{{ $t("button.withdraw") }}</div>
            </v-layout>
          </v-btn>
          <v-btn
            text
            color="primary"
            :min-height="68"
            class="f-actionbar-button-label f-caption f-weight-m"
            @click="toDeposit"
          >
            <v-layout column justify-center align-center>
              <v-icon size="32">$iconDeposit</v-icon>
              <div class="f-caption">{{ $t("button.deposit") }}</div>
            </v-layout>
          </v-btn>
        </v-layout>
      </v-layout>
    </v-layout>
  </f-panel>
</template>

<script lang="ts" scoped>
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter, State } from "vuex-class";
import { ICollateral, IOracle, IVault } from "~/services/types/vo";
import ValueChangedInfoGridItem from "./ValueChangedInfoGridItem.vue";

@Component({
  components: {
    ValueChangedInfoGridItem,
  },
})
export default class MyVaultItem extends Vue {
  @Prop() vault!: IVault;
  @State((state) => state.app.settings) settings;
  @Getter("global/getCollateral") getCollateral!: (id) => ICollateral;
  @Getter("global/getAssetById") getAssetById;
  @Getter("oracle/findByAssetId") getOracleByAssetId!: (id) => IOracle;

  tooltip = false;

  get resize() {
    return this.$utils.helper.mixinImageResize;
  }

  get gemOracle() {
    return this.getOracleByAssetId(this.collateral?.gem);
  }

  get daiOracle() {
    return this.getOracleByAssetId(this.collateral?.dai);
  }

  get collateral() {
    return this.getCollateral(this.vault?.collateral_id);
  }

  get collateralName() {
    return this.collateral?.name;
  }

  get collateralAsset() {
    return this.getAssetById(this.collateral?.gem);
  }

  get debtAsset() {
    return this.getAssetById(this.collateral?.dai);
  }

  get collateralLogo() {
    return this.getAssetById(this.collateral?.gem)?.logo;
  }

  get collateralSymbol() {
    return this.collateralAsset?.symbol;
  }

  get debtLogo() {
    return this.getAssetById(this.collateral?.dai)?.logo;
  }

  get debtSymbol() {
    return this.debtAsset?.symbol;
  }

  get collateralAmount() {
    return Number(this.vault?.ink);
  }

  get debtAmount() {
    return (
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1")
    );
  }

  get maxAvailableToGenerate() {
    const debtAmount =
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1");
    const collateralAmount = Number(this.vault?.ink);
    const price = Number(this.collateral?.price);
    const mininumRatio = Number(this.collateral?.mat);
    const max = (collateralAmount * price) / mininumRatio - debtAmount;
    if (max < 0) return "0";
    const catMax = this.$utils.collateral.maxAvailable(this.collateral);
    return this.$utils.number.toPrecision(Math.min(max, catMax));
  }

  get maxAvailableToWithdraw() {
    const debtAmount =
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1");
    if (debtAmount === 0) {
      return this.vault?.ink;
    }
    const collateralAmount = Number(this.vault?.ink);
    const price = Number(this.collateral?.price);
    const mininumRatio = Number(this.collateral?.mat);
    const max = collateralAmount - (mininumRatio * debtAmount) / price;
    if (max < 0) return "0";
    return this.$utils.number.toPrecision(max);
  }

  get meta() {
    const debtAmount =
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1");
    const collateralAmount = Number(this.vault?.ink);
    const collateralizationRatio =
      (collateralAmount * Number(this.collateral?.price)) / debtAmount;
    let collateralizationRatioText =
      this.$utils.number.toFixed(collateralizationRatio * 100, 1) + "%";
    if (!this.$utils.number.isValid(collateralizationRatio)) {
      collateralizationRatioText = "N/A";
    }
    const liquidationRatio = Number(this.collateral?.mat);
    const liquidationPrice = (debtAmount * liquidationRatio) / collateralAmount;
    const stabilityFee = this.$utils.number.toFixed(
      (Number(this.collateral?.duty) - 1) * 100,
      2
    );
    return {
      liquidationPrice: this.$utils.number.toPrecision(liquidationPrice),
      collateralizationRatio,
      collateralizationRatioText,
      stabilityFee,
      debtAmount,
      collateralAmount,
    };
  }

  get risk() {
    return this.$utils.helper.risk(
      this.meta.collateralizationRatio,
      this.collateral.mat
    );
  }

  get inLiquidation() {
    return this.meta.collateralizationRatio <= Number(this.collateral.mat);
  }

  get infos() {
    if (this.collateralAmount === 0) return [];
    const infos: any[] = [
      {
        title: this.$t("me.vault-item.symbol-locked", {
          symbol: this.collateralSymbol,
        }),
        value: this.$utils.number.toPrecision(this.vault?.ink),
        valueUnit: this.collateralSymbol,
        valueClass: `font-weight-bold`,
      },
      {
        title: this.$t("me.vault-item.outstanding-symbol-debt", {
          symbol: this.debtSymbol,
        }),
        value: this.$utils.number.toPrecision(
          Number(this.vault?.art) * Number(this.collateral?.rate),
          undefined,
          BigNumber.ROUND_UP
        ),
        valueUnit: this.debtSymbol,
        valueClass: `font-weight-bold`,
      },
      // {
      //   title: this.$t("form.info.minimum-ratio"),
      //   value: this.$utils.number.toFixed(
      //     Number(this.collateral?.mat) * 100,
      //     2
      //   ),
      //   valueUnit: "%",
      // },
    ];
    if (this.debtAmount === 0) return infos;
    infos.push(
      {
        title: this.$t("me.vault-item.collateral-ratio"),
        value: this.meta.collateralizationRatioText,
        titleClass: `f-${this.risk}`,
        valueClass: `f-${this.risk} font-weight-bold`,
      },
      {
        title: this.$t("form.info.current-symbol-price", {
          symbol: this.collateralSymbol,
        }),
        value: this.$utils.number.toPrecision(this.collateral?.price),
        valueUnit: this.debtSymbol,
        titleClass: `f-greyscale-1 opacity4`,
        valueClass: `f-greyscale-1`,
      },
      {
        title: this.$t("form.info.liquidation-price"), // debt * ratio / collateral
        value: this.meta?.liquidationPrice,
        valueUnit: this.debtSymbol,
        titleClass: `f-greyscale-1 opacity4`,
        valueClass: `f-greyscale-1`,
      },
      {
        title: this.$t("me.vault-item.next-price"),
        value: this.isValidOracle
          ? this.$utils.number.toPrecision(
              this.$utils.time.oracleNext(this.gemOracle, this.daiOracle)
                ?.price || "-"
            )
          : "-",
        valueUnit: this.isValidOracle ? this.debtSymbol : "",
        hint: this.isValidOracle
          ? this.$t("form.info.oracle-price", {
              time: this.$utils.time.format(
                this.$utils.time.oracleNext(this.gemOracle, this.daiOracle)
                  ?.peek_at
              ),
            })
          : "",
        titleClass: `f-greyscale-1 opacity4`,
        valueClass: `f-greyscale-1`,
      }
    );
    return infos;
  }

  get isValidOracle() {
    const next = this.$utils.time.oracleNext(this.gemOracle, this.daiOracle);
    return next && next.peek_at && dayjs(next.peek_at).isAfter(Date.now());
  }

  toDeposit() {
    this.$router.push(`/vault/deposit?id=${this.vault.id}`);
  }
  toWithdraw() {
    this.$router.push(`/vault/withdraw?id=${this.vault.id}`);
  }
  toGenerate() {
    this.$router.push(`/vault/generate?id=${this.vault.id}`);
  }
  toPayback() {
    this.$router.push(`/vault/payback?id=${this.vault.id}`);
  }
  toDetail() {
    this.$router.push(`/vault/detail?id=${this.vault.id}`);
  }
}
</script>

<style lang="scss" scoped>
.my-vault-card {
  @media only screen and (min-width: 960px) {
    height: 342px;
  }
}
.z-index-2 {
  z-index: 2;
}
.opacity4 {
  opacity: 0.4;
}
</style>
