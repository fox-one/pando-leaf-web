<template>
  <div style="text-align: center">
    <v-btn
      rounded
      depressed
      color="primary"
      style="height: 48px"
      class="mt-5 px-14 f-title-2"
      @click="handleLogin"
    >
      {{ $t("connect.wallet") }}
    </v-btn>
    <f-bottom-sheet v-model="show">
      <template #title>{{ $t("connect.wallet") }}</template>
      <!--
        in Mixin Messenger?
          -> invoke requestLogin()
        else
          fennec detected?
            -> show fennec connect button
            -> show others wallets except fennec
          else
            -> show mixin connect button
            -> show other wallets
      -->
      <div>
        <div class="text-center mb-8">
          <div v-if="isFennecDetected">
            <div class="f-body-2 mb-2">
              {{ $t("connect.fennec.detected") }}
            </div>
            <f-button
              type="primary"
              class="connect-button mb-4"
              @click="authFennec"
              >{{ $t("connect.fennec") }}</f-button
            >
            <f-button type="subtitle" class="connect-button" @click="auth">{{
              $t("connect.others")
            }}</f-button>
          </div>
          <div v-else>
            <div class="f-body-2 mb-2">
              {{ $t("connect.wallets.hint") }}
            </div>
            <f-button type="primary" class="connect-button" @click="auth">{{
              $t("connect.wallets")
            }}</f-button>
          </div>
        </div>
        <div class="f-body-2 text-center px-4">
          {{ $t("install.wallets.hint") }}
        </div>
        <div>
          <f-list-item
            class="item"
            v-for="item in apporaches"
            :key="item.name"
            :title="item.title"
            :subtitle="item.subtitle"
          >
            <template #head>
              <v-avatar>
                <v-img :src="item.icon"></v-img>
              </v-avatar>
            </template>
            <template #tail>
              <f-button type="subtitle" @click="install(item)" class="button">{{
                $t("install")
              }}</f-button>
            </template>
          </f-list-item>
        </div>
      </div>
    </f-bottom-sheet>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class ConnectWalletBtn extends Vue {
  show = false;

  get apporaches() {
    const ret = [
      {
        name: "mixin-messenger",
        icon: require("@/assets/images/wallet_mm.png"),
        title: "Mixin Messenger",
        subtitle: this.$t("wallet.category.mobile"),
        download_url: "https://mixin.one/messenger",
      },
    ];
    if (this.$i18n.locale.includes("ja")) {
      ret.push({
        name: "links",
        icon: require("@/assets/images/wallet_links.png"),
        title: "Links",
        subtitle: this.$t("wallet.category.mobile"),
        download_url: "https://getlinks.jp",
      });
    }
    if (!this.isFennecDetected) {
      ret.push({
        name: "fennec",
        icon: require("@/assets/images/wallet_fennec.png"),
        title: "Fennec",
        subtitle: this.$t("wallet.category.browser"),
        download_url: "https://github.com/fox-one/fennec",
      });
    }
    if (this.$utils.helper.isDesktop()) {
      ret.reverse();
    }
    return ret;
  }

  get isFennecDetected() {
    return this.$fennec.installed;
  }

  handleLogin() {
    if (this.$utils.helper.isMixin()) {
      this.$utils.helper.requestLogin(this);
    } else {
      this.show = true;
    }
  }

  async authFennec() {
    if (this.isFennecDetected) {
      await this.$fennec.connect("4swap");
      await this.$utils.helper.loadWalletAssets(this);
      this.show = false;
      this.$store.dispatch("global/getMe");
    } else {
      this.$utils.helper.requestLogin(this);
    }
  }

  async auth() {
    this.$utils.helper.requestLogin(this);
  }

  install(item) {
    window.location.href = item.download_url;
  }
}
export default ConnectWalletBtn;
</script>
<style lang="scss" scoped>
.f-button.button {
  padding-left: 20px !important;
  padding-right: 20px !important;
}
.connect-button {
  width: 80vw;
}
</style>
