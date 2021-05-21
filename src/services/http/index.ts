import Http from "~/utils/http";
import { AxiosRequestConfig } from "axios";
import {
  BaseRes,
  IActionsParams,
  IMixinResponse,
  PagedFlips,
  PagedTransactions,
  PagedVaultEvents,
} from "../types/dto";
import {
  AuthResult,
  IAsset,
  ICollateral,
  IFlip,
  IMixinAsset,
  IOracle,
  ITransaction,
  IVault,
} from "../types/vo";
import { MIXIN_HOST } from "~/constants";

export default function (http: Http) {
  return {
    auth(code: string): Promise<BaseRes<AuthResult>> {
      return http.post("/login", {
        data: { code },
      });
    },
    listCollaterals(): Promise<BaseRes<{ collaterals: ICollateral[] }>> {
      return http.get("/cats");
    },
    getAssets(): Promise<BaseRes<{ assets: IAsset[] }>> {
      return http.get("/assets");
    },
    getMyVaults(): Promise<BaseRes<{ vaults: IVault[] }>> {
      return http.get("/me/vats");
    },
    getAssetsFromMixin(): Promise<IMixinResponse<IMixinAsset[]>> {
      return http.get("https://mixin-api.zeromesh.net/assets");
    },
    getAssetFromMixin(id: string): Promise<{ data: IMixinAsset }> {
      return http.get(`https://mixin-api.zeromesh.net/assets/${id}`);
    },
    getVaultEvents({
      id,
      cursor = null,
      limit = 20,
    }: {
      id: string | any;
      cursor: string | null;
      limit: number;
    }): Promise<BaseRes<PagedVaultEvents>> {
      let url = `/vats/${id}/events?limit=${limit}`;
      if (cursor !== null && cursor !== undefined) {
        url += `&cursor=${cursor}`;
      }
      return http.get(url);
    },
    getTransactions({
      cursor,
      limit = 20,
    }: {
      cursor: string | null;
      limit: number;
    }): Promise<BaseRes<PagedTransactions>> {
      let url = `/transactions?limit=${limit}`;
      if (cursor !== null && cursor !== undefined) {
        url += `&cursor=${cursor}`;
      }
      return http.get(url);
    },
    getTransaction(follow_id: string): Promise<BaseRes<ITransaction>> {
      return http.get(`/transactions/${follow_id}`);
    },
    getFlips({
      cursor,
      limit,
    }: {
      cursor: string | null;
      limit: number;
    }): Promise<BaseRes<PagedFlips>> {
      let url = `/flips?limit=${limit}`;
      if (cursor !== null && cursor !== undefined) {
        url += `&cursor=${cursor}`;
      }
      return http.get(url);
    },
    getFlip(id: string): Promise<BaseRes<IFlip>> {
      return http.get(`/flips/${id}`);
    },
    oracles(): Promise<BaseRes<{ oracles: IOracle[] }>> {
      return http.get("/oracles");
    },
    postActions(
      params: IActionsParams
    ): Promise<
      BaseRes<{
        memo: string;
        code: string;
        code_url: string;
      }>
    > {
      return http.post("/actions", {
        data: params,
      });
    },
    getPublic() {
      return http.get("/hc");
    },
    getMe(): Promise<any> {
      return http.get(`${MIXIN_HOST}me`);
    },
    config(options: AxiosRequestConfig) {
      http.config(options);
    },
  };
}
