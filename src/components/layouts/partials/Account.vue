<template>
  <f-bottom-sheet
    v-model="dialog"
    hide-close-icon
    min-width="500"
    z-index="111"
    wapper-in-desktop="dialog"
    content-class="f-bottom-sheet--no-padding"
  >
    <template #activator="{ on }">
      <pando-account-avatar
        :logged="logged"
        :name="meta.name"
        :avatar="meta.avatar"
        @click.native="on.click"
      />
    </template>

    <pando-account-overview
      :balance="meta.balance"
      :logged="logged"
      :name="$t('channel.name')"
      :version="VERSION"
      @close="handleClose"
      @connect="handleConnect"
      @disconnect="handleDisconnect"
    >
      <template #actions>
        <account-actions />
      </template>
    </pando-account-overview>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Get } from "vuex-pathify";
import { VERSION } from "@/constants";
import AccountActions from "./AccountActions.vue";

@Component({
  components: {
    AccountActions,
  },
})
class Account extends Vue {
  @Get("account") account!: State.Account;

  @Get("auth/isLogged") logged!: boolean;

  dialog = false;

  VERSION = VERSION;

  get meta() {
    const toFiat = this.$utils.number.toFiat;
    const { profile } = this.account;

    const getters = this.$store.getters as Getter.GettersTree;
    const balance = getters["asset/walletBalance"];

    return {
      avatar: profile?.avatar_url,
      name: profile?.full_name,
      balance: toFiat(this, { n: balance }),
    };
  }

  handleClose() {
    this.dialog = false;
  }

  handleConnect() {
    this.dialog = false;

    this.$utils.account.openAuth(this);
  }

  handleDisconnect() {
    this.$utils.account.requestLogout(this, {
      onDisconnect: () => {
        this.dialog = false;
      },
    });
  }
}
export default Account;
</script>
