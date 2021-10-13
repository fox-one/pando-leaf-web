<template>
  <div>
    <welcome-modal />
    <f-paying-modal
      :show="paying.visible"
      :text="$t('common.checking-payment')"
      @cancel="handlePayingCancel"
    />
    <auth-modal />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import WelcomeModal from "./WelcomeModal.vue";
import AuthModal from "./AuthModal.vue";
import { Sync } from "vuex-pathify";

@Component({
  components: {
    WelcomeModal,
    AuthModal,
  },
})
class DefaultLayoutModals extends Vue {
  @Sync("app/paying") paying!: State.PayState;

  handlePayingCancel() {
    if (this.paying.timer) {
      clearTimeout(this.paying.timer);
    }

    this.paying = { visible: false, timer: null };
  }
}
export default DefaultLayoutModals;
</script>
