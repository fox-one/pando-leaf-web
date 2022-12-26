import { ACTION_ASSET_ID } from "~/constants";
import { TransactionStatus } from "~/enums";

export interface Callbacks {
  success?: (...args: any) => void;
  error?: (...args: any) => void;
  checker?: (...args: any) => Promise<any>;
}

export async function requestPayment(
  vm: Vue,
  params: API.ActionPayload,
  cbs: Callbacks = {}
) {
  const resp = await vm.$http.postActions(params);
  await vm.$passport.payment({
    code: resp.code,
    multisig: true,
    checker: () => {
      return checker(vm, params, cbs);
    },
  });
}

export async function checker(vm: Vue, params, cbs: Callbacks) {
  try {
    const resp = await vm.$http.getTransaction(params.follow_id);

    if (resp) {
      afterTransferCompleted(vm);

      const checked = await cbs?.checker?.();

      if (cbs?.checker && !checked) {
        vm.$utils.helper.showNetworkCongestion(vm);
      } else if (resp.status === TransactionStatus.OK) {
        cbs.success?.(resp);
      } else {
        cbs.error?.(resp);
      }

      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export async function afterTransferCompleted(vm: Vue) {
  await vm.$utils.app.refresh(vm);
}

export function shouldGetMoreActionAsset(vm: Vue, cbs?: Callbacks) {
  const getters = vm.$store.getters as Getter.GettersTree;
  const isLogged = getters["auth/isLogged"];
  const canReadAsset = getters["auth/canReadAsset"];
  if (isLogged && canReadAsset) {
    const getWalletAssetById = getters["asset/getWalletAssetById"];
    if (Number(getWalletAssetById(ACTION_ASSET_ID)?.balance ?? "0") <= 0) {
      vm.$utils.helper.errorHandler(vm, { message: vm.$t("eth.require") });

      return true;
    }
  }
  return false;
}
