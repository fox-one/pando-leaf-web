<template>
  <f-bottom-sheet
    v-model="sheet"
    :hide-close-icon="true"
    overlay-opacity="0.9"
    wapper-in-desktop="dialog"
    nudge-top="-10"
    max-width="600"
  >
    <template #activator="{ on }">
      <div
        v-on="on"
        class="py-6 px-4 d-flex justify-space-between"
        align-center
      >
        <h2 class="safety-warning">{{ meta.title }}</h2>

        <v-icon size="16" color="greyscale_1">$FIconChevronRight4P</v-icon>
      </div>
    </template>

    <f-bottom-sheet-title> {{ meta.title }} </f-bottom-sheet-title>

    <div :class="!isDesktop ? 'pb-8' : ''">
      <p class="ma-4 tooltip-content greyscale_3--text">
        {{ meta.hint }}
      </p>

      <div class="my-8 text-center">
        <f-button
          rounded
          depressed
          color="primary"
          height="56px"
          class="px-8"
          @click="sheet = false"
        >
          {{ $t("common.close") }}
        </f-button>
      </div>
    </div>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Sync } from "vuex-pathify";
import BaseTooltip from "./Tooltip.vue";

@Component({
  components: {
    BaseTooltip,
  },
})
class SafetyWarning extends Vue {
  @Sync("app/safetyWarningShown") safetyWarningShown!: boolean;

  sheet = false;

  get isDesktop() {
    return this.$vuetify.breakpoint.mdAndUp;
  }

  mounted() {
    if (!this.safetyWarningShown) {
      this.sheet = true;
      this.safetyWarningShown = true;
    }
  }

  get meta() {
    return {
      title: this.$t("safety-warning"),
      hint: this.$t("safety-warning-content"),
    };
  }
}
export default SafetyWarning;
</script>
<style lang="scss" scoped>
.safety-warning {
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
}
</style>
