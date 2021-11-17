<template>
  <div>
    <f-bottom-sheet
      v-if="!desktop"
      v-model="dialog"
      :adaptive="true"
      :hide-close-icon="true"
      nudge-top="-10"
      overlay-opacity="0.9"
      desktop-wapper="dialog"
      content-class="welcome-modal"
    >
      <v-layout column align-center class="text-center welcome-modal pa-6">
        <v-icon class="mt-10" :size="327">$iconWelcomeImg</v-icon>
        <div class="welcome-title">
          {{ $t("welcome.what-is") }}
          <v-icon size="68" class="mx-1">$iconLeaf</v-icon>
        </div>
        <div class="greyscale_3--text mt-8">
          {{ $t("welcome.description") }}
        </div>
        <f-button
          class="my-8 greyscale_1 greyscale_7--text"
          @click="handleNext"
        >
          {{ $t("common.continue") }}
        </f-button>
      </v-layout>
    </f-bottom-sheet>

    <v-dialog v-model="dialog" v-if="desktop" width="627">
      <f-panel class="pa-0 welcome-dialog">
        <v-layout align-center>
          <div class="wrapper">
            <v-icon :size="207">$iconWelcomeImg</v-icon>
          </div>

          <v-divider vertical />
          <div class="wrapper">
            <div class="welcome-title">
              {{ $t("welcome.what-is") }}
              <v-icon size="68" class="mx-1">$iconLeaf</v-icon>
            </div>

            <div class="greyscale_3--text mt-8">
              {{ $t("welcome.description") }}
            </div>

            <f-button class="mt-8" @click="handleNext">
              {{ $t("common.continue") }}
            </f-button>
          </div>
        </v-layout>
      </f-panel>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Sync } from "vuex-pathify";

@Component
class WelcomeModal extends Vue {
  @Sync("app/visited") visited!: boolean;

  dialog = false;

  desktop = this.$vuetify.breakpoint.mdAndUp;

  get dialogProps() {
    return {
      class: "welcome-dialog",
      fullscreen: true,
    };
  }

  mounted() {
    // this.dialog = !this.visited;
    this.dialog = true;
  }

  @Watch("dialog")
  onDialogChange(visible) {
    if (visible == false) {
      this.visited = true;
    }
  }

  handleNext(newVal) {
    this.visited = true;
    this.dialog = false;
  }
}
export default WelcomeModal;
</script>
<style lang="scss" scoped>
.welcome-modal {
  .f-bottom-sheet__body {
    padding-bottom: 0 !important;
  }
}

.welcome-title {
  font-size: 24px;
  color: var(--v-greyscale_1-base);
  font-weight: bold;
  display: flex;
  align-items: center;
}

.wrapper {
  padding: 40px;
}
</style>
