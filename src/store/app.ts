import { MutationTree, GetterTree, ActionTree } from "vuex";
import { SOCKET_STATE } from "~/types";
import { isDarkTheme } from "~/utils/helper";

const state = () => ({
  appbar: {
    title: "",
    style: "",
    show: true,
    back: false,
    flat: true,
    avatar: false,
  },
  settings: {
    dark: isDarkTheme(),
  },
  bottomNav: {
    value: "",
    animation: true,
  },
  toast: {
    show: false,
    color: "info",
    message: "",
  },
  paying: {
    visible: false,
    timer: null,
  },
  websocket: {
    state: SOCKET_STATE.CLOSED,
  },
  payment: {
    url: "",
    visible: false,
  },
  notShowDevAlertAgain: false,
});

export const mutations = {
  SET_TOAST(state, { message = "", color = "info", show = true }) {
    state.toast.show = show;
    state.toast.message = message;
    state.toast.color = color;
  },
  SET_PAYING(state, data) {
    state.paying = { ...state.paying, ...data };
    if (data.visible === false) {
      clearTimeout(state.paying.timer as any);
    }
  },
  SET_PAYMENT_URL(state, { visible = false, paymentUrl = "" }) {
    state.payment.visible = visible;
    state.payment.url = paymentUrl;
  },
  SET_APPBAR(state, value) {
    const defaultValue = {
      title: "",
      style: "",
      show: true,
      back: true,
      flat: true,
      avatar: false,
    };
    state.appbar = { ...defaultValue, ...value };
  },
  SET_WS_STATE(state, value) {
    state.websocket.state = value;
  },
  SET_BOTTOM_NAV(state, value) {
    state.bottomNav.value = value;
  },
};

export default {
  state,
  mutations,
};
