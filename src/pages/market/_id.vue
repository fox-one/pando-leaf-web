<template>
  <v-container class="pa-0"> {{ assetId }} </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";

@Component({
  components: {},
})
export default class MarketDetail extends Mixins(mixins.page) {
  get appbar() {
    return {
      back: true,
    };
  }

  get assetId() {
    return this.$route.params["id"];
  }

  mounted() {
    console.log(this.assetId);
  }
}
</script>
<style lang="scss" scoped>

</style>
