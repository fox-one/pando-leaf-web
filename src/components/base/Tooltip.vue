<template>
  <div>
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
          <v-icon size="14">$iconQuestion</v-icon>
        </v-btn>
      </template>
      <div class="tip">{{ hint }}</div>
    </f-tooltip>
    <f-bottom-sheet
      v-if="hint && !isDesktop"
      v-model="showSheet"
      :persistent="true"
      nudge-top="-10"
      max-width="600"
    >
      <template #activator="{ on }">
        <f-button
          v-if="hint"
          icon
          x-small
          :ripple="false"
          color="f-greyscale-3"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon size="14">$iconQuestion</v-icon>
        </f-button>
      </template>
      <template #title> {{ $t("tooltip.details") }} </template>
      <div class="pb-8">
        <div class="ma-4">{{ hint }}</div>
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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Tooltip extends Vue {
  @Prop() hint!: string;

  showTooltip = false;
  showSheet = false;

  get isDesktop() {
    return this.$utils.helper.isDesktop();
  }
}
</script>

<style lang="scss" scoped></style>
