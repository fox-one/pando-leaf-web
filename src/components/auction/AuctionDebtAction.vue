<template>
  <base-connect-wallet-btn class="mt-8 mb-4 text-center">
    <f-button
      class="px-8"
      color="primary"
      :loading="loading"
      :disabled="meta.confirmDisabled"
      @click="confirm"
    >
      {{ $t("auction.bid-now") }}
    </f-button>
  </base-connect-wallet-btn>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import { Get } from "vuex-pathify";
import { FlipRequestAction } from "~/enums";

@Component({
  components: {},
})
export default class AuctionDebtAction extends Vue {
  @Get("account/userId") user_id;

  @Prop() flip!: API.Flip;

  @Prop() amount!: string;

  follow_id = "";

  loading = false;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { isStage1, debtAsset, minBid, maxBid } = getters.getFlipFields(
      this.flip
    );

    let confirmDisabled = true;
    if (isStage1) {
      const meetDebt = +this.amount >= +minBid && +this.amount <= +maxBid;
      confirmDisabled = !this.amount || !meetDebt;
    }

    return {
      isStage1,
      minBid,
      maxBid,
      debtLogo: debtAsset?.logo,
      debtAsset,
      confirmDisabled,
    };
  }

  mounted() {
    this.follow_id = this.$utils.helper.uuidV4();
  }

  // 拍卖第一阶段 付款为输入金额，拍卖第二阶段，付款为总债务数额
  // 第二阶段才需要在parameter上附带 decimal 和 amount
  confirm() {
    if (this.loading) return;
    this.loading = true;

    this.follow_id = this.$utils.helper.uuidV4();
    const request = {
      user_id: this.user_id,
      follow_id: this.follow_id,
      amount: this.amount,
      asset_id: this.meta.debtAsset?.id,
      parameters: [
        "bit",
        FlipRequestAction.FlipBid,
        "uuid",
        this.flip.id,
        "decimal",
        this.flip.lot,
      ],
    } as API.ActionPayload;

    this.$utils.payment.requestPayment(this, request, {
      success: () => {
        this.loading = false;
        this.$emit("success");
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.input-debt {
  width: 100%;
}
</style>