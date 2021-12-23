<template>
  <f-tabs
    borderless
    mandatory
    fixed-tabs
    :value="value"
    disableSliderLength
    @change="handleChange"
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
class DetailTabs extends Vue {
  @Model("change") value!: number;

  get tabs() {
    return [
      {
        text: this.$t("tab.details"),
      },
      {
        text: this.$t("tab.market"),
      },
    ];
  }

  handleChange(value) {
    this.$emit("change", value);
  }
}
export default DetailTabs;
</script>
