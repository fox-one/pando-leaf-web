<template>
  <v-list-item class="collateral">
    <v-layout column class="mx-0 greyscale_6 rounded">
      <v-layout justify-space-between class="ma-6">
        <v-layout align-center>
          <base-pair-logo :base="meta.gemLogo" :quote="meta.daiLogo" />
          <span class="subtitle-1 font-weight-bold ml-2">
            {{ collateral.name }}
          </span>
        </v-layout>

        <v-btn depressed small fab color="primary">
          <v-icon @click="$emit('add')" color="greyscale_7"> $FIconAdd </v-icon>
        </v-btn>
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
