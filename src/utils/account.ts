export async function sync(vm: Vue) {
  try {
    const tokenLocale = vm.$store.state.auth.token;
    const channelLocale = vm.$store.state.auth.channel;
    const mixinTokenLocale = vm.$store.state.auth.mixin_token;

    if (!channelLocale) {
      logout(vm);

      return;
    }

    const auth = await vm.$passport.sync({
      channel: channelLocale,
      token: tokenLocale,
      mixin_token: mixinTokenLocale,
    });

    vm.$store.commit("auth/SET_OAUTH_INFO", auth);
  } catch (error) {
    vm.$utils.helper.errorHandler(vm, error);
    logout(vm);
  }
}
export async function logout(vm: any) {
  return Promise.all([
    vm.$store.commit("auth/CLEAR"),
    vm.$store.commit("account/CLEAR"),
    vm.$store.dispatch("vault/clear"),
    vm.$store.dispatch("asset/clear"),
  ]);
}

export function requestLogout(vm: Vue, cbs: { onDisconnect?: any }) {
  vm.$uikit.dialog.show({
    title: vm.$t("common.confirm") as string,
    text: vm.$t("disconnect.confrirm") as string,
    type: "warning",
    confirm: {
      text: vm.$t("disconnect") as string,
      callback: () => {
        vm.$utils.account.logout(vm);

        cbs?.onDisconnect?.();
      },
    },
  });
}

export async function openAuth(vm: Vue) {
  try {
    const { channel, token } = await vm.$passport.auth();

    vm.$store.commit("auth/SET_OAUTH_INFO", { token, channel });

    await vm.$utils.app.loadAccountData(vm);
  } catch (error: any) {
    vm.$uikit.toast.error({ message: error.message });
  }
}
