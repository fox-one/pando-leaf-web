<template>
  <base-list-wrapper
    :data="events"
    :error="error"
    :loading="loading"
    @load="requestVaultEvents"
  >
    <vault-history-item
      v-for="(item, index) in events"
      :key="index"
      :event="item"
    />
  </base-list-wrapper>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import VaultHistoryItem from "./VaultHistoryItem.vue";

@Component({
  components: {
    VaultHistoryItem,
  },
})
class VaultHistory extends Vue {
  @Prop() id!: string;

  cursor = "";

  events: API.VaultEvent[] = [];

  error = false;

  loading = false;

  hasNext = true;

  async requestVaultEvents() {
    if (!this.hasNext || this.loading) return;

    this.loading = true;
    try {
      const params: API.PaginationParams = {
        cursor: this.cursor,
        limit: 20,
      };
      const resp = await this.$http.getVaultEvents(this.id, params);

      this.cursor = resp.pagination?.next_cursor ?? "";
      this.hasNext = resp.pagination?.has_next ?? false;
      this.events = resp.events;
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
      this.error = true;
    }
    this.loading = false;
  }
}
export default VaultHistory;
</script>
