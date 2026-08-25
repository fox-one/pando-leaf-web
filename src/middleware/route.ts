import type { Middleware } from "@nuxt/types";
import { ProtocolWindDown } from "~/constants";

const auth: Middleware = function ({ store, route, redirect }) {
  const current = route.name;

  if (ProtocolWindDown) {
    if (current === "vault-open") {
      redirect({ name: "vault" });
      return;
    }

    if (current === "vault-generate" || current === "vault-deposit") {
      redirect({
        name: "vault-detail",
        query: { id: route.query.id },
      });
      return;
    }
  }

  if (!current || current === "index") {
    if (store.getters["auth/isLogged"]) {
      redirect({ name: "vault" });
      return;
    }
    redirect({ name: "market" });
    return;
  }
};

export default auth;
