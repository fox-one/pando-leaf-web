<template>
  <div>
    <v-layout justify-start align-center>
      <f-mixin-asset-logo :size="24" :logo="meta.debtLogo" />
      <f-input
        v-model="inputDebtAmount"
        class="input-debt ml-2"
        type="number"
        :label="meta.debtSymbol"
        :rules="[meetDebt]"
      />
    </v-layout>

    <div class="mt-3 ml-8 greyscale_3--text f-caption">
      {{ meta.inputFiatValue }}
    </div>

    <auction-min-bid :flip="flip" :debt-amount.sync="inputDebtAmount" />

    <auction-max-bid :flip="flip" :amount.sync="inputDebtAmount" />

    <auction-debt-action
      :amount="inputDebtAmount"
      :flip="flip"
      @success="handleSuccess"
    />
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import AuctionMinBid from "@/components/auction/AuctionMinBid.vue";
import AuctionMaxBid from "@/components/auction/AuctionMaxBid.vue";
import AuctionDebtAction from "./AuctionDebtAction.vue";
import { Get } from "vuex-pathify";

@Component({
  components: {
    AuctionMinBid,
    AuctionMaxBid,
    AuctionDebtAction,
  },
})
export default class AuctionDebtForm extends Vue {
  @Get("account/userId") user_id;

  @Prop() flip!: API.Flip;

  inputDebtAmount = "";

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { toPrecision } = this.$utils.number;
    const {
      isDone,
      debtSymbol,
      debtAsset,
      minBid,
      maxBid,
      debtPrice,
    } = getters.getFlipFields(this.flip);

    return {
      isDone,
      debtLogo: debtAsset?.logo,
      debtSymbol,
      debtAsset,
      minBid,
      maxBid,
      inputFiatValue: `≈ $${toPrecision({
        n: +debtPrice * +this.inputDebtAmount,
      })}`,
    };
  }

  meetDebt(val) {
    const isMeet = +val >= +this.meta.minBid && +val <= +this.meta.maxBid;
    return isMeet;
  }

  handleSuccess() {
    this.$emit("success");
  }
}
</script>

<style lang="scss" scoped>
.input-debt {
  width: 100%;
}
</style>
