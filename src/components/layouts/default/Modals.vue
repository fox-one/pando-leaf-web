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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";

@Component
class DefaultLayoutModals extends Vue {
  @State((state) => state.app.toast) toast;

  @State((state) => state.app.paying) paying;

  @Mutation("app/SET_TOAST") setToast;

  @Mutation("app/SET_PAYING") setPaying;

  handleToastChange(val) {
    this.setToast({ show: val });
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
