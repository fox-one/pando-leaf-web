<template>
  <pando-mvm-action
    v-if="show"
    color="#89df0f"
    border-color="#89df0f"
    @add-to-wallet="handleAddAsset"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class MvmAction extends Vue {
  @Prop() asset;

  get show() {
    const channel = this.$store.state.auth.channel;

    return channel === "metamask" || channel === "walletconnect";
  }

  handleAddAsset() {
    const asset = this.asset;

    this.$passport.helper.watchAsset({
      assetId: asset?.id,
      image: asset.logo,
      symbol: asset.symbol,
    });
  }
}
export default MvmAction;
</script>
