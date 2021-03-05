import Http from "~/utils/http";
import { AxiosRequestConfig } from "axios";
import { IMixinResponse } from "../types/dto";
import { IMixinAsset } from "../types/vo";

export default function (http: Http) {
  return {
    auth(code: string): Promise<{ access_token: string; scope: string }> {
      return http.post("/oauth", {
        data: { code },
      });
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
