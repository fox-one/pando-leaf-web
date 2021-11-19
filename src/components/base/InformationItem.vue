<template>
  <div class="infomation-item">
    <v-layout class="py-4" column>
      <v-layout align-center>
        <div class="greyscale_3--text">{{ label }}</div>

        <base-tooltip
          v-if="hint"
          :hint="hint"
          :learn-more="learnMore"
        ></base-tooltip>

        <v-spacer />

        <div :class="meta.valueColor">
          <span>
            {{ value }}
          </span>
          <span>
            {{ valueUnit }}
          </span>
        </div>
      </v-layout>

      <v-layout class="change-value" v-if="showChange" justify-end align-center>
        <v-icon class="mx-2" size="14"> $iconPointerRight </v-icon>

        <div class="greyscale_1--text">
          <span :class="meta.changedValueColor">
            {{ changedValue }}
          </span>

          <span>{{ valueUnit }}</span>
        </div>
      </v-layout>
    </v-layout>
    <f-divider v-if="!last" />
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

  @Prop() last!: boolean;

  get meta() {
    let valueColor = this.showChange
      ? "greyscale_3--text"
      : "greyscale_1--text";
    if (this.valueColor) {
      valueColor = `${this.valueColor}--text`;
    }
    const changedValueColor = this.changedValueColor
      ? `${this.changedValueColor}--text`
      : "";
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
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: -0.006em;
}
</style>
