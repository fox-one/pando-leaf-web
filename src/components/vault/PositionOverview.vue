<template>
  <v-sheet dark class="overview rounded">
    <v-row no-gutters class="py-4">
      <v-col cols="6">
        <div class="label-text f-caption mb-4 greyscale_3--text">
          {{ $t("common.total-debt") }}
        </div>

        <div class="total-text mb-2">
          <span class="symbol">US$</span>
          <span>{{ meta.debts }}</span>
        </div>
      </v-col>

      <v-col cols="6">
        <div class="label-text f-caption mb-4 greyscale_3--text">
          {{ $t("me.total-collaterals") }}
        </div>

        <div class="total-text mb-2">
          <span class="symbol">US$</span>
          <span>{{ meta.collaterals }}</span>
        </div>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getVaultFields } from "@/utils/vault";
import { Get } from "vuex-pathify";

@Component({
  components: {},
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
  text-align: center;
  position: relative;
  height: 100%;
  background: linear-gradient(180deg, #272727 0%, #373737 100%) !important;

  .label-text {
    font-weight: 500;
  }

  .total-text {
    font-size: 25px;
    font-weight: 700;
  }

  .symbol {
    font-size: 16px;
    vertical-align: baseline;
    letter-spacing: 0.011em;
    line-height: 19px;
  }
}
</style>
