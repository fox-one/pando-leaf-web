<template>
  <v-form ref="form">
    <f-input
      v-model="inputDebtAmount"
      class="input-debt"
      type="number"
      :label="meta.debtSymbol"
      :rules="[meetDebt]"
    >
      <template #prepend>
        <f-mixin-asset-logo :size="24" :logo="meta.debtLogo" />
      </template>
    </f-input>

    <div class="ml-8 greyscale_3--text f-caption">
      {{ meta.inputFiatValue }}
    </div>

    <auction-min-bid :flip="flip" :debt-amount.sync="inputDebtAmount" />

    <auction-max-bid :flip="flip" :amount.sync="inputDebtAmount" />

    <auction-debt-action
      :amount="inputDebtAmount"
      :flip="flip"
      @success="handleSuccess"
    />
  </v-form>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop, Ref } from "vue-property-decorator";
import AuctionMinBid from "@/components/auction/AuctionMinBid.vue";
import AuctionMaxBid from "@/components/auction/AuctionMaxBid.vue";
import AuctionDebtAction from "./AuctionDebtAction.vue";

@Component({
  components: {
    AuctionMinBid,
    AuctionMaxBid,
    AuctionDebtAction,
  },
})
export default class AuctionDebtForm extends Vue {
  @Prop() flip!: API.Flip;

  @Ref("form") form;

  inputDebtAmount = "";

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { toPrecision, toPercent } = this.$utils.number;
    const {
      isDone,
      debtSymbol,
      debtAsset,
      minBid,
      collateral,
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
      begText: toPercent({
        n: +(collateral?.beg ?? "1.03") - 1,
      }),
      inputFiatValue: `≈ $${toPrecision({
        n: +debtPrice * +this.inputDebtAmount,
      })}`,
    };
  }

  meetDebt(val) {
    const isMeet = +val >= +this.meta.minBid && +val <= +this.meta.maxBid;
    return (
      isMeet ||
      this.$t("auction.rule.stage-price", {
        beg: this.meta.begText,
        amount: this.meta.maxBid,
        symbol: this.meta.debtSymbol,
      })
    );
  }

  handleSuccess() {
    this.form.reset();
    this.$emit("success");
  }
}
</script>

<style lang="scss" scoped>
.input-debt {
  width: 100%;
}
</style>
