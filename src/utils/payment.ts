import utils from "@foxone/utils";
import { EVENTS } from "~/constants";
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
  const resParams: API.PayUrl = {
    follow_id: params.follow_id,
    pay_url: resp.code_url,
  };

  if (vm.$fennec.connected) {
    await vm.$fennec.ctx?.wallet.multisigsPayment({ code: resp.code });

    showPaying(vm);
    pollingTransferStatus(vm, resParams, cbs);
  } else if (vm.$utils.mixin.isMixin()) {
    window.location.href = `${resp?.code_url}`;

    showPaying(vm);
    pollingTransferStatus(vm, resParams, cbs);
  } else {
    vm.$root.$emit(EVENTS.PAY_QR_CODE, resParams, cbs);
  }
}

let timer;

export async function pollingTransferStatus(
  vm: Vue,
  params: API.PayUrl,
  cbs: Callbacks
) {
  let result: API.Transaction | null = null;
  try {
    result = await vm.$http.getTransaction(params.follow_id);

    if (!vm.$store.state.app.paying.visible) return;

    if (result) {
      afterTransferCompleted(vm);

      const checked = await cbs?.checker?.();
      if (cbs?.checker && !checked) {
        vm.$utils.helper.showNetworkCongestion(vm);
      } else if (result.status === TransactionStatus.OK) {
        cbs.success?.();
      } else {
        cbs.error?.();
      }

      hidePaying(vm);
    } else {
      timer = setTimeout(() => {
        pollingTransferStatus(vm, params, cbs);
      }, 2000);

      setPayingTimer(vm, timer);
    }
  } catch (error: any) {
    vm.$utils.helper.errorHandler(vm, {
      code: error?.code ?? error,
    });
    cbs.error?.();
  }
}

export async function afterTransferCompleted(vm: Vue) {
  await vm.$utils.app.refresh(vm);
}

export function showPaying(vm: Vue) {
  vm.$store.commit("app/SET_PAYING", { visible: true });
}

export function hidePaying(vm: Vue) {
  vm.$store.commit("app/SET_PAYING", { visible: false });
}

export function setPayingTimer(vm: Vue, timer) {
  vm.$store.commit("app/SET_PAYING", { timer });
}

export function showPayQrDialog(vm: Vue, params: API.PayUrl) {
  vm.$root.$emit(EVENTS.PAY_QR_CODE, params);
}
