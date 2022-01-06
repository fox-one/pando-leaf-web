<template>
  <f-tabs
    v-model="tabIndex"
    borderless
    mandatory
    fixed-tabs
    disableSliderLength
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
import { Component, Vue } from "vue-property-decorator";
import { Sync } from "vuex-pathify";

@Component
class DetailTabs extends Vue {
  @Sync("page/detail@tabIndex") tabIndex!: number;

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
}
export default DetailTabs;
</script>
