<template>
  <base-user-avatar
    v-if="isLogged"
    :avatar="meta.avatar"
    :name="meta.name"
    color="primary"
    size="32"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Get } from "vuex-pathify";

@Component
class Account extends Vue {
  @Get("auth") auth!: State.Auth;

  @Get("auth/isLogged") isLogged!: boolean;

  get meta() {
    const { avatar, name } = this.auth;

    return {
      avatar,
      name,
    };
  }
}
export default Account;
</script>
