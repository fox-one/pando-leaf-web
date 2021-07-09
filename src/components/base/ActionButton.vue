<template>
  <v-layout
    column
    justify-center
    align-center
    :class="'text-center f-greyscale-1 ' + opacity"
    @click="onClick"
  >
    <v-icon :size="iconSize"> {{ icon }} </v-icon>
    <div class="f-caption">{{ text }}</div>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
class ActionButton extends Vue {
  @Prop({ default: false }) disabled!: boolean;
  @Prop({ default: 32 }) iconSize!: number;
  @Prop() icon;
  @Prop() text;

  get opacity() {
    if (this.disabled) {
      return "opacity2";
    }
    return "";
  }

  onClick() {
    if (!this.disabled) {
      this.$emit("click");
    }
  }
}
export default ActionButton;
</script>
<style lang="scss" scoped>
.opacity2 {
  opacity: 0.2;
}
</style>
