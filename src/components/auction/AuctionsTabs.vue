<template>
  <f-tabs v-model="tabIndex" fixed-tabs disable-slider-length :slider-size="2">
    <v-tab
      v-for="(item, index) in tabs"
      :key="index"
      :data-value="index"
      :ripple="false"
    >
      <h3 class="tab-text">{{ item.text }}</h3>
    </v-tab>
  </f-tabs>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Sync } from "vuex-pathify";

@Component
export default class AuctionsTabs extends Vue {
  @Sync("page/auction@tabIndex") tabIndex!: number;

  get tabs() {
    return [
      {
        text: this.$t("common.ongoing"),
      },
      {
        text: this.$t("auction.done"),
      },
    ];
  }
}
</script>

<style lang="scss" scoped>
.tab-text {
  font-size: 16px !important;
}
</style>
