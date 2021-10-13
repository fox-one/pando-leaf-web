import utils from "@foxone/utils";

export function genPaymentUrl(data: {
  recipient: string;
  assetId: string;
  amount: string;
  traceId: string;
  memo: string;
}) {
  const { recipient, assetId, amount, traceId, memo } = data;
  return `mixin://pay?recipient=${recipient}&asset=${assetId}&amount=${amount}&trace=${traceId}&memo=${memo}`;
}

export async function requestPayment(vm: Vue, params: API.ActionPayload) {
  const resp = await vm.$http.postActions(params);
  // connected to Fennec?
  if (vm.$fennec.connected) {
    return await vm.$fennec.ctx?.wallet.multisigsPayment({ code: resp.code });
  }

  // not connected to Fennec
  if (utils.helper.isDesktop()) {
    return resp.code_url;
  } else {
    window.location.href = `${resp.code_url}`;
  }
}

export function showPaying(vm: Vue) {
  vm.$store.commit("app/SET_PAYING", { visible: true });
}

export function hidePaying(vm: Vue) {
  vm.$store.commit("app/SET_PAYING", { visible: false });
}
