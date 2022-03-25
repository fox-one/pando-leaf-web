<template>
  <f-auth-method-modal
    ref="authModal"
    :fennec="fennec"
    :client-id="meta.clientId"
    :scope="meta.scope"
    :title="$t('connect.wallet')"
    @auth="handleLogin"
    @error="handleError"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CONFIG, EVENTS } from "@/constants";

@Component
class AuthModal extends Vue {
  fennec = false;

  get meta() {
    return {
      clientId: CONFIG.MIXIN_CLIENT_ID,
      scope: "PROFILE:READ ASSETS:READ",
    };
  }

  mounted() {
    setTimeout(() => {
      this.fennec = this.$fennec?.isAvailable() ?? false;
    }, 200);

    this.$root.$on(EVENTS.OPEN_AUTH, () => {
      const authModal = this.$refs.authModal as any;

      authModal?.onClick();
    });
  }

  handleError(error) {
    this.$utils.helper.errorHandler(this, {
      message: error?.description ?? "",
    });
  }

  handleLogin({ type, code }) {
    if (type === "mixin") {
      this.$utils.account.authMixin(this, code);
    } else {
      this.$utils.account.authFennec(this);
    }
  }
}
export default AuthModal;
</script>
