<template>
  <div>
    <f-bottom-sheet v-model="sheet">
      <v-layout column align-center>
        <v-icon class="mt-10" size="320">$iconWelcomeImg</v-icon>
        <div class="welcome-title f-greyscale-1 mt-8 text-center">
          What's Pando<v-icon class="welcome-leaf-logo" size="54"
            >$iconLeaf</v-icon
          >
        </div>
        <div class="welcome-content f-greyscale-3 mx-4 mt-8 text-center">
          Pando leaf is product description product description product
          description product description
        </div>
        <f-button class="my-8" @click="hide">Continue</f-button>
      </v-layout>
    </f-bottom-sheet>
    <v-dialog v-model="dialog">
      <v-layout>
        <div>
          <v-icon>$iconWelcomeImg</v-icon>
        </div>
        <v-divider vertical />
        <div class="welcome-title f-greyscale-1">
          Pando <v-icon>$iconLeaf</v-icon>
        </div>
        <div class="welcome-content f-greyscale-3">
          Pando leaf is product description product description product
          description product description
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
      </v-layout>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class WelcomeModal extends Vue {
  dialog = false;
  sheet = false;
  show() {
    if (this.$utils.helper.isDesktop()) {
      this.dialog = true;
    } else {
      this.sheet = true;
    }
  }

  handleConfirm() {
    this.dialog = false;
  }

  hide() {
    if (this.$utils.helper.isDesktop()) {
      this.dialog = false;
    } else {
      this.sheet = false;
    }
  }
}
export default WelcomeModal;
</script>
<style lang="scss" scoped>
.welcome-title {
  font-size: 25px;
  font-weight: 600;
}
.welcome-content {
  font-size: 16px;
}
.welcome-leaf-logo {
  margin-top: -6px;
}
</style>
