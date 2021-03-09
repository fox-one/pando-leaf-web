import Http from "~/utils/http";
import { AxiosRequestConfig } from "axios";
import { BaseRes, IMixinResponse } from "../types/dto";
import { AuthResult, ICollateral, IMixinAsset, IVault } from "../types/vo";

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
      return http.get("/vats");
    },
    getAssetsFromMixin(): Promise<IMixinResponse<IMixinAsset[]>> {
      return http.get("https://mixin-api.zeromesh.net/assets");
    },
    getAssetFromMixin(id: string): Promise<{ data: IMixinAsset }> {
      return http.get(`https://mixin-api.zeromesh.net/assets/${id}`);
    },
    getPublic() {
      return http.get("/hc");
    },
    config(options: AxiosRequestConfig) {
      http.config(options);
    },
  };
}
