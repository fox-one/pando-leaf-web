<template>
  <div>
    <v-layout class="mt-4 ml-4">
      <auction-filters v-model="filters" @change="handleFilterChanged" />

      <my-bids />
    </v-layout>

    <base-pagination-list
      :data="dataset"
      :error="error"
      :loading="loading"
      :pages="pages"
      :page.sync="page"
    >
      <auctions-list-item
        v-for="(item, index) in dataset"
        :key="index"
        :flip="item"
        class="mb-4 mx-4"
        @refresh="requestLoadMore()"
      />
      <template #empty> <empty-auctions-place-holder /> </template>
    </base-pagination-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AuctionFilters from "./AuctionFilters.vue";
import AuctionsListItem from "./AuctionsListItem.vue";
import MyBids from "./MyBids.vue";
import EmptyAuctionsPlaceHolder from "./EmptyAuctionsPlaceHolder.vue";
import BasePaginationList from "@/components/base/PaginationList.vue";
import { Get, Sync } from "vuex-pathify";
import { FlipPhase } from "~/enums";

@Component({
  components: {
    AuctionFilters,
    AuctionsListItem,
    MyBids,
    EmptyAuctionsPlaceHolder,
    BasePaginationList,
  },
})
export default class AuctioningList extends Vue {
  @Get("auctions/ongoing@flips") dataset!: API.Flip[];

  @Get("auctions/ongoing@total") total!: number;

  @Get("auctions/ongoing@params.limit") limit!: number;

  @Sync("auctions/ongoing@params.offset") offset!: number;

  @Sync("auctions/ongoing@loading") loading!: boolean;

  error = false;

  intervalId: any = null;

  filters = `${FlipPhase.tend},${FlipPhase.dent}`;

  mounted() {
    this.requestLoadMore(true);
    this.intervalId = setInterval(() => {
      this.requestLoadMore();
    }, 5000);
  }

  beforeDestroy() {
    clearInterval(this.intervalId);
  }

  get pages() {
    return Math.ceil(this.total / this.limit);
  }

  get page() {
    return Math.ceil(this.offset / this.limit);
  }

  handleFilterChanged() {
    this.requestLoadMore(true);
  }

  async requestLoadMore(withLoading = false) {
    if (this.loading) return;

    try {
      await this.$store.dispatch("auctions/refreshOngoing", {
        withLoading,
      });
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
      this.error = true;
      this.loading = false;
    }
  }
}
</script>
