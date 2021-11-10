<template>
  <f-panel elevation="none" class="pa-4 no-border-radius greyscale_1--text">
    <v-layout column>
      <auction-detail :flip="flip" />

      <f-divider class="my-4" />

      <auction-done-detail v-if="meta.isDone" :flip="flip" />

      <div v-else>
        <auction-rules :flip="flip" />

        <auction-debt-form v-if="meta.isStage1" />

        <auction-collateral-form v-else />
      </div>
    </v-layout>
  </f-panel>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import AuctionRules from "@/components/auction/AuctionRules.vue";
import AuctionDetail from "@/components/auction/AuctionDetail.vue";
import AuctionDoneDetail from "@/components/auction/AuctionDoneDetail.vue";
import AuctionDebtForm from "@/components/auction/AuctionDebtForm.vue";
import AuctionCollateralForm from "@/components/auction/AuctionCollateralForm.vue";

@Component({
  components: {
    AuctionRules,
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
