<template>
  <div>
    <slot v-if="!isLogged" name="action" :on="{ click: handleOpenAuth }">
      <f-button color="primary" @click="handleOpenAuth">
        {{ $t("connect.wallet") }}
      </f-button>
    </slot>

    <slot v-else></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Get } from "vuex-pathify";

@Component
export default class ConnectWalletBtn extends Vue {
  @Get("auth/isLogged") isLogged!: boolean;

  handleOpenAuth() {
    this.$utils.account.openAuth(this);
  }
}
</script>

<style></style>
