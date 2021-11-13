<template>
  <base-connect-wallet-btn class="mt-8 mb-4 text-center">
    <f-button
      :disabled="meta.confirmDisabled"
      color="primary"
      @click="confirm"
      class="px-8"
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
export default class AuctionCollateralAction extends Vue {
  @Get("account/userId") user_id;

  @Prop() flip!: API.Flip;

  @Prop() amount!: string;

  loading = false;

  follow_id = "";

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { debtAsset, isStage2, maxBid } = getters.getFlipFields(this.flip);

    let confirmDisabled = true;
    if (this.meta.isStage2) {
      const meetCollateral = +this.amount <= +maxBid;
      confirmDisabled = !this.amount || !meetCollateral;
    }

    return {
      debtAsset,
      isStage2,
      maxBid,
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
      amount: this.flip.tab,
      asset_id: this.meta.debtAsset?.id,
      parameters: [
        "bit",
        FlipRequestAction.FlipBid,
        "uuid",
        this.flip.id,
        "decimal",
        this.amount,
      ],
    } as API.ActionPayload;

    this.$utils.payment.requestPayment(this, request, {
      success: () => {
        (this.loading = false), this.$emit("success");
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.input-collateral {
  width: 100%;
}
</style>
