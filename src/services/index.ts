import Http from "./http";
import { AxiosRequestConfig } from "axios";
import { MIXIN_HOST } from "@/constants";

export default function (http: Http) {
  return {
    auth(code: string): Promise<API.AuthResult> {
      return http.post("/login", { data: { code } });
    },

    listCollaterals(): Promise<{ collaterals: API.Collateral[] }> {
      return http.get("/cats");
    },

    getAssets(): Promise<{ assets: API.Asset[] }> {
      return http.get("/assets");
    },

    getMyVaults(): Promise<{ vaults: API.Vault[] }> {
      return http.get("/me/vats");
    },

    getVaultEvents(
      id: string,
      params: API.PaginationParams
    ): Promise<API.PaginationResp<{ events: API.VaultEvent[] }>> {
      return http.get(`/vats/${id}/events`, { params });
    },

    getTransactions(
      params: API.PaginationParams
    ): Promise<API.PaginationResp<{ transactions: API.Transaction[] }>> {
      return http.get("/transactions", { params });
    },

    getTransaction(follow_id: string): Promise<API.Transaction> {
      return http.get(`/transactions/${follow_id}`);
    },

    getFlips(
      params: API.PaginationParams
    ): Promise<API.PaginationResp<{ flips: API.Flip[] }>> {
      return http.get("/flips", { params });
    },

    getFlip(id: string): Promise<API.Flip> {
      return http.get(`/flips/${id}`);
    },

    getFlipEvents(id: string): Promise<{ events: API.FlipEvent[] }> {
      return http.get(`/flips/${id}/events`);
    },

    oracles(): Promise<{ oracles: API.Oracle[] }> {
      return http.get("/oracles");
    },

    postActions(payload: API.ActionPayload): Promise<API.ActionResponse> {
      return http.post("/actions", { data: payload });
    },

    getPublic() {
      return http.get("/hc");
    },

    getAssetsFromMixin(): Promise<API.MixinAsset[]> {
      return http.get(`${MIXIN_HOST}/assets`);
    },

    getAssetFromMixin(id: string): Promise<API.MixinAsset> {
      return http.get(`${MIXIN_HOST}/assets/${id}`);
    },

    async getMe(): Promise<API.Profile> {
      const resp = await http.get(`${MIXIN_HOST}me`);
      return resp;
    },

    config(options: AxiosRequestConfig) {
      http.config(options);
    },
  };
}
