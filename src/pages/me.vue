<template>
  <v-layout column fill-height class="pa-0">
    <v-btn
      v-if="!isLogged"
      rounded
      large
      block
      depressed
      color="primary"
      @click="handleLogin"
    >
      {{ $t("connect.wallet") }}
    </v-btn>
    <v-layout v-if="isLogged" column class="pa-4 f-bg-greyscale-7">
      <div class="f-caption f-greyscale-3">Total Vault Balance</div>
      <h2>$0.0</h2>
    </v-layout>

    <v-container v-if="isLogged && !haveVault" fill-height>
      <v-layout column align-center justify-center>
        <h3 class="f-greyscale-2">You haven't any Vault yet.</h3>
        <p class="mx-4 mt-2 text-center">
          Open your first Vault to start generating Pando Assets.
        </p>
        <v-btn
          class="mt-4"
          color="primary"
          @click="generateVault"
          :min-width="220"
          rounded
          depressed
        >
          <span>Open a new Vault</span>
        </v-btn>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import { Getter } from "vuex-class";

@Component({
  components: {},
})
export default class Me extends Mixins(mixins.page) {
  @Getter("auth/isLogged") isLogged;

  loading = true;
  haveVault = false;
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
    if (!this.isLogged) {
      this.$utils.helper.requestLogin(this);
    } else {
    }
  }

  handleLogin() {
    this.$utils.helper.requestLogin(this);
  }

  generateVault() {
    this.$router.push("/market");
  }
}
</script>

<style></style>
