<template>
  <base-connect-wallet-btn>
    <f-button
      :disabled="confirmDisabled"
      color="primary"
      style="height: 48px"
      @click="bidding"
      class="mt-8 mb-4 px-8 align-self-center"
    >
      {{ $t("auction.button.confirm") }}
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

  meetCollateral(val) {
    return +val <= +this.meta.maxBid;
  }

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { debtAsset, isStage2, maxBid } = getters.getFlipFields(this.flip);

    let confirmDisabled = true;
    if (this.meta.isStage2) {
      confirmDisabled = !this.amount || !this.meetCollateral(this.amount);
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

  bidding() {
    this.stage2Confirm();
  }

  // 拍卖第一阶段 付款为输入金额，拍卖第二阶段，付款为总债务数额
  // 第二阶段才需要在parameter上附带 decimal 和 amount
  async stage2Confirm() {
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
    try {
      await this.$utils.payment.requestPayment(this, request, {
        success: () => this.$emit("success"),
      });
    } catch (error: any) {
      // handle error
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.input-collateral {
  width: 100%;
}
</style>
