<template>
  <f-panel elevation="none" class="pa-4 no-border-radius greyscale_1--text">
    <v-layout column>
      <auction-detail :flip="flip" />

      <auction-done-detail v-if="meta.isDone" :flip="flip" />

      <div v-else>
        <f-divider size="8" opacity="0.05" class="mx-n4 mb-6" />

        <auction-debt-form v-if="meta.isStage1" :flip="flip" />

        <auction-collateral-form v-else :flip="flip" />

        <f-divider size="8" opacity="0.05" class="mx-n4 mt-6 mb-4" />
      </div>
    </v-layout>
  </f-panel>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import AuctionDetail from "@/components/auction/AuctionDetail.vue";
import AuctionDoneDetail from "@/components/auction/AuctionDoneDetail.vue";
import AuctionDebtForm from "@/components/auction/AuctionDebtForm.vue";
import AuctionCollateralForm from "@/components/auction/AuctionCollateralForm.vue";

@Component({
  components: {
    AuctionDetail,
    AuctionDoneDetail,
    AuctionDebtForm,
    AuctionCollateralForm,
  },
})
export default class AuctionPage extends Vue {
  @Prop() flip!: API.Flip;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { isDone, isStage1, isStage2 } = getters.getFlipFields(this.flip);

    return {
      isDone,
      isStage1,
      isStage2,
    };
  }
}
</script>
