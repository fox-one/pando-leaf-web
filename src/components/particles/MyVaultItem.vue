<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="pa-0">
      <v-layout column>
        <v-layout row align-center class="ma-0 mt-4 pa-0">
          <f-mixin-asset-logo
            class="flex-grow-0 ml-4 mr-1 z-index-2"
            :size="24"
            :logo="collateralLogo"
          ></f-mixin-asset-logo>
          <f-mixin-asset-logo
            class="flex-grow-0 ml-n3 mr-1"
            :size="24"
            :logo="debtLogo"
          ></f-mixin-asset-logo>
          <span class="f-title-2">{{
            `${collateral.name} #${vault.identity_id}`
          }}</span>
          <v-spacer></v-spacer>
          <div :class="`mr-1 f-${risk}`">
            {{ this.meta.collateralizationRatioText }}
          </div>
          <f-tooltip v-model="tooltip" top>
            <template #activator="{ on, attrs }">
              <v-icon size="16" v-on="on" v-bind="attrs">{{
                $icons.mdiHelpCircleOutline
              }}</v-icon>
            </template>
            <div class="f-greyscale-4 f-caption">
              {{ $t("me.vault-item.collateral-ratio") }}
            </div>
          </f-tooltip>
        </v-layout>
        <v-layout v-if="inLiquidation" column class="red pl-4 my-4 ml-4">
          <div class="mt-2 f-caption">
            {{ $t("me.vault-item.in-liquidation-tips1") }}
          </div>
          <div class="mb-2 f-caption">
            {{ $t("me.vault-item.in-liquidation-tips2") }}
          </div>
        </v-layout>
        <f-info-grid :window-size="2" class="mt-2">
          <f-info-grid-item
            v-for="(item, ix) in infos"
            :key="ix"
            :index="ix"
            :title="item.title"
            :value="item.value"
            :value-unit="item.valueUnit"
            :value-color="item.valueColor"
            :hint="item.hint"
          ></f-info-grid-item>
        </f-info-grid>
      </v-layout>
    </v-expansion-panel-header>
    <v-expansion-panel-content class="content-panel">
      <v-layout column class="ma-0 pa-0">
        <f-info-grid :window-size="2">
          <f-info-grid-item
            v-for="(item, ix) in collapseInfos"
            :key="ix"
            :index="ix"
            :title="item.title"
            :value="item.value"
            :value-unit="item.valueUnit"
            :value-color="item.valueColor"
            :hint="item.hint"
          ></f-info-grid-item>
        </f-info-grid>
        <v-layout justify-space-around class="buttons">
          <v-btn
            text
            :min-height="68"
            class="f-actionbar-button-label f-caption f-weight-m"
            @click="toDeposit"
          >
            <v-layout column justify-center align-center>
              <v-icon color="primary">{{ $icons.mdiPlusCircle }}</v-icon>
              <div class="caption">{{ $t("button.deposit") }}</div>
            </v-layout>
          </v-btn>
          <v-btn
            text
            :disabled="inLiquidation"
            :min-height="68"
            class="f-actionbar-button-label f-caption f-weight-m"
            @click="toWithdraw"
          >
            <v-layout column justify-center align-center>
              <v-icon color="primary">{{ $icons.mdiMinusCircle }}</v-icon>
              <div class="caption">{{ $t("button.withdraw") }}</div>
            </v-layout>
          </v-btn>
          <v-btn
            text
            :disabled="inLiquidation"
            class="f-actionbar-button-label f-caption f-weight-m"
            :min-height="68"
            @click="toGenerate"
          >
            <v-layout column justify-center align-center>
              <v-icon color="green">{{ $icons.mdiLock }}</v-icon>
              <div class="caption">{{ $t("button.generate") }}</div>
            </v-layout>
          </v-btn>
          <v-btn
            text
            :min-height="68"
            class="f-actionbar-button-label f-caption f-weight-m"
            @click="toPayback"
          >
            <v-layout column justify-center align-center>
              <v-icon color="deep-orange">{{ $icons.mdiLockOpen }}</v-icon>
              <div class="caption">{{ $t("button.pay-back") }}</div>
            </v-layout>
          </v-btn>
        </v-layout>
      </v-layout>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts" scoped>
import BigNumber from "bignumber.js";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter, State } from "vuex-class";
import { ICollateral, IVault } from "~/services/types/vo";

@Component
export default class MyVaultItem extends Vue {
  @Prop() vault!: IVault;
  @State((state) => state.app.settings) settings;
  @Getter("global/getCollateral") getCollateral!: (id) => ICollateral;
  @Getter("global/getAssetById") getAssetById;

  tooltip = false;

  get resize() {
    return this.$utils.helper.mixinImageResize;
  }

  get collateral() {
    return this.getCollateral(this.vault?.collateral_id);
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

  get maxAvailableToGenerate() {
    const debtAmount =
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1");
    const collateralAmount = Number(this.vault?.ink);
    const price = Number(this.collateral?.price);
    const mininumRatio = Number(this.collateral?.mat);
    const max = (collateralAmount * price) / mininumRatio - debtAmount;
    if (max < 0) return "0";
    return this.$utils.number.toPrecision(max);
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
      this.$utils.number.toFixed(collateralizationRatio * 100, 2) + "%";
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
    return [
      {
        title: this.$t("me.vault-item.symbol-locked", {
          symbol: this.collateralSymbol,
        }),
        value: this.$utils.number.toPrecision(this.vault?.ink),
        valueUnit: this.collateralSymbol,
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
      },
      {
        title: this.$t("me.vault-item.available-to-withdraw"),
        value: this.maxAvailableToWithdraw,
        valueUnit: this.collateralSymbol,
        valueColor: this.inLiquidation ? "red" : "",
      },
      {
        title: this.$t("me.vault-item.available-to-generate"),
        value: this.maxAvailableToGenerate,
        valueUnit: this.debtSymbol,
        valueColor: this.inLiquidation ? "red" : "",
      },
    ];
  }

  get collapseInfos() {
    return [
      {
        title: this.$t("form.info.liquidation-price"), // debt * ratio / collateral
        value: this.meta?.liquidationPrice,
        valueUnit: this.debtSymbol,
      },
      {
        title: this.$t("form.info.minimum-ratio"),
        value: this.$utils.number.toFixed(
          Number(this.collateral?.mat) * 100,
          2
        ),
        valueUnit: "%",
      },
      {
        title: this.$t("form.info.current-symbol-price", {
          symbol: this.collateralSymbol,
        }),
        value: this.collateral?.price,
        valueUnit: this.debtSymbol,
      },
      {
        title: this.$t("form.info.stability-fee"),
        value: this.meta?.stabilityFee,
        valueUnit: "%",
      },
    ];
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
}
</script>

<style lang="scss" scoped>
.content-panel {
  ::v-deep {
    .v-expansion-panel-content__wrap {
      padding: 0px 0px;
      .f-info-grid-inner {
        padding-top: 0px !important;
      }
    }
  }
}
.z-index-2 {
  z-index: 2;
}
</style>
