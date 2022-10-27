import type { Middleware } from "@nuxt/types";

const auth: Middleware = function ({ store, route, redirect }) {
  const current = route.name;

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
