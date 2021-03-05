<template>
  <v-container class="pa-0"> market </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";

@Component({
  components: {},
})
export default class Market extends Mixins(mixins.page) {
  get title() {
    const s = this.$t("tab.market");
    return `${s}`;
  }

  get appbar() {
    return {
      back: false,
    };
  }

  get bottomNav() {
    return "market";
  }

  get meta() {
    return {
      totalSupply: "-",
      totalBorrow: "-",
      volume24hSupply: "-",
      volume24hBorrow: "-",
    };
  }
}
</script>

<style lang="scss" scoped>
.market-table-title {
  opacity: 0.5;
  font-weight: normal;
  font-style: normal;
}

.arrow-right {
  position: relative;
  float: right;
  right: 30px;
  transform: translateY(52px);
}
</style>
