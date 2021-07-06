<template>
  <v-container class="pa-0 pt-4 f-bg-greyscale-7" style="height: 100%">
    <v-layout justify-center>
      <f-button-tabs v-model="tabIndex">
        <template #tabs>
          <v-btn
            v-for="(item, index) in tabs"
            :key="index"
            :data-value="index"
            :ripple="false"
          >
            <span>{{ item.text }}</span>
          </v-btn>
        </template>
      </f-button-tabs>
    </v-layout>
    <v-layout v-if="tabIndex === 0" column>
      <v-layout class="mt-8 ml-4" align-center>
        <f-mixin-asset-logo
          class="z-index-2"
          :size="40"
          :logo="collateralAsset.logo"
        ></f-mixin-asset-logo>
        <f-mixin-asset-logo
          class="ml-n2"
          :size="40"
          :logo="debtAsset.logo"
        ></f-mixin-asset-logo>
        <div class="ml-2 f-caption f-greyscale-1">
          {{ collateral.name }} #{{ vault.identity_id }}
        </div>
      </v-layout>
      <v-row no-gutters class="mt-5 f-body-2 font-weight-bold">
        <v-col
          class="py-3 pl-4"
          v-for="item in metaInfos"
          :key="item.title"
          sm="6"
          xs="6"
          md="6"
          cols="6"
        >
          <v-layout align-center :class="item.titleClass">
            {{ item.title }} <span><base-tooltip :hint="item.hint" /></span>
          </v-layout>
          <div :class="item.valueClass">
            {{ item.value }} <span>{{ item.valueUnit }}</span>
          </div>
        </v-col>
      </v-row>

      <div class="f-bg-greyscale-6" style="height: 8px"></div>
      <div>
        <div class="mx-4 f-body-2" v-for="item in infos" :key="item.title">
          <v-layout style="height: 65.4px" align-center>
            <div class="f-greyscale-3">{{ item.title }}</div>
            <base-tooltip class="ml-1" :hint="item.hint"></base-tooltip>
            <v-spacer />
            <div class="f-greyscale-1">
              <span
                :class="
                  'f-info-grid-item-value ' +
                  (item.valueColor ? `${item.valueColor}--text` : '')
                "
                >{{ item.value }}</span
              >
              <span>{{ item.valueUnit }}</span>
            </div>
          </v-layout>
          <v-divider />
        </div>
      </div>
      <f-action-bar
        fixed
        class="ma-2 fixed-bottom f-bg-riskOrange"
        @click="handleActionClick"
        :actions="actionButtons"
      ></f-action-bar>
    </v-layout>

    <v-layout v-if="tabIndex === 1" column>
      <f-panel
        class="py-0"
        v-infinite-scroll="requestTx"
        infinite-scroll-distance="10"
      >
        <template v-for="(item, index) in histories">
          <v-divider
            :key="`${item.action}_${item.created_at}`"
            v-if="index !== 0"
          />
          <div :key="index" style="overflow: hidden">
            <history-item
              :history="item"
              :vault="vault"
              :collateral="collateral"
            ></history-item>
          </div>
        </template>
        <f-loading class="my-4" v-if="loading" :loading="loading" />
        <template v-else-if="histories.length === 0">
          <base-empty-section />
        </template>
      </f-panel>
      <div style="height: 100px"></div>
    </v-layout>
  </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins } from "vue-property-decorator";
import mixins from "~/mixins";
import VaultStats from "@/components/particles/VaultStats.vue";
import HistoryItem from "@/components/particles/HistoryItem.vue";
import BigNumber from "bignumber.js";
import { IOracle, IVaultEvent } from "~/services/types/vo";
import { Getter } from "vuex-class";
import dayjs from "dayjs";

@Component({
  components: {
    VaultStats,
    HistoryItem,
  },
})
export default class VaultDetail extends Mixins(mixins.vault) {
  @Getter("oracle/findByAssetId") getOracleByAssetId!: (id) => IOracle;
  histories = [] as IVaultEvent[];
  has_next = true;
  cursor = null as string | null;
  loading = false;
  tabIndex = 0;

