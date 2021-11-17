<template>
  <f-tooltip v-if="isDesktop" v-model="tooltip" top>
    <template #activator="{ on }">
      <v-icon size="16" color="greyscale_3" v-on="on"> $iconQuestion </v-icon>
    </template>
    <div>
      <div
        class="ma-4 f-caption greyscale_3--text"
        v-for="content in contents"
        :key="content"
      >
        {{ content }}
      </div>
    </div>
  </f-tooltip>

  <f-bottom-sheet
    v-else
    v-model="sheet"
    :hide-close-icon="true"
    overlay-opacity="0.9"
    nudge-top="-10"
    max-width="600"
  >
    <template #activator="{ on }">
      <v-icon size="14" color="greyscale_3" v-on="on">$iconQuestion</v-icon>
    </template>

    <f-bottom-sheet-title>
      {{ $t("tooltip.details") }}
    </f-bottom-sheet-title>

    <div class="pb-8">
      <div
        class="ma-4 tooltip-content greyscale_3--text"
        v-for="content in contents"
        :key="content"
      >
        {{ content }}
      </div>
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
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Tooltip extends Vue {
  @Prop() hint!: string;

  tooltip = false;

  sheet = false;

  get isDesktop() {
    return this.$vuetify.breakpoint.mdAndUp;
  }

  get contents() {
    if (Array.isArray(this.hint)) {
      return this.hint;
    }
    return [this.hint];
  }
}
</script>

<style lang="scss" scoped>
.tooltip {
  display: inline-block;
}
.tooltip-content {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 1.375rem;
  text-align: center;
  letter-spacing: 0.011em;
}
</style>
