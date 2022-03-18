<template>
  <f-tabs
    :value="value"
    @change="handleChange"
    fixed-tabs
    disable-slider-length
    :slider-size="2"
  >
    <v-tab
      v-for="(item, index) in tabs"
      :key="index"
      :data-value="index"
      :ripple="false"
    >
      <span>{{ item.text }}</span>
    </v-tab>
  </f-tabs>
</template>

<script lang="ts">
import { Component, Vue, Model } from "vue-property-decorator";

@Component
export default class AuctionsTabs extends Vue {
  @Model("change") value!: number;

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

  handleChange(value) {
    this.$emit("change", value);
  }
}
</script>
