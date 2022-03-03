<template>
  <v-container class="pa-4">
    <pando-lots
      group-id="7000103413"
      theme-color="#88E108"
      api-base="https://dev-courses-api.firesbox.com/v1"
      ws-base="wss://dev-courses-ws.firesbox.com"
      @error="handleLotsErr"
    />
    <br />
    <br />
    <pando-lots
      type="button"
      group-id="7000104299"
      theme-color="#EE4596"
      api-base="https://dev-courses-api.firesbox.com/v1"
      ws-base="wss://dev-courses-ws.firesbox.com"
      @error="handleLotsErr"
    />
    <br />
    <br />
    <pando-lots
      group-id="7000103488"
      theme-color="#00ceb7"
      api-base="https://supergroup-api.mixin.fan/v1"
      ws-base="wss://supergroup-ws.mixin.fan"
      @error="handleLotsErr"
    />

    <br />
    <br />
    <pando-lots
      type="button"
      group-id="7000103191"
      theme-color="#9e9d24"
      api-base="https://xuexi-courses-api.firesbox.com/v1"
      ws-base="wss://xuexi-courses-ws.firesbox.com"
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
