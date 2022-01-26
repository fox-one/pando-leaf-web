<template>
  <f-bottom-sheet
    v-model="dialog"
    :persistent="true"
    :title="$t('use.terms')"
    wapper-in-desktop="dialog"
  >
    <div class="pa-6">
      <div class="terms-title">
        {{ $t("terms.hint") }}
      </div>

      <div class="terms-items">
        <p>
          {{ $t("terms.item1") }}
        </p>
        <p>
          {{ $t("terms.item2") }}
        </p>
        <p>
          {{ $t("terms.item3") }}
        </p>
      </div>

      <div class="text-center mt-8">
        <f-button color="primary" @click="handleAcceptTerms">
          {{ $t("accept") }}
        </f-button>
      </div>
    </div>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { EVENTS, TERMS_VERSION } from "@/constants";

@Component
class TermsModal extends Vue {
  dialog = false;

  mounted() {
    this.$root.$on(EVENTS.OPEN_TERMS_MODAL, () => {
      this.dialog = true;
    });
  }

  handleAcceptTerms() {
    this.$store.commit("app/SET_TERMS_ACCEPTED", true);
    this.$store.commit("app/SET_TERMS_VERSION", TERMS_VERSION);
    this.dialog = false;
  }
}
export default TermsModal;
</script>

<style lang="scss" scoped>
.terms-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--v-greyscale_2-base);
}

.terms-items {
  margin-top: 24px;
  font-size: 12px;
  color: var(--v-greyscale_3-base);
}
</style>
