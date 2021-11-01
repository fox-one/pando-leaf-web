<template>
  <v-flex class="progress">
    <div class="progress-bar"></div>
    <div class="progress-dot" :style="styles"></div>

    <base-risk-info v-if="tips" :progress="progress" class="mt-6" />
  </v-flex>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class extends Vue {
  @Prop() progress!: number;

  @Prop({ default: true }) tips!: boolean;

  get styles() {
    const percent = Math.max(0, Math.min(100, this.progress));
    return `margin-left: calc(${percent} * calc(100% - 12px) / 100 + 2px);`;
  }
}
</script>
<style lang="scss" scoped>
.progress {
  position: relative;
  .progress-bar {
    display: block;
    width: 100%;
    border-radius: 12px;
    height: 12px;
    background: linear-gradient(
      270deg,
      var(--v-risk_high-base) 0%,
      var(--v-risk_high-base) 19.99%,
      var(--v-risk_mid-base) 20%,
      var(--v-risk_mid-base) 39.99%,
      var(--v-risk_low-base) 40%,
      var(--v-risk_low-base) 100%
    );
  }

  .progress-dot {
    position: absolute;
    top: 0px;
    border-radius: 50%;
    background-color: white;
    height: 8px;
    margin: 2px;
    width: 8px;
    transition: all 0.5s ease 0s;
  }
}
</style>
