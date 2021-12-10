<template>
  <div class="mx-4">
    <pando-social-links />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";

@Component
class Contacts extends Mixins(mixins.page) {
  get title() {
    return this.$t("contact.us");
  }
}
export default Contacts;
</script>
