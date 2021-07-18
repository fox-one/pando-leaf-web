<template>
  <div
    v-infinite-scroll="loadData"
    infinite-scroll-distance="10"
    infinite-scroll-disabled="disabled"
  >
    <slot :data="data" />

    <div class="text-secondary caption text-center pa-5">
      <slot v-if="loading" name="loading">
        <f-loading size="28" color="primary" />
      </slot>

      <slot v-else-if="error" name="error">
        {{ $t("error") }}
      </slot>

      <slot v-else-if="empty" name="empty" :filter="filter">
        {{ filter ? $t("not-found") : hint || $t("empty") }}
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class ListWapper extends Vue {
  @Prop({ type: Boolean, default: false }) filter!: boolean;

  @Prop({ type: String, default: "" }) hint!: string;

  @Prop({ type: Function }) action!: () => Promise<{
    data: unknown[];
    ended: boolean;
  }>;

  data: unknown[] = [];

  error = false;

  ended = false;

  loading = false;

  get disabled() {
    return this.loading || this.ended || this.error;
  }

  get empty() {
    return this.data.length === 0;
  }

  async loadData() {
    this.loading = true;
    try {
      console.log("load data", this.action, this.action());
      const { data, ended } = await this.action();
      console.log("after load data", data, ended);
      this.data = data;
      this.ended = ended;
    } catch (error) {
      this.error = true;
    }
    this.loading = false;
  }
}
export default ListWapper;
</script>
