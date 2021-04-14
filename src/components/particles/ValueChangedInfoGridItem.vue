<template>
  <f-info-grid-item>
    <div class="f-info-grid-item-content">
      <div
        class="f-info-grid-item-title f-greyscale-3 f-caption d-flex align-center"
      >
        {{ title }}
        <f-tooltip v-if="hint" top v-model="showTooltip">
          <template #activator="{ on, attrs }">
            <v-btn
              icon
              x-small
              ripple="false"
              color="f-greyscale-3"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon size="16" color="f-greyscale-4"> {{ helpIcon }}</v-icon>
            </v-btn>
          </template>
          {{ hint }}
        </f-tooltip>
      </div>
      <div
        class="flex f-info-grid-item-value-wrapper f-greyscale-1 f-body-2 d-flex"
      >
        <div
          :class="
            'f-info-grid-item-value ' +
            (valueColor ? `${valueColor}--text` : '')
          "
        >
          {{ value }}
        </div>
        <div class="f-info-grid-item-value-unit">
          {{ valueUnit }}
        </div>
        <v-btn
          v-if="showToggle"
          icon
          x-small
          ripple="false"
          color="f-greyscale-3"
          @click="toggle"
        >
          <v-icon size="16" color="f-greyscale-4">{{ toggleIcon }}</v-icon>
        </v-btn>
      </div>
      <div
        v-if="showChange"
        class="flex f-info-grid-item-value-wrapper f-greyscale-1 f-body-2 d-flex"
      >
        <v-icon v-if="!disableChangedIcon" size="14">{{
          $icons.mdiSubdirectoryArrowRight
        }}</v-icon>
        <div
          :class="
            'f-info-grid-item-value ' +
            (changedValueColor ? `${changedValueColor}--text` : '')
          "
        >
          {{ changedValue }}
        </div>
        <div class="f-info-grid-item-value-unit">
          {{ valueUnit }}
        </div>
      </div>
    </div>
  </f-info-grid-item>
</template>

<script lang="ts" scoped>
import { mdiHelpCircle, mdiRecycle } from "@mdi/js";
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

@Component
export default class ValueChangedInfoGridItem extends Vue {
  @Prop({ default: "" }) title;

  @Prop({ default: "" }) value!: any;

  @Prop({ type: String, default: "" }) valueColor!: string;

  @Prop({ type: String, default: "" }) valueCustomColor!: string;

  @Prop({ type: String, default: "" }) valueUnit!: string;

  @Prop({ type: String, default: "" }) hint!: string;

  @Prop({ type: Boolean, default: false }) showChange!: boolean;

  @Prop({ default: "" }) changedValue;

  @Prop({ type: String, default: "" }) changedValueColor!: string;

  @Prop({ type: Boolean, default: "" }) disableChangedIcon!: boolean;

  @Prop({ type: Boolean, default: false }) showToggle!: boolean;

  @Emit()
  toggle() {
    // just emit a event.
  }

  showTooltip = false;

  get helpIcon() {
    return mdiHelpCircle;
  }

  get toggleIcon() {
    return mdiRecycle;
  }
}
</script>

<style lang="scss"></style>
