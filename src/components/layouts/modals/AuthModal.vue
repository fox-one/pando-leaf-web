<template>
  <f-auth-method-modal
    ref="authModal"
    :fennec="fennec"
    :title="$t('connect.wallet')"
    @auth="handleLogin"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { EVENTS } from "@/constants";

@Component
class AuthModal extends Vue {
  fennec = false;

  mounted() {
    setTimeout(() => {
      this.fennec = this.$fennec?.isAvailable() ?? false;
    }, 200);

    this.$root.$on(EVENTS.OPEN_AUTH, () => {
      const authModal = this.$refs.authModal as any;

      authModal?.onClick();
    });
  }

  handleLogin(value) {
    if (value === "mixin") {
      this.$utils.account.requestAuthMixin(this);
    } else {
      this.$utils.account.authFennec(this);
    }
  }
}
export default AuthModal;
</script>
