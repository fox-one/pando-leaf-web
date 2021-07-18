<template>
  <div>
    <welcome-modal />
    <f-toast v-bind="toast" top :timeout="3000" @change="handleToastChange" />
    <f-paying-modal
      :show="paying.visible"
      :text="$t('common.checking-payment')"
      @cancel="handlePayingCancel"
    />
    <!-- <base-payment-dialog
      :show="payment.visible"
      :url="payment.url"
      @cancel="handlePaymentChange"
    /> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import WelcomeModal from "./WelcomeModal.vue";
import { Sync } from "vuex-pathify";

@Component({
  components: {
    WelcomeModal,
  },
})
class DefaultLayoutModals extends Vue {
  @Sync("app/toast") toast!: State.ToastState;

  @Sync("app/paying") paying!: State.PayState;

  handleToastChange(value: boolean) {
    this.toast = { ...this.toast, show: value };
  }

  handlePayingCancel() {
    if (this.paying.timer) {
      clearTimeout(this.paying.timer);
    }

    this.paying = { visible: false, timer: null };
  }
}
export default DefaultLayoutModals;
</script>
