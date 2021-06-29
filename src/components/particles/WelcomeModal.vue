<template>
  <v-dialog v-model="dialog">
    <v-card>
      <div>
        <v-icon> $iconWelcomeImg </v-icon>
      </div>
      <div class="my-8 text-center">
        <v-btn
          rounded
          depressed
          color="primary"
          height="56px"
          class="px-8"
          @click="handleConfirm"
          >{{ $t("notice.confirm") }}</v-btn
        >
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class WelcomeModal extends Vue {
  dialog = false;

  show() {
    this.dialog = true;
  }

  handleConfirm() {
    this.dialog = false;
  }
}
export default WelcomeModal;
</script>
<style lang="scss" scoped></style>
