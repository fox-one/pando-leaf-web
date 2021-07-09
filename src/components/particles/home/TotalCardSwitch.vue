<template>
  <div class="total-card-switch-container" @click="onClick">
    <div :class="`total-card-switch-thumb  ${thumbPositionClass}`"></div>
    <v-layout
      justify-space-around
      align-center
      class="total-card-switch-background"
    >
      <v-icon size="16" :color="enabled ? 'white' : 'black'"
        >$iconSwitchNumber</v-icon
      >
      <v-icon size="16" :color="enabled ? 'black' : 'white'"
        >$iconSwitchChart</v-icon
      >
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from "vue-property-decorator";

@Component({})
class TotalCardSwitch extends Vue {
  @PropSync("enable") enabled!: boolean;

  get thumbPositionClass() {
    if (this.enabled) return "position-right";
    return "position-left";
  }

  onClick() {
    console.log("onClick", this.enabled);
    this.enabled = !this.enabled;
  }
}
export default TotalCardSwitch;
</script>
<style lang="scss" scoped>
.total-card-switch-container {
  display: block;
  width: 56px;
  height: 24px;
  background: rgba($color: #ffffff, $alpha: 0.2);
  border-radius: 55px;
}
.total-card-switch-background {
  height: 100%;
  width: 100%;
}
.total-card-switch-thumb {
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
