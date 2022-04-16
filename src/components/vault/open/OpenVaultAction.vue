<template>
  <base-bottom-action-bar>
    <base-connect-wallet-btn class="pa-4" block>
      <v-layout>
        <f-button fab elevation="0" class="greyscale_6" @click="handleBack">
          <v-icon style="transform: rotateY(180deg)">$FIconArrowRight4P</v-icon>
        </f-button>

        <f-button
          :disabled="disabled"
          :loading="loading"
          color="primary"
          @click="handleConfirm"
          style="flex: 1 0 auto; margin-left: 16px"
        >
          {{ $t("form.button.deposit-to-generate") }}
        </f-button>
      </v-layout>
    </base-connect-wallet-btn>
  </base-bottom-action-bar>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import { Get } from "vuex-pathify";
import { EVENTS } from "~/constants";

@Component({
  components: {},
})
export default class OpenVaultAction extends Vue {
  @Get("account/userId") user_id;

  @Prop() collateral!: API.Collateral;

  @Prop() deposit!: string;

  @Prop() mint!: string;

  @Prop({ default: false }) disabled!: boolean;

  loading = false;

  follow_id = "";

  mounted() {
    this.follow_id = this.$utils.helper.uuidV4();
  }

  handleBack() {
    this.$emit("back");
  }

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;

    const depositNum = Number(this.deposit);
    const mintNum = Number(this.mint);

    const { collateralizationRatio } = getters.openVaultPrediction(
      depositNum,
      mintNum,
      this.collateral
    );

    const ratio = collateralizationRatio;

    const timer = Math.round(
      +(this.collateral?.mat ?? 0) * 100 - ratio * 100 + 60
    );
    const isHighRisk = (ratio - +(this.collateral?.mat ?? 0)) * 100 < 61;
    return {
      ratio,
      timer,
      isHighRisk,
    };
  }

  handleConfirm() {
    if (this.meta.isHighRisk) {
      this.$root.$emit(EVENTS.OPEN_RISK_WARN, {
        risk: this.meta.ratio,
        timer: this.meta.timer,
        action: {
          text: this.$t("common.continue"),
          callback: () => this.confirm(),
        },
      });
    } else {
      this.confirm();
    }
  }

  async confirm() {
    if (this.loading) return;

    this.loading = true;
    this.follow_id = this.$utils.helper.uuidV4();

    const request = {
      user_id: this.user_id,
      follow_id: this.follow_id,
      amount: this.deposit,
      asset_id: this.collateral?.gem,
      parameters: [
        "bit",
        "31",
        "uuid",
        this.collateral?.id,
        "decimal",
        this.mint,
      ],
    } as API.ActionPayload;

    try {
      await this.$utils.payment.requestPayment(this, request, {
        success: () => {
          this.loading = false;
          this.$emit("success");
        },
        error: () => {
          this.loading = false;
        },
      });
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
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
