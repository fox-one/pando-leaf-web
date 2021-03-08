import Http from "~/utils/http";
import { AxiosRequestConfig } from "axios";
import { BaseRes, IMixinResponse } from "../types/dto";
import { AuthResult, ICollateral, IMixinAsset } from "../types/vo";

export default function (http: Http) {
  return {
    auth(code: string): Promise<BaseRes<AuthResult>> {
      return http.post("/oauth", {
        data: { code },
      });
    },
    listCollaterals(): Promise<BaseRes<{ collaterals: ICollateral[] }>> {
      return http.get("/cats");
    },
    getAssets(): Promise<BaseRes<{ assets: IMixinAsset[] }>> {
      return http.get("/assets");
    },
    async getAssetsFromMixin(): Promise<IMixinResponse<IMixinAsset[]>> {
      return await http.get("https://mixin-api.zeromesh.net/assets");
    },
    async getAssetFromMixin(id: string): Promise<{ data: IMixinAsset }> {
      return await http.get(`https://mixin-api.zeromesh.net/assets/${id}`);
    },
    getPublic() {
      return http.get("/hc");
    },
    config(options: AxiosRequestConfig) {
      http.config(options);
    },
  };
}
