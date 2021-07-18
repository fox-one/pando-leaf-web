<template>
  <base-list-wrapper :action="requestVaultEvents">
    <template v-slot:default="{ data }">
      <vault-history-item
        v-for="(item, index) in data"
        :key="index"
        :event="item"
      />
    </template>
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

  pagination: API.Pagination = {
    next_cursor: "",
    has_next: true,
  };

  async requestVaultEvents() {
    const params: API.PaginationParams = {
      cursor: this.pagination?.next_cursor ?? "",
      limit: 20,
    };
    const resp = await this.$http.getVaultEvents(this.id, params);

    this.pagination = resp.pagination;
    const has_next = resp.pagination?.has_next ?? false;
    return { data: resp.events, ended: !has_next };
  }
}
export default VaultHistory;
</script>
