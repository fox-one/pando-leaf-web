<template>
  <div>
    <f-tooltip v-if="hint && isDesktop" top v-model="showTooltip">
      <template #activator="{ on, attrs }">
        <v-btn
          v-if="item.hint"
          icon
          x-small
          :ripple="false"
          color="f-greyscale-3"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon size="14">$iconQuestion</v-icon>
        </v-btn>
      </template>
      {{ hint }}
    </f-tooltip>
    <f-bottom-sheet
      v-if="hint && !isDesktop"
      v-model="showSheet"
      :persistent="true"
      nudge-top="-10"
      max-width="600"
    >
      <template #activator="{ on }">
        <v-btn
          v-if="item.hint"
          icon
          x-small
          :ripple="false"
          color="f-greyscale-3"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon size="14">$iconQuestion</v-icon>
        </v-btn>
      </template>
      <template #title> Details </template>
      {{ hint }}
      <div class="my-8 text-center">
        <v-btn
          rounded
          depressed
          color="primary"
          height="56px"
          class="px-8"
          @click="on"
          >{{ $t("common.close") }}</v-btn
        >
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
