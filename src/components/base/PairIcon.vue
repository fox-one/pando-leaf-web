<template>
  <div class="pair-icon">
    <img :src="baseAsset.icon" />
    <img :src="quoteAsset.icon" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IAsset } from "~/services/types/vo";

@Component
class PairIcon extends Vue {
  @Prop() baseAsset!: IAsset;

  @Prop() quoteAsset!: IAsset;
}
export default PairIcon;
</script>
