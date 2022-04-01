<template>
  <f-bottom-sheet
    v-model="dialog"
    :title="$t('my-bids')"
    wapper-in-desktop="dialog"
  >
    <template #activator="{ on }">
      <div v-on="on" class="my-bids-activator ml-4">
        <v-icon size="16">$iconBids</v-icon>
        <span class="ml-1">My Bids</span>
      </div>
    </template>

    <div class="px-4 pb-6">
      <base-list-wrapper
        :data="dataset"
        :error="error"
        :loading="loading"
        @load="requestLoadMore"
      >
        <auctions-list-item
          v-for="(item, index) in dataset"
          :key="index"
          :flip="item"
          class="mb-4 mx-4"
          @refresh="requestLoadMore()"
        />

        <template #empty>
          <empty-auctions-place-holder class="mb-10" />
        </template>
      </base-list-wrapper>
    </div>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue, Model } from "vue-property-decorator";
import { FlipPhase } from "~/enums";
import AuctionsListItem from "./AuctionsListItem.vue";
import EmptyAuctionsPlaceHolder from "./EmptyAuctionsPlaceHolder.vue";

@Component({
  components: { AuctionsListItem, EmptyAuctionsPlaceHolder },
})
export default class MyBids extends Vue {
  dataset: API.Flip[] = [];

  dialog = false;

  error = false;

  loading = false;

  hasNext = true;

  mounted() {
    this.requestLoadMore();
  }

  requestLoadMore() {
    if (this.loading) return;
    this.loading = true;
    this.$http
      .queryFlips({
        limit: 20,
        offset: this.dataset.length,
        phase: FlipPhase.bid,
        my_bids: 1,
      })
      .then(({ flips, total }) => {
        this.dataset = this.dataset.concat(flips);
        this.hasNext = this.dataset.length < total;
        this.loading = false;
      })
      .catch(() => {
        this.error = true;
        this.loading = false;
      });
  }
}
</script>

<style lang="scss" scoped>
.my-bids-activator {
  display: inline-flex;
  flex: 0 1 auto;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 16px;
  height: 37px;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;

  background: var(--v-greyscale_6-base);
  border-radius: 53px;
}
</style>
