<template>
  <v-card elevation="0" class="mx-4 pa-0 rounded-lg greyscale_6">
    <market-item-title class="pt-4" :collateral="collateral" />

    <market-item-infos :collateral="collateral" />

    <market-item-action class="mx-6 pb-6" :collateral="collateral" />
  </v-card>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import MarketItemTitle from "./MarketItemTitle.vue";
import MarketItemAction from "./MarketItemAction.vue";
import MarketItemInfos from "./MarketItemInfos.vue";

@Component({
  components: {
    MarketItemTitle,
    MarketItemAction,
    MarketItemInfos,
  },
})
export default class MarketItem extends Vue {
  @Prop() collateral!: API.Collateral;
}
</script>

<style lang="scss" scoped>
.market-green {
  color: #47bd61;
}
</style>
