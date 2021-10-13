<template>
  <v-container>
    <f-loading fullscreen loading>
      <template #text>
        {{ $t("common.login") }}
      </template>
    </f-loading>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";

@Component
class AuthPage extends Mixins(mixins.page) {
  get title() {
    return this.$t("common.login") as string;
  }

  get appbar() {
    return {
      show: false,
    };
  }

  get code() {
    return this.$route.query.code as string;
  }

  async mounted() {
    try {
      await this.$store.dispatch("auth/login", this.code);
      const authPath = localStorage.getItem("authPath");

      if (authPath) {
        window.location.replace(authPath);
      } else {
        this.$router.push({ name: "index" });
      }
    } catch (error) {
      this.$utils.helper.errorHandler(this, error as any);
      this.$router.push({ name: "index" });
    }
  }
}
export default AuthPage;
</script>
