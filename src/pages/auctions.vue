<template>
  <v-container>
    <div class="py-2" v-if="loading">
      <f-loading :loading="loading"></f-loading>
    </div>
    <div>
      <f-panel v-for="flip in flips" :key="flip.id" class="mb-4">
        {{ JSON.stringify(flip) }}
      </f-panel>
    </div>
  </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import { IFlip } from "~/services/types/vo";

@Component({
  components: {},
})
export default class MarketDetail extends Mixins(mixins.page) {
  loading = false;
  has_next = true;
  cursor = null as string | null;
  flips = [] as IFlip[];

  mounted() {
    this.requestFlips();
  }

  async requestFlips() {
    if (this.loading || !this.has_next) {
      return;
    }
    this.loading = true;
    try {
      const res = await this.$http.getFlips({
        limit: 20,
        cursor: this.cursor,
      });
      const flips = res?.data?.flips || [];
      this.flips = [...this.flips, ...flips];
      this.has_next = res?.data?.pagination?.has_next || false;
      this.cursor = res?.data?.pagination?.next_cursor || null;
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
    this.loading = false;
  }
}
</script>

<style></style>
