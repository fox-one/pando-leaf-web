<template>
  <div class="overview-switch-container" @click="onClick">
    <div :class="`overview-switch-thumb  ${thumbPositionClass}`"></div>
    <v-layout
      justify-space-around
      align-center
      class="overview-switch-background"
    >
      <v-icon size="16" :color="value ? 'white' : 'black'"
        >$iconSwitchNumber</v-icon
      >
      <v-icon size="16" :color="value ? 'black' : 'white'"
        >$iconSwitchChart</v-icon
      >
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Model, Vue } from "vue-property-decorator";

@Component({})
export default class OverviewSwitch extends Vue {
  @Model("change") value!: boolean;

  get thumbPositionClass() {
    if (this.value) return "position-right";
    return "position-left";
  }

  onClick() {
    this.value = !this.value;
    this.$emit("change", this.value);
  }
}
</script>
<style lang="scss" scoped>
.overview-switch-container {
  display: block;
  width: 56px;
  height: 24px;
  background: rgba($color: #ffffff, $alpha: 0.2);
  border-radius: 55px;
}
.overview-switch-background {
  height: 100%;
  width: 100%;
}
.overview-switch-thumb {
  position: absolute;
  width: 26px;
  height: 20px;
  background-color: #ffffff;
  border-radius: 55px;
  top: 2px;
  color: #ffffff;
}
.position-left {
  float: left;
  left: 2px;
}
.position-right {
  float: right;
  right: 2px;
}
</style>
