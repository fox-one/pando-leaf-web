<template>
  <div>
    <risk-warning-modal />

    <terms-modal />

    <welcome-modal />

    <pando-announce-modal app="leaf" :dev="dev" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import WelcomeModal from "./WelcomeModal.vue";
import RiskWarningModal from "./RiskWarningModal.vue";
import TermsModal from "./TermsModal.vue";
import { isProduct } from "@/constants";

@Component({
  components: {
    WelcomeModal,
    RiskWarningModal,
    TermsModal,
  },
})
class DefaultLayoutModals extends Vue {
  dev = !isProduct;

  mounted() {
    this.$utils.app.checkTerms(this);
  }
}
export default DefaultLayoutModals;
</script>
