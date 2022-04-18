<template>
  <div class="list-wrapper">
    <div class="data-list">
      <slot />

      <div class="text-secondary caption text-center pa-5">
        <slot v-if="loading" class="d-flex justify-center pa-5" name="loading">
          <f-loading size="28" color="primary" />
        </slot>

        <slot
          v-else-if="error"
          name="error"
          class="d-flex caption error--text justify-center pa-5"
        >
          {{ $t("error") }}
        </slot>

        <div
          v-else-if="!empty"
          class="empty-hint text-secondary caption text-center pa-5"
        >
          <slot v-if="filter" name="filter">{{ $t("not-found") }}</slot>
          <slot v-else name="empty">
            {{ hint || $t("common.no-data") }}
          </slot>
        </div>
      </div>
    </div>

    <div class="bottom-bar" v-if="pages !== 0">
      <f-divider class="mx-n4" />

      <div class="pagination-wrapper">
        <v-pagination
          v-model="bindPage"
          :length="pages"
          next-icon="$FIconChevronRight"
          prev-icon="$FIconChevronLeft"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";

@Component
export default class PaginationList extends Vue {
  @Prop({ type: Array, default: [] }) data!: unknown[];

  @Prop({ type: Boolean, default: false }) loading!: boolean;

  @Prop({ type: Boolean, default: false }) error!: boolean;

  @Prop({ type: Boolean, default: false }) ended!: boolean;

  @Prop({ type: String, default: "" }) hint!: string;

  @Prop({ type: String, default: "" }) filter!: string;

  @Prop({ type: Number, default: 1 }) pages!: number;

  @PropSync("page", { type: Number, default: 1 }) bindPage!: number;

  get disabled() {
    return this.loading || this.ended || this.error;
  }

  get empty() {
    const len = this.data?.length ?? 0;
    return len > 0;
  }
}
</script>

<style lang="scss" scoped>
.list-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  position: relative;
  margin-bottom: 64.5px;
}

.bottom-bar {
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  bottom: calc(66px + env(safe-area-inset-bottom));
  width: 100%;
  padding: 2px;
  padding-top: 0px;
  background-color: var(--v-greyscale_7-base);

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    width: calc(100vw - 4px);
    max-width: calc(100vw - 4px);
  }
}
</style>
