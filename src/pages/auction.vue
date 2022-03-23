<template>
  <v-container class="pa-0">
    <div class="py-2" v-if="loading">
      <f-loading :loading="loading"></f-loading>
    </div>

    <v-layout v-else column>
      <auction-form :flip="flip" />

      <f-divider v-if="!meta.isDone" class="mb-2"></f-divider>

      <auction-event-history :flip="flip" :flip-id="flipId" />

      <div style="height: 70px"></div>
    </v-layout>
  </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import AuctionDetail from "@/components/auction/AuctionDetail.vue";
import AuctionDoneDetail from "@/components/auction/AuctionDoneDetail.vue";
import AuctionEventHistory from "@/components/auction/AuctionEventHistory.vue";
import AuctionForm from "@/components/auction/AuctionForm.vue";
import { FlipAction } from "~/enums";

@Component({
  components: {
    AuctionDetail,
    AuctionDoneDetail,
    AuctionEventHistory,
    AuctionForm,
  },
})
export default class AuctionPage extends Mixins(mixins.page) {
  flip = {} as API.Flip;

  loading = false;

  get appbar() {
    return {
      align: "center",
      back: true,
    };
  }

  get flipId() {
    return this.$route.query["id"] as string;
  }

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const flipFields = getters.getFlipFields(this.flip);

    return {
      ...flipFields,
    };
  }

  intervalId = 0 as any;

  mounted() {
    this.requestFlip(true);
    this.intervalId = setInterval(() => {
      if (this.flip?.action === FlipAction.FlipDeal) {
        clearInterval(this.intervalId);
        return;
      }
      this.requestFlip();
    }, 3000);
  }

  beforeDestroy() {
    clearInterval(this.intervalId);
  }

  async requestFlip(withLoading = false) {
    this.loading = withLoading;
    try {
      const res = await this.$http.getFlip(this.flipId);
      this.flip = res;
    } catch (error) {
      this.loading = false;
    } finally {
      this.loading = false;
    }
  }

  get title() {
    return `${this.$t("common.auction-details")}`;
  }
}
</script>
