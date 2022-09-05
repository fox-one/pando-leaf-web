<template>
  <v-col class="d-flex justify-space-between" v-bind="$attrs">
    <h3 :class="`market-item-label ${labelClass}`">
      <span class="mr-1"> {{ title }}</span>
      <base-tooltip v-if="hint" :hint="hint" :learn-more="learnMore" />
    </h3>

    <div :class="`market-item-value ${valueClass}`">
      {{ value }} {{ valueUnit }}
    </div>
  </v-col>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {},
})
export default class extends Vue {
  @Prop() labelClass!: string;

  @Prop() valueClass!: string;

  @Prop() title!: string;

  @Prop() value!: string;

  @Prop() valueUnit!: string;

  @Prop() hint?: string[] | string;

  @Prop() learnMore?: string;
}
</script>

<style lang="scss" scoped>
.market-item-label {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 13px;
  color: var(--v-greyscale_3-base);
}
.market-item-value {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 13px;
}
</style>
