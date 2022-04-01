<template>
  <div class="filter-item" :class="[{ 'filter-item--inactive': !active }]">
    <v-icon v-if="active">$FIconDoneAFill</v-icon>
    <v-icon v-else>$FIconRadioOff</v-icon>
    <span>{{ item.text }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class AuctionFilterItem extends Vue {
  @Prop() item;

  @Prop() active;
}
</script>

<style lang="scss" scoped>
.filter-item {
  border-radius: 8px;
  padding: 12px 16px;
  font-weight: 500;
  background: var(--v-greyscale_6-base);
  border: 1px solid var(--v-greyscale_6-base);

  &--inactive {
    background: transparent;
    border: 1px solid var(--v-greyscale_6-base);
  }
}
</style>
