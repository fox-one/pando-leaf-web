<template>
  <f-bottom-sheet
    v-model="dialog"
    :adaptive="true"
    max-width="627"
    overlay-opacity="0.9"
    desktop-wapper="dialog"
    content-class="welcome-modal"
  >
    <v-layout v-if="desktop" align-center>
      <div class="wrapper">
        <v-icon :size="207">$iconWelcomeImg</v-icon>
      </div>

      <v-divider vertical />
      <div class="wrapper">
        <div class="welcome-title">
          {{ $t("welcome.what-is") + "Pando" }}
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

    <v-layout v-else column align-center class="text-center pa-6">
      <v-icon class="mt-10" :size="327">$iconWelcomeImg</v-icon>
      <div class="welcome-title">
        {{ $t("welcome.what-is") + "Pando" }}
        <v-icon size="68" class="mx-1">$iconLeaf</v-icon>
      </div>
      <div class="greyscale_3--text mt-8">
        {{ $t("welcome.description") }}
      </div>
      <f-button class="my-8" @click="handleNext">
        {{ $t("common.continue") }}
      </f-button>
    </v-layout>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Sync } from "vuex-pathify";

@Component
class WelcomeModal extends Vue {
  @Sync("app/visited") visited!: boolean;

  dialog = false;

  desktop = this.$vuetify.breakpoint.mdAndUp;

  mounted() {
    this.dialog = !this.visited;
  }

  handleNext() {
    this.visited = true;
    this.dialog = false;
  }
}
export default WelcomeModal;
</script>
<style lang="scss">
.welcome-modal {
  .f-bottom-sheet__body {
    padding-bottom: 0 !important;
  }
}
</style>

<style lang="scss" scoped>
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