  get tabs() {
    return [
      {
        text: this.$t("vault.tab.details"),
        value: "detail",
      },
      {
        text: this.$t("vault.tab.history"),
        value: "history",
      },
    ];
  }

  get title() {
    return `${this.$t("vault.detail.title")}`;
  }

  get appbar() {
    return {
      align: "center",
      back: true,
    };
  }

  get collateralAmount() {
    return this.vault?.ink;
  }

  get debtAmount() {
    return this.$utils.number.toPrecision(
      Number(this.vault?.art) * Number(this.collateral?.rate),
      8,
      BigNumber.ROUND_UP
    );
  }

  get gemOracle() {
    return this.getOracleByAssetId(this.collateral?.gem);
  }

  get daiOracle() {
    return this.getOracleByAssetId(this.collateral?.dai);
  }

  get isValidOracle() {
    const next = this.$utils.time.oracleNext(this.gemOracle, this.daiOracle);
    return next && next.peek_at && dayjs(next.peek_at).isAfter(Date.now());
  }

  get meta() {
    const debtAmount =
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1");
    const collateralAmount = Number(this.vault?.ink);
    const collateralizationRatio =
      (collateralAmount * Number(this.collateral?.price)) / debtAmount;
    const collateralizationRatioText = this.$utils.number.toFixed(
      collateralizationRatio * 100,
      4
    );
    const liquidationRatio = Number(this.collateral?.mat);
    const liquidationPrice = (debtAmount * liquidationRatio) / collateralAmount;
    const liquidationPenalty = this.$utils.number.toFixed(
      (Number(this.collateral?.chop) - 1) * 100,
      4
    );
    const stabilityFee = this.$utils.number.toFixed(
      (Number(this.collateral?.duty) - 1) * 100,
      4
    );
    return {
      debtAmount,
      collateralAmount,
      liquidationPrice: this.$utils.number.toPrecision(liquidationPrice),
      collateralizationRatio,
      collateralizationRatioText,
      liquidationPenalty,
      stabilityFee,
    };
  }

  get metaInfos() {
    const metaInfos: any[] = [
      {
        title: this.$t("vault.detail.collateral"),
        value: this.collateralAmount,
        valueUnit: this.collateralAsset?.symbol,
      },
      {
        title: this.$t("vault.detail.debt"),
        value: this.debtAmount,
        valueUnit: this.debtAsset?.symbol,
      },
      {
        title: this.$t("form.info.collateralization-ratio"), //
        value: this.$utils.number.isValid(this.meta.collateralizationRatio)
          ? this.meta.collateralizationRatioText
          : "N/A",
        valueUnit: this.$utils.number.isValid(this.meta.collateralizationRatio)
          ? `%`
          : "",
        titleClass: `f-${this.$utils.helper.risk(
          this.meta.collateralizationRatio,
          this.collateral.mat
        )}`,
        valueClass: `f-${this.$utils.helper.risk(
          this.meta.collateralizationRatio,
          this.collateral.mat
        )}`,
        hint: this.$t("form.tooltip.collateralization-ratio"),
      },
      {
        title: this.$t("form.info.current-price"),
        value: this.collateral?.price,
        valueUnit: this.debtAsset?.symbol,
        titleClass: "f-greyscale-3",
      },
      {
        title: this.$t("form.info.liquidation-price"), // debt * ratio / collateral
        value: this.meta.liquidationPrice,
        valueUnit: this.debtAsset?.symbol,
        hint: this.$t("form.tooltip.liquidation-price"),
        titleClass: "f-greyscale-3",
      },
    ];
    if (this.isValidOracle) {
      metaInfos.push({
        title: this.$t("market.item.oracle-next"),
        value: this.$utils.time.oracleNext(this.gemOracle, this.daiOracle)
          ?.price,
        valueUnit: this.debtAsset?.symbol,
        hint: this.$t("form.info.oracle-price", {
          time: this.$utils.time.format(
            this.$utils.time.oracleNext(this.gemOracle, this.daiOracle)?.peek_at
          ),
        }),
      });
    }
    return metaInfos;
  }

