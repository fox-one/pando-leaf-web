<template>
  <v-container class="pa-4">
    <pando-lots
      dev
      group-id="7000103413"
      theme-color="#88E108"
      @error="handleLotsErr"
    />
    <pando-lots
      dev
      group-id="7000104299"
      theme-color="#EE4596"
      @error="handleLotsErr"
    />
    <br />
    <br />
    <br />
    <pando-lots
      dev
      type="button"
      group-id="7000103413"
      theme-color="#88E108"
      @error="handleLotsErr"
    />
    <pando-lots
      dev
      type="button"
      group-id="7000104299"
      theme-color="#EE4596"
      @error="handleLotsErr"
    />
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";

@Component
class Contacts extends Mixins(mixins.page) {
  get title() {
    return "Pando Lots";
  }

  handleLotsErr(e: any) {
    this.$utils.helper.errorHandler(this, e);
  }
}
export default Contacts;
</script>
