<template>
  <div class="infomation-item" :style="[{ fontSize: `${fontSize}px` }]">
    <v-layout class="py-3" column>
      <v-layout align-center>
        <div class="greyscale_3--text mr-1">{{ label }}</div>

        <base-tooltip
          v-if="hint"
          :hint="hint"
          :learn-more="learnMore"
        ></base-tooltip>

        <v-spacer />

        <div :class="showChange ? meta.changedValueColor : meta.valueColor">
          <span>
            {{ showChange ? changedValue : value }}
          </span>
          <span>
            {{ valueUnit }}
          </span>
        </div>
      </v-layout>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class extends Vue {
  @Prop() label!: string;

  @Prop() hint!: string;

  @Prop() value!: string;

  @Prop() valueColor!: string;

  @Prop() valueUnit!: string;

  @Prop() changedValue!: string | undefined | null;

  @Prop() changedValueColor!: string | undefined | null;

  @Prop({ default: false }) showChange!: boolean;

  @Prop({ default: null }) learnMore!: string;

  @Prop({ default: 14 }) fontSize!: number;

  get meta() {
    let valueColor = "greyscale_1--text";
    if (this.valueColor) {
      valueColor = `${this.valueColor}--text`;
    }
    const changedValueColor = this.changedValueColor
      ? `${this.changedValueColor}--text`
      : valueColor;
    return {
      valueColor,
      changedValueColor,
    };
  }
}
</script>

<style lang="scss" scoped>
.infomation-item {
  font-style: normal;
  font-weight: 500;
  letter-spacing: -0.006em;
}
</style>
