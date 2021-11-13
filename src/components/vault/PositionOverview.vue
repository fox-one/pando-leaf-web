<template>
  <v-sheet
    dark
    class="overview rounded pa-6 pa-md-12 pr-0"
    :class="[{ background: !composition }]"
  >
    <div class="switcher hidden-md-and-up mr-4">
      <overview-switch v-model="composition" />
    </div>

    <div class="body-2 mb-2">
      {{ $t("me.total-collaterals") }}
    </div>
    <div class="total-text">
      <span class="symbol bright_green--text">$</span>
      <span>{{ meta.collaterals }}</span>
    </div>

    <v-expand-transition>
      <vault-position-ratio v-show="composition" />
    </v-expand-transition>

    <div class="body-2 mb-2 mt-6 mt-md-12">
      {{ $t("common.total-debt") }}
    </div>
    <div class="total-text">
      <span class="symbol bright_green--text">$</span>
      <span>{{ meta.debts }}</span>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VaultPositionRatio from "./VaultPositionRatio.vue";
import OverviewSwitch from "./OverviewSwitch.vue";
import { getVaultFields } from "@/utils/vault";
import { Get } from "vuex-pathify";

@Component({
  components: {
    VaultPositionRatio,
    OverviewSwitch,
  },
})
class PositionOverview extends Vue {
  @Get("vault/vaults") vaults!: API.Vault[];

  composition = false;

  get meta() {
    const vaults = this.vaults;
    const format = this.$utils.number.format;

    const total = vaults.reduce(
      (acc, vault) => {
        const fields = getVaultFields(this, vault.id);

        return {
          collaterals: acc.collaterals + fields.collateralAmountUSD,
          debts: acc.debts + fields.debtAmountUSD,
        };
      },
      {
        collaterals: 0,
        debts: 0,
      }
    );

    return {
      collaterals: format({ n: total.collaterals, dp: 2, fixed: true }),
      debts: format({ n: total.debts, dp: 2, fixed: true }),
    };
  }
}
export default PositionOverview;
</script>

<style lang="scss" scoped>
.overview {
  position: relative;
  height: 100%;
  background-color: linear-gradient(
    137.85deg,
    #323232 22.46%,
    #333333 86.42%
  ) !important;

  &.background {
    background-image: url("../../assets/images/bg_overview.svg");
    background-position: 100% 100%;
    background-size: 144px;
  }

  .switcher {
    position: absolute;
    right: 0;
  }

  .total-text {
    font-size: 25px;
    font-weight: 700;
  }

  .symbol {
    font-size: 14px;
    vertical-align: text-top;
    line-height: 25px;
  }
}
</style>
