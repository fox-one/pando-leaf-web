<template>
  <v-layout align-center>
    <f-tooltip v-if="hint && isDesktop" top v-model="showTooltip">
      <template #activator="{ on, attrs }">
        <v-btn
          v-if="hint"
          icon
          x-small
          color="f-greyscale-3"
          v-on="on"
          v-bind="attrs"
        >
          <v-icon :size="size">$iconQuestion</v-icon>
        </v-btn>
      </template>
      <slot name="tip">
        <div class="tip" v-for="content in contents" :key="content">
          {{ content }}
        </div>
      </slot>
    </f-tooltip>
    <f-bottom-sheet
      overlay-opacity="0.9"
      v-if="hint && !isDesktop"
      v-model="showSheet"
      nudge-top="-10"
      max-width="600"
    >
      <template #activator="{ on, attrs }">
        <f-button
          v-if="hint"
          icon
          x-small
          :ripple="false"
          color="f-greyscale-3"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon :size="size">$iconQuestion</v-icon>
        </f-button>
      </template>
      <template #title>
        <div class="f-title-1 text-center">{{ $t("tooltip.details") }}</div>
      </template>
      <div class="pb-8">
        <slot name="tip">
          <div class="ma-4" v-for="content in contents" :key="content">
            {{ content }}
          </div>
        </slot>
        <div class="my-8 text-center">
          <f-button
            rounded
            depressed
            color="primary"
            height="56px"
            class="px-8"
            @click="showSheet = false"
            >{{ $t("common.close") }}</f-button
          >
        </div>
      </div>
    </f-bottom-sheet>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Tooltip extends Vue {
  @Prop() hint!: string | string[];
  @Prop({ default: 14 }) size!: number;

  showTooltip = false;
  showSheet = false;

  get isDesktop() {
    return this.$utils.helper.isDesktop();
  }

  get contents() {
    if (Array.isArray(this.hint)) {
      return this.hint;
    }
    return [this.hint];
  }
}
</script>

<style lang="scss" scoped></style>