  get infos() {
    const debtAmount =
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1");
    const collateralAmount = Number(this.vault?.ink);
    const price = Number(this.collateral?.price);
    const mininumRatio = Number(this.collateral?.mat);
    const maxDebtAvaileble =
      (collateralAmount * price) / mininumRatio - debtAmount;
    const maxDebtAvailebleText = this.$utils.number.toPrecision(
      maxDebtAvaileble,
      8,
      BigNumber.ROUND_DOWN
    );

    if (debtAmount === 0) {
      return [];
    }
    const maxWithdrawAvaileble =
      collateralAmount - (mininumRatio * debtAmount) / price;
    const maxWithdrawAvailebleText = this.$utils.number.toPrecision(
      maxWithdrawAvaileble,
      8,
      BigNumber.ROUND_DOWN
    );
    return [
      {
        title: this.$t("form.info.available-to-withdraw"),
        value: maxWithdrawAvailebleText,
        valueUnit: this.collateralAsset?.symbol,
      },
      {
        title: this.$t("form.info.available-to-generate"),
        value: maxDebtAvailebleText,
        valueUnit: this.debtAsset?.symbol,
      },
      {
        title: this.$t("form.info.stability-fee"),
        value: this.meta.stabilityFee,
        valueUnit: "%",
        hint: this.$t("form.tooltip.stability-fee"),
      },
      {
        title: this.$t("form.info.liquidation-penalty"),
        value: this.meta.liquidationPenalty,
        valueUnit: "%",
      },
    ];
  }

  get actionButtons() {
    return [
      {
        text: this.$t("button.deposit"),
        icon: "$iconDeposit",
        size: "22",
        color: "primary",
        onClick: (id) => {
          this.$router.push(`/vault/deposit?id=${id}`);
        },
      },
      {
        text: this.$t("button.withdraw"),
        icon: "$iconWithdraw",
        size: "22",
        color: this.meta?.collateralAmount === 0 ? "grey" : "primary",
        onClick: (id) => {
          if (this.meta?.collateralAmount === 0) return;
          this.$router.push(`/vault/withdraw?id=${id}`);
        },
      },
      {
        text: this.$t("button.generate"),
        icon: "$iconGenerate",
        size: "22",
        color: this.meta?.collateralAmount === 0 ? "grey" : "primary",
        onClick: (id) => {
          if (this.meta?.collateralAmount === 0) return;
          this.$router.push(`/vault/generate?id=${id}`);
        },
      },
      {
        text: this.$t("button.pay-back"),
        icon: "$iconPayback",
        size: "22",
        color: this.meta?.debtAmount === 0 ? "grey" : "primary",
        onClick: (id) => {
          if (this.meta?.debtAmount === 0) return;
          this.$router.push(`/vault/payback?id=${id}`);
        },
      },
    ];
  }

  mounted() {
    this.requestTx();
  }

  async requestTx() {
    if (this.loading || !this.has_next) {
      return;
    }
    this.loading = true;
    try {
      const res = await this.$http.getVaultEvents({
        id: this.vaultId,
        limit: 20,
        cursor: this.cursor,
      });
      const transactions = res?.data?.events || [];
      this.histories = [...this.histories, ...transactions];
      this.has_next = res?.data?.pagination?.has_next || false;
      this.cursor = res?.data?.pagination?.next_cursor || null;
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
    this.loading = false;
  }

  handleActionClick({ onClick }) {
    onClick(this.vaultId);
  }
}
</script>

<style lang="scss" scoped>
.fixed-bottom {
  box-shadow: 0 0 0;
}
.z-index-2 {
  z-index: 2;
}
</style>
