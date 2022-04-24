<template>
  <v-form ref="form">
    <base-form-input
      :amount.sync="inputDebtAmount"
      type="number"
      :label="meta.debtSymbol"
      :assets="[meta.debtAsset]"
      :asset.sync="meta.debtAsset"
      :selectable="false"
      hide-details
      fullfilled
      :placeholder="0"
      :fillable="false"
      :rules="rules"
    >
    </base-form-input>

    <auction-max-bid class="my-6" :flip="flip" :amount.sync="inputDebtAmount" />

    <auction-form-infos
      class="my-6"
      :amount="inputDebtAmount"
      :type="'debt'"
      :flip="flip"
    />

    <div class="my-6 tip greyscale_3--text">
      {{ $t("auction.rule.stage-price-end") }}
    </div>

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
import AuctionFormInfos from "./AuctionFormInfos.vue";
import BaseFormInput from "@/components/base/FormInput.vue";

@Component({
  components: {
    AuctionMinBid,
    AuctionMaxBid,
    AuctionDebtAction,
    AuctionFormInfos,
    BaseFormInput,
  },
})
export default class AuctionDebtForm extends Vue {
  @Prop() flip!: API.Flip;

  @Ref("form") form;

  inputDebtAmount = "";

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { toPercent } = this.$utils.number;
    const { isDone, debtSymbol, debtAsset, minBid, collateral, maxBid } =
      getters.getFlipFields(this.flip);

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
    };
  }

  get rules() {
    return [
      (val) =>
        +val >= +this.meta.minBid ||
        this.$t("auction.rule.stage-price-less-beg", {
          beg: this.meta.begText,
        }),
      (val) =>
        +val <= +this.meta.maxBid ||
        this.$t("auction.rule.stage-price-maximum", {
          amount: this.meta.maxBid,
          symbol: this.meta.debtSymbol,
        }),
    ];
  }

  handleSuccess() {
    this.form.reset();
    this.$emit("success");
  }
}
</script>

<style lang="scss" scoped>
.tip {
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
}
</style>
