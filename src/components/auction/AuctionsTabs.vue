<template>
  <f-segment-control :value="value" @change="handleChange">
    <f-button
      v-for="(item, index) in tabs"
      :key="index"
      :data-value="index"
      :ripple="false"
    >
      <span>{{ item.text }}</span>
    </f-button>
  </f-segment-control>
</template>

<script lang="ts">
import { Component, Vue, Model } from "vue-property-decorator";

@Component
export default class AuctionsTabs extends Vue {
  @Model("change") value!: number;

  get tabs() {
    return [
      {
        text: this.$t("auction.list.tab.at-auction"),
      },
      {
        text: this.$t("auction.list.tab.done"),
      },
    ];
  }

  handleChange(value) {
    this.$emit("change", value);
  }
}
</script>
