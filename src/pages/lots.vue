<template>
  <v-container class="pa-4">
    <pando-lots dev group-id="7000103413" theme-color="#88E108" />
    <br />
    <br />
    <br />
    <pando-lots dev type="button" group-id="7000104299" theme-color="#EE4596" />
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
}
export default Contacts;
</script>
