<template>
  <f-segment-control
    v-model="bindValue"
    borderless
    mandatory
    active-class="primary"
    class="durations"
  >
    <f-button
      v-for="(item, index) in items"
      :key="index"
      :ripple="false"
      :value="item.value"
    >
      <span>{{ item.text }}</span>
    </f-button>
  </f-segment-control>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from "vue-property-decorator";
import { getDurationMeta } from "@/enums";

@Component
class DurationSelect extends Vue {
  @PropSync("value") bindValue;

  durations: API.Duration[] = ["week", "month", "year"];

  get items() {
    return this.durations.map((x) => {
      const meta = getDurationMeta(x);
      return {
        value: x,
        text: this.$t(meta.text),
      };
    });
  }
}
export default DurationSelect;
</script>

<style lang="scss" scoped>
.f-segment-control {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: var(--v-forth-base) !important;
}
</style>
