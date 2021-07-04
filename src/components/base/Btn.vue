<template>
  <v-btn rounded depressed height="56px" color="primary" :disabled="disabled">
    <div :class="textColor"><slot /></div>
  </v-btn>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";
import { State } from "vuex-class";

@Component
export default class Btn extends Vue {
  @State((state) => state.app.settings.dark) isDark;
  @Prop({ default: false }) disabled;

  get textColor() {
    return this.isDark ? "black--text" : "white--text";
  }
}
</script>

<style></style>
