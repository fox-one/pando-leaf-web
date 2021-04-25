import Vue from "vue";
import VueGtag from "vue-gtag";
import { GA, isProduct } from "@/constants";

export default ({ app }) => {
  Vue.use(
    VueGtag,
    {
      config: { id: isProduct ? GA : "" },
    },
    app.router
  );
};
