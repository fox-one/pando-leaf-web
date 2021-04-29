import { NuxtAppOptions } from "@nuxt/types";

export default class Fennec {
  #ctx;

  #ext;

  #app: NuxtAppOptions;

  #token;

  installed = false;

  connected = false;

  constructor(app: NuxtAppOptions) {
    this.#app = app;
    const ext = (window as any).__MIXIN__?.mixin_ext;
    if (ext) {
      this.installed = true;
      this.#ext = ext;
    }
  }

  public available() {
    return this.installed;
  }

  public async connect(origin: string) {
    if (!this.#ext) {
      throw new Error("Browser Extension is not installed");
    }
    this.#ctx = await this.#ext.enable(origin);
    if (this.#ctx) {
      const token = await this.#ctx.wallet.signToken({
        payload: { from: origin },
      });
      this.#app.store?.commit("auth/SET_FENNEC_TOKEN", {
        token,
        scope: "PROFILE:READ ASSETS:READ",
      });
      console.log(token);
      this.#token = token;
      this.connected = true;
    }
  }

  checkCtx() {
    if (!this.#ctx) {
      throw new Error("Fennec context is not available");
    }
  }

  public getToken() {
    return this.#token;
  }

  public getAssets() {
    this.checkCtx();
    return this.#ctx.wallet.getAssets();
  }

  public getAsset(id: string) {
    this.checkCtx();
    return this.#ctx.wallet.getAsset(id);
  }

  public transfer(payload) {
    this.checkCtx();
    return this.#ctx.wallet.transfer(payload);
  }

  public multisigsPayment(payload) {
    this.checkCtx();
    return this.#ctx.wallet.multisigsPayment(payload);
  }
}
