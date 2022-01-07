<template>
  <base-list-wrapper
    :data="dataset"
    :error="error"
    :loading="loading"
    @load="loadMore"
  >
    <auctions-list-item
      v-for="(item, index) in dataset"
      :key="index"
      :flip="item"
      class="mb-4 mx-4"
      @refresh="requestFlips()"
    />
    <template #empty> <empty-auctions-place-holder /> </template>
  </base-list-wrapper>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AuctionsListItem from "./AuctionsListItem.vue";
import EmptyAuctionsPlaceHolder from "./EmptyAuctionsPlaceHolder.vue";
import { Get, Sync } from "vuex-pathify";

@Component({
  components: {
    AuctionsListItem,
    EmptyAuctionsPlaceHolder,
  },
})
export default class AuctioningList extends Vue {
  @Get("auctions/flipsAuctioning") dataset!: API.Flip[];

  @Sync("auctions/loading") loading!: boolean;

  @Sync("auctions/hasNext") hasNext!: boolean;

  error = false;

  intervalId: any = null;

  mounted() {
    this.requestFlips();
    this.intervalId = setInterval(() => {
      this.requestFlips(false);
    }, 5000);
  }

  beforeDestroy() {
    clearInterval(this.intervalId);
  }

  async requestFlips(withLoading = true) {
    if (this.loading) return;
    try {
      await this.$store.dispatch("auctions/refresh", { withLoading });
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
      this.error = true;
      this.loading = false;
    }
  }

  loadMore() {
    if (this.dataset.length > 0 && this.dataset.length % 20 === 0) {
      this.requestLoadMore();
    }
  }

  async requestLoadMore() {
    if (this.loading || !this.hasNext) return;
    try {
      await this.$store.dispatch("auctions/loadMore");
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
      this.error = true;
      this.loading = false;
    }
  }
}
</script>
