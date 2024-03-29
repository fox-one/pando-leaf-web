import Http from "./http";
import { AxiosRequestConfig } from "axios";
import { MIXIN_HOST } from "@/constants";

export default function (http: Http) {
  return {
    auth(data: API.AuthParams): Promise<API.AuthResult> {
      return http.post("/login", { data });
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

    // 获取拍卖列表 deprecated
    getFlips(
      params: API.PaginationParams
    ): Promise<API.PaginationResp<{ flips: API.Flip[] }>> {
      return http.get("/flips", { params });
    },

    // 获取拍卖列表 带有 filter 的
    queryFlips(
      params: API.FlipParams
    ): Promise<{ flips: API.Flip[]; total: number }> {
      return http.get("/query-flips", {
        params,
      });
    },

    // 获取拍卖详情
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

    // /api/stats?from=xxx&to=xxx
    getStats(
      payload: API.StatsPayload
    ): Promise<{ stats: API.StatsResponse[] }> {
      return http.get("/stats", { params: payload });
    },

    // /api/stats/collateral_id?from=xxx&to=xxx
    getCollateralStats(
      collateral_id: string,
      payload: API.StatsPayload
    ): Promise<{ stats: API.StatsResponse[] }> {
      return http.get(`/stats/${collateral_id}`, { params: payload });
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

    getNetworkAssets(): Promise<API.MixinAsset[]> {
      return http.get(`${MIXIN_HOST}/network/assets/top`);
    },

    getNetworkAsset(id: string): Promise<API.MixinAsset> {
      return http.get(`${MIXIN_HOST}/network/assets/${id}`);
    },

    getFiats(): Promise<{ assets: API.Fiat[] }> {
      return http.get(`${MIXIN_HOST}/external/fiats`);
    },

    async getMe(): Promise<API.Profile> {
      const resp = await http.get(`${MIXIN_HOST}/me`);
      return resp;
    },

    config(options: AxiosRequestConfig) {
      http.config(options);
    },
  };
}
