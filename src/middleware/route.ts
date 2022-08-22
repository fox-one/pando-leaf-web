import type { Middleware } from "@nuxt/types";

const auth: Middleware = function ({ route, redirect }) {
  const current = route.name;

  if (!current || current === "index") {
    redirect({ name: "market" });
    return;
  }
};

export default auth;
