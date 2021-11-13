<template>
  <v-container class="pa-0">
    <div class="py-2" v-if="loading">
      <f-loading :loading="loading"></f-loading>
    </div>

    <v-layout v-else column>
      <auction-status :flip="flip" />

      <f-panel
        elevation="none"
        class="collateral mt-4 pa-4 no-border-radius greyscale_1--text"
      >
        <v-layout column>
          <auction-detail :flip="flip" />

          <f-divider class="my-4" />

          <auction-done-detail v-if="meta.isDone" :flip="flip" />

          <v-layout v-else column>
            <auction-rules :flip="flip" />

            <auction-debt-form v-if="meta.isStage1" :flip="flip" />

            <auction-collateral-form v-else-if="meta.isStage2" :flip="flip" />
          </v-layout>
        </v-layout>
      </f-panel>

      <div class="mt-2 greyscale_6" style="height: 8px"></div>

      <auction-event-history :flip="flip" :flip-id="flipId" />

      <div style="height: 70px"></div>
    </v-layout>
  </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import AuctionStatus from "@/components/auction/AuctionStatus.vue";
import AuctionRules from "@/components/auction/AuctionRules.vue";
import AuctionDetail from "@/components/auction/AuctionDetail.vue";
import AuctionDoneDetail from "@/components/auction/AuctionDoneDetail.vue";
import AuctionEventHistory from "@/components/auction/AuctionEventHistory.vue";
import AuctionDebtForm from "@/components/auction/AuctionDebtForm.vue";
import AuctionCollateralForm from "@/components/auction/AuctionCollateralForm.vue";
import { FlipAction } from "~/enums";

@Component({
  components: {
    AuctionStatus,
    AuctionRules,
    AuctionDetail,
    AuctionDoneDetail,
    AuctionEventHistory,
    AuctionDebtForm,
    AuctionCollateralForm,
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
