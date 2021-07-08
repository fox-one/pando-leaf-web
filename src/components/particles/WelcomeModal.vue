<template>
  <div>
    <f-bottom-sheet overlay-opacity="0.9" v-model="sheet">
      <v-layout column align-center>
        <v-icon class="mt-10" :size="imageHeight">$iconWelcomeImg</v-icon>
        <div class="welcome-title f-greyscale-1 mt-8 text-center">
          {{ $t("welcome.what-is")
          }}<v-icon class="welcome-leaf-logo" size="54">$iconLeaf</v-icon>
        </div>
        <div class="welcome-content f-greyscale-3 mx-4 mt-8 text-center">
          {{ $t("welcome.description") }}
        </div>
        <f-button class="my-8" @click="hide">{{
          $t("common.continue")
        }}</f-button>
      </v-layout>
    </f-bottom-sheet>
    <v-dialog v-model="dialog" width="627">
      <f-panel class="pa-0 welcome-dialog">
        <v-layout>
          <v-icon class="ma-10" size="207">$iconWelcomeImg</v-icon>
          <v-divider vertical />
          <v-layout column>
            <div class="ml-10 mt-10 welcome-title f-greyscale-1">
              {{ $t("welcome.what-is")
              }}<v-icon class="welcome-leaf-logo" size="64px">$iconLeaf</v-icon>
            </div>
            <div class="mx-10 mt-6 welcome-content f-greyscale-3">
              {{ $t("welcome.description") }}
            </div>
            <div>
              <f-button class="ml-10 mt-6" @click="handleConfirm"
                >{{ $t("notice.confirm") }}
              </f-button>
            </div>
          </v-layout>
        </v-layout>
      </f-panel>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class WelcomeModal extends Vue {
  dialog = false;
  sheet = false;
  imageHeight = 0;
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

  mounted() {
    this.imageHeight = Math.min(document.body.offsetHeight - 390, 327);
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
  margin-top: -4px;
  margin-left: 6px;
  height: 32px !important;
  width: 64px !important;
  font-size: 64px !important;
  ::v-deep {
    .v-icon__component {
      height: 32px !important;
      width: 64px !important;
      font-size: 64px !important;
    }
  }
}
</style>
