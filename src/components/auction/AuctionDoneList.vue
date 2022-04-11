<template>
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
    />
  </base-pagination-list>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import AuctionsListItem from "./AuctionsListItem.vue";
import BasePaginationList from "@/components/base/PaginationList.vue";
import { Get, Sync } from "vuex-pathify";

@Component({
  components: {
    AuctionsListItem,
    BasePaginationList,
  },
})
export default class AuctionsDoneList extends Vue {
  @Get("auctions/done@flips") dataset!: API.Flip[];

  @Get("auctions/done@total") total!: number;

  @Get("auctions/done@params.limit") limit!: number;

  @Sync("auctions/done@params.offset") offset!: number;

  @Sync("auctions/done@loading") loading!: boolean;

  error = false;

  page = 1;

  get pages() {
    return Math.ceil(this.total / this.limit);
  }

  @Watch("page")
  onPageChanged(newVal) {
    this.offset = (newVal - 1) * this.limit;
    console.log("bindPage:", newVal);
    this.requestLoadMore();
  }

  mounted() {
    this.resetData();
  }

  async resetData() {
    if (this.loading) return;

    try {
      await this.$store.dispatch("auctions/resetDone", {
        withLoading: true,
      });
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
      this.error = true;
      this.loading = false;
    }
  }

  async requestLoadMore(withLoading = true) {
    if (this.loading) return;
    try {
      await this.$store.dispatch("auctions/refreshDone", { withLoading });
    } catch (error) {
      console.log(error);
      this.$utils.helper.errorHandler(this, error);
      this.error = true;
      this.loading = false;
    }
  }
}
</script>
