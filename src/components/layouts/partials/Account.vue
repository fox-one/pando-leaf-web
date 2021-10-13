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
  @Get("account") account!: State.Account;

  @Get("auth/isLogged") isLogged!: boolean;

  get meta() {
    const { profile } = this.account;

    return {
      avatar: profile?.avatar_url,
      name: profile?.full_name,
    };
  }
}
export default Account;
</script>
