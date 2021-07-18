<template>
  <v-layout align-center justify-center column class="">
    <div class="greyscale_1--text body-2 mb-8">
      {{ $t("connect.wallet.hint") }}
    </div>
    <base-connect-wallet-btn rounded large depressed color="primary">
      {{ $t("connect.wallet") }}
    </base-connect-wallet-btn>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class LoginPlaceHolder extends Vue {}
export default LoginPlaceHolder;
</script>
