<template>
  <v-card elevation="0" class="ma-4 pa-0 rounded-lg greyscale_6">
    <market-item-title :collateral="collateral" :show-button="showButton" />

    <market-item-infos
      :collateral="collateral"
      :expand.sync="expand"
      :disabled="disabled"
    />
  </v-card>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import MarketItemTitle from "./MarketItemTitle.vue";
import MarketItemInfos from "./MarketItemInfos.vue";

@Component({
  components: {
    MarketItemTitle,
    MarketItemInfos,
  },
})
export default class MarketItem extends Vue {
  @Prop() collateral!: API.Collateral;

  @Prop({ default: true }) showButton!: boolean;

  @Prop({ default: false }) disabled!: boolean;

  expand = false;
}
</script>

<style lang="scss" scoped>
.market-green {
  color: #47bd61;
}
</style>
