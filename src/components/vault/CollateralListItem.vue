<template>
  <v-list-item class="collateral">
    <v-layout column class="mx-0 greyscale_6 rounded">
      <v-layout justify-space-between class="ma-6">
        <v-layout align-center>
          <base-pair-logo :base="meta.gemLogo" :quote="meta.daiLogo" />

          <span class="ml-3 font-weight-semibold"> {{ meta.name }}</span>
        </v-layout>

        <f-button
          fab
          @click="$emit('add')"
          class="greyscale_1 greyscale_7--text xx-small"
        >
          <v-icon color="greyscale_7" size="16">$FIconAdd4P</v-icon>
        </f-button>
      </v-layout>

      <market-item-infos
        :collateral="collateral"
        :expand.sync="expand"
        :disabled="false"
        :newVaultSorted="true"
        expand-count="3"
      />
    </v-layout>
  </v-list-item>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import MarketItemInfos from "@/components/market/MarketItemInfos.vue";
import { Get } from "vuex-pathify";

@Component({
  components: {
    MarketItemInfos,
  },
})
class ActionCreateListItem extends Vue {
  @Prop() collateral!: API.Collateral;

  @Get("asset/getAssetById") getAssetById!: State.GetAssetById;

  expand = false;

  get meta() {
    const toPercent = this.$utils.number.toPercent;
    const collateral = this.collateral;
    const gem = this.getAssetById(collateral.gem);
    const dai = this.getAssetById(collateral.dai);
    const duty = toPercent({ n: Number(collateral.duty) - 1 });
    const mat = toPercent({ n: Number(collateral.mat) });
    const chop = toPercent({ n: Number(collateral.chop) - 1 });

    return {
      gemLogo: gem?.logo ?? "",
      daiLogo: dai?.logo ?? "",
      duty,
      mat,
      chop,
    };
  }
}
export default ActionCreateListItem;
</script>

<style lang="scss" scoped>
.xx-small {
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.collateral {
  margin-top: 18px;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 18px;
  }
}
</style>
