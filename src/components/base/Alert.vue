<template>
  <article v-show="alert" class="pa-4 f-alert" :style="styles">
    <slot />
    <v-icon
      v-if="close"
      :color="colors[0]"
      class="f-alert__close"
      size="14"
      @click="alert = false"
    >
      $IconClose
    </v-icon>
  </article>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";

@Component
class Alert extends Vue {
  @Prop() type!: "error" | "warning";

  @Prop({ type: Boolean, default: false }) close!: boolean;

  @PropSync("show") alert!: boolean;

  get colors() {
    const theme = this.$vuetify.theme.currentTheme;
    const meta = {
      error: [theme.error, "rgba(244, 76, 76, 0.1)"],
      warning: [theme.warning, "rgba(252, 248, 240, 1)"],
    };

    return meta[this.type];
  }

  get styles() {
    return [{ color: this.colors[0], background: this.colors[1] }];
  }
}
export default Alert;
</script>

<style lang="scss" scoped>
.f-alert {
  position: relative;
  background-color: rgba(244, 76, 76, 0.1);
  border-radius: 8px;
  font-size: 14px;
  line-height: 17px;

  &__close {
    position: absolute;
    top: 6px;
    right: 6px;
    cursor: pointer;
  }
}
</style>
