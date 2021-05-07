import Http from "~/utils/http";
import { AxiosRequestConfig } from "axios";
import {
  BaseRes,
  IActionsParams,
  IMixinResponse,
  PagedTransactions,
  PagedVaultEvents,
  Pagination,
} from "../types/dto";
import {
  AuthResult,
  ICollateral,
  IMixinAsset,
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
    getAssets(): Promise<BaseRes<{ assets: IMixinAsset[] }>> {
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
