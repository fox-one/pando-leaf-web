<template>
  <v-dialog v-model="dialog" max-width="600">
    <f-panel class="payment">
      <div class="my-3">{{ $t("pay.modal.title") }}</div>

      <f-qr-code v-if="meta.text" :text="meta.text" :size="180" class="my-5" />

      <f-button color="primary" @click="handlePaid">
        {{ $t("pay.modal.button") }}
      </f-button>
    </f-panel>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { EVENTS } from "@/constants";

import type { Callbacks } from "@/utils/payment";

@Component
class PayQrCodeModal extends Vue {
  dialog = false;

  payment: API.PayUrl | null = null;

  cbs: Callbacks = {};

  get meta() {
    return { text: this.payment?.pay_url ?? "" };
  }

  mounted() {
    this.$root.$on(EVENTS.PAY_QR_CODE, this.show);
  }

  show(payment: API.PayUrl, cbs: Callbacks) {
    this.payment = payment;
    this.cbs = cbs;
    this.dialog = true;
  }

  async handlePaid() {
    this.dialog = false;
    if (!this.payment) return;
    // this.$utils.payment.showPaying(this);
    // this.$utils.payments.pollingTransferStatus(this, this.payment, this.cbs);
  }

  @Watch("dialog")
  handleDialogChange(value: boolean) {
    if (!value) {
      this.payment = null;
      this.cbs = {};
    }
  }
}
export default PayQrCodeModal;
</script>

<style lang="scss" scoped>
.payment {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
