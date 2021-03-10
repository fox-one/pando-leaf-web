<template>
  <div>
    <f-toast
      v-bind="toast"
      top
      :timeout="3000"
      @change="handleToastChange"
      style="top: 30px"
    />
    <f-paying-modal
      :show="paying.visible"
      :text="$t('common.checking-payment')"
      @cancel="handlePayingCancel"
    />
    <base-payment-dialog
      :show="payment.visible"
      :url="payment.url"
      @cancel="handlePaymentChange"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";

@Component
class DefaultLayoutModals extends Vue {
  @State((state) => state.app.toast) toast;

  @State((state) => state.app.paying) paying;

  @State((state) => state.app.payment) payment;

  @Mutation("app/SET_TOAST") setToast;

  @Mutation("app/SET_PAYING") setPaying;

  @Mutation("app/SET_PAYMENT_URL") setPaymentUrl;

  handleToastChange(val) {
    this.setToast({ show: val });
  }

  handlePaymentChange() {
    this.setPaymentUrl({
      visible: false,
      paymentUrl: "",
    });
  }

  handlePayingCancel() {
    if (this.paying.timer !== null && this.paying.timer !== undefined) {
      clearInterval(this.paying.timer);
      clearTimeout(this.paying.timer);
    }
    this.setPaying({ visible: false });
  }
}
export default DefaultLayoutModals;
</script>
