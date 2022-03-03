<template>
  <v-container class="pa-4">
    <pando-lots
      dev
      group-id="7000103413"
      theme-color="#88E108"
      @error="handleLotsErr"
    />
    <br />
    <br />
    <pando-lots
      dev
      group-id="7000104299"
      theme-color="#EE4596"
      @error="handleLotsErr"
    />
    <br />
    <br />
    <pando-lots
      group-id="7000103191"
      theme-color="#9e9d24"
      @error="handleLotsErr"
    />
    <br />
    <br />
    <pando-lots
      group-id="7000103488"
      theme-color="#00ceb7"
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
    <br />
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
