<template>
  <div class="step-indicator">
    <span
      v-for="index in total"
      :key="index"
      class="step-bar"
      :class="{ active: index <= current }"
    >
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class StepIndicator extends Vue {
  @Prop() current!: number;

  @Prop() total!: number;
}
</script>

<style lang="scss" scoped>
.step-indicator {
  display: inline-flex;

  .step-bar {
    width: 32px;
    height: 4px;
    border-radius: 15px;
    background: var(--v-greyscale_5-base);
    margin-right: 8px;

    &:last-child {
      margin-right: 0;
    }

    &.active {
      background: #89df0f;
    }
  }
}
</style>
