<template>
  <v-container class="pa-0"> me </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";

@Component({
  components: {},
})
export default class Me extends Mixins(mixins.page) {
  loading = true;
  get title() {
    const s = this.$t("tab.me");
    return `${s}`;
  }

  get appbar() {
    return {
      back: false,
    };
  }

  get bottomNav() {
    return "me";
  }

  mounted() {
    this.checkLogin();
    try {
      // this.refreshData();
    } catch (e) {
      this.loading = false;
    } finally {
      this.loading = false;
    }
  }

  checkLogin() {
    // if (!this.isLogged) {
    //   this.$utils.helper.requestLogin(this);
    // } else {
    // }
  }

  handleLogin() {
    this.$utils.helper.requestLogin(this);
  }
}
</script>

<style></style>
