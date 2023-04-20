import Vue from "vue";
import UIKit from "@foxone/uikit";

import PandoUI from "@foxone/pando-ui";
import Passport from "@foxone/mixin-passport";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import "dayjs/locale/zh";

import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  LegendPlainComponent,
  AxisPointerComponent,
} from "echarts/components";
import { use } from "echarts/core";
import { CONFIG } from "@/constants";

import infiniteScroll from "vue-infinite-scroll";
import { AuthMethod } from "@/enums";

import "@foxone/uikit/build/index.min.css";
import "@foxone/pando-ui/build/index.css";

import "../components/icons";

import type { Plugin } from "@nuxt/types";

dayjs.extend(relativeTime);
dayjs.extend(duration);

const plugin: Plugin = ({ app, store }) => {
  Vue.use(UIKit, {
    vuetify: app.vuetify,
    toast: {
      top: false,
      centered: true,
    },
    dialog: { flat: true },
    auth: {
      wallets: ["fennec", "mixin", "metamask", "walletconnect"],
      clientId: CONFIG.MIXIN_CLIENT_ID,
      scope: "PROFILE:READ ASSETS:READ",
      pkce: true,
    },
  });

  Vue.use(Passport, {
    origin: "Pando Leaf",
    config: { infuraId: "a018fa2f735a435f9a7917f0d429c61a" },
    JWTPayload: { from: "pando-leaf" },
    chainId: 73927,
    customizeToken: true,
    signMessage: true,
    hooks: {
      beforeSignMessage: async () => {
        return {
          chainId: 73927,
          statement: `You'll login to Pando Leaf by the signature`,
          issuedAt: dayjs().format(),
          expirationTime: dayjs(
            new Date(new Date().getTime() + 1000 * 60 * 3)
          ).format(),
        };
      },
      onDisconnect: () => {
        app.$utils.account.logout({ $store: app.store });
      },
      onDistributeToken: async (params) => {
        let data: API.AuthParams;

        if (params.type === "mixin_token") {
          data = { method: AuthMethod.MixinToken, mixin_token: params.token };
          store.commit("auth/SET_MIXIN_TOKEN", params.token);
        } else {
          data = {
            method: AuthMethod.MVM,
            mvm_signed_message: params.message,
            mvm_signature: params.signature,
          };
        }

        const { pando_token, id, avatar, name } = await app.$http.auth(data);

        store.commit("account/SET_PROFILE", {
          user_id: id,
          avatar_url: avatar,
          full_name: name,
        });

        return { token: pando_token };
      },
    },
  });

  Vue.use(PandoUI, app.vuetify);
  Vue.use(infiniteScroll);

  use([
    CanvasRenderer,
    LineChart,
    BarChart,
    GridComponent,
    TooltipComponent,
    LegendPlainComponent,
    VisualMapComponent,
    AxisPointerComponent,
  ]);
};

export default plugin;
