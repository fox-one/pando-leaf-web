<template>
  <f-app-bar :show="appbar.show" app custom-content class="appbar--no-shadow">
    <v-layout justify-center align-center class="appbar--home">
      <div class="account">
        <account />
      </div>

      <products-link />
    </v-layout>
  </f-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ProductsLink from "../partials/ProductsLink.vue";
import Account from "../partials/Account.vue";

@Component({
  components: { Account, ProductsLink },
})
class AppBarHome extends Vue {
  get appbar() {
    const appbar = this.$store.state.app.appbar;

    return {
      show: appbar.show,
    };
  }
}
export default AppBarHome;
</script>

<style lang="scss" scoped>
.appbar--no-shadow {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0) !important;
}
.appbar--home {
  position: relative;

  .account {
    position: absolute;
    left: 0;
  }
}
</style>
