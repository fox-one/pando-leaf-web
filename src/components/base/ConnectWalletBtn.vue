<template>
  <div>
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
    <slot v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component
export default class ConnectWalletBtn extends Vue {
  @Getter("auth/isLogged") isLogged!: boolean;

  handleLogin() {
    this.$utils.helper.requestLogin(this);
  }
}
</script>

<style></style>
