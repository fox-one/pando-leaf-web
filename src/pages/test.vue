<template>
  <v-container class="pa-0">
    <f-input v-model="progress" />
    <v-layout justify-center class="mt-6 mb-4 px-5">
      <base-risk-slider :progress="progress" />
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import BaseRiskSlider from "@/components/base/RiskSlider.vue";

@Component({
  components: {
    BaseRiskSlider,
  },
})
export default class TestPage extends Mixins(mixins.page) {
  progress = 0;

  get appbar() {
    return {
      style: "home" as const,
    };
  }
}
</script>
