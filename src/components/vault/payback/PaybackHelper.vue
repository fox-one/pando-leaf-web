<template>
  <div class="infomation-item">
    <v-layout class="py-3" column>
      <v-layout align-center>
        <div class="greyscale_3--text mr-1">{{ meta.label }}</div>

        <v-spacer />

        <div
          class="greyscale_1--text d-flex align-center"
          @click.stop="handleClick"
        >
          <span class="mr-1"> {{ meta.debtText }} {{ meta.debtSymbol }} </span>

          <v-icon size="12"> $FIconUpRight3PFill </v-icon>
        </div>
      </v-layout>

      <v-layout
        class="mt-2 greyscale_3--text"
        v-if="meta.showChange"
        justify-end
        align-center
      >
        <v-icon class="mr-1" color="greyscale_3" size="12">
          $iconUpdateRight
        </v-icon>

        <span> {{ meta.changedValue }} {{ meta.debtSymbol }} </span>
      </v-layout>
    </v-layout>
  </div>
</template>

<script lang="ts">
import BigNumber from "bignumber.js";
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";

@Component
export default class extends Vue {
  @Prop() vault!: API.Vault;

  @PropSync("amount") bindAmount!: string;

  get meta() {
    const { toPrecision } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;
    const { debtAmount, debtSymbol, debtAsset } = getters.getVaultFields(
      this.vault?.id
    );
    const walletAsset = getters["asset/getWalletAssetById"](
      debtAsset?.id ?? ""
    );
    let changed = debtAmount - +this.bindAmount;
    if (changed <= 0) changed = 0;

    const balance = walletAsset?.balance ?? "0";
    const notEnough = +balance < debtAmount;

    return {
      showChange: !!this.bindAmount,
      debtText: toPrecision({ n: debtAmount, dp: 8, mode: BigNumber.ROUND_UP }),
      changedValue: toPrecision({
        n: changed,
        dp: 8,
      }),
      balance,
      debtSymbol,
      label: this.$t("common.outstanding-debt"),
      notEnough,
    };
  }

  handleClick() {
    if (this.meta.notEnough) {
      this.bindAmount = this.meta.balance;
      this.$uikit.toast.warning({
        message: this.$t("notice.not-enough-balance") + "",
      });
    } else {
      this.bindAmount = this.meta.debtText;
    }
  }
}
</script>

<style lang="scss" scoped>
.infomation-item {
  font-weight: 500;
  font-size: 13px;
}
</style>
