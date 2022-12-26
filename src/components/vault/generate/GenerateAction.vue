<template>
  <base-bottom-action-bar>
    <base-connect-wallet-btn class="pa-4" block>
      <f-button
        :disabled="disabled"
        :loading="loading"
        color="primary"
        style="width: 100%"
        @click="handleClick"
      >
        {{ $t("common.confirm") }}
      </f-button>
    </base-connect-wallet-btn>
  </base-bottom-action-bar>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import { Get } from "vuex-pathify";
import { ACTION_ASSET_ID, ACTION_ASSET_AMOUNT, EVENTS } from "~/constants";

@Component({
  components: {},
})
export default class GenerateAction extends Vue {
  @Get("account/userId") user_id;

  @Prop() vault!: API.Vault;

  @Prop() amount!: string;

  @Prop({ default: false }) disabled!: boolean;

  loading = false;

  follow_id = "";

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { debtAmount, collateralAmount, collateral, price } =
      getters.getVaultFields(this.vault?.id);
    const increasedDebt = Number(this.amount);

    const ratio =
      debtAmount + increasedDebt &&
      (collateralAmount * price) / (debtAmount + increasedDebt);
    const timer = Math.round(+(collateral?.mat ?? 0) * 100 - ratio * 100 + 60);
    const isHighRisk = (ratio - +(collateral?.mat ?? 0)) * 100 < 61;
    return {
      ratio,
      timer,
      isHighRisk,
    };
  }

  mounted() {
    this.follow_id = this.$utils.helper.uuidV4();
  }

  handleClick() {
    if (!this.$utils.payment.shouldGetMoreActionAsset(this)) {
      if (this.meta.isHighRisk) {
        this.$root.$emit(EVENTS.OPEN_RISK_WARN, {
          risk: this.meta.ratio,
          timer: this.meta.timer,
          action: {
            text: this.$t("common.continue"),
            callback: () => this.requestAction(),
          },
        });
      } else {
        this.requestAction();
      }
    }
  }

  async requestAction() {
    if (this.loading) return;

    this.loading = true;
    this.follow_id = this.$utils.helper.uuidV4();

    const request = {
      user_id: this.user_id,
      follow_id: this.follow_id,
      amount: ACTION_ASSET_AMOUNT + "",
      asset_id: ACTION_ASSET_ID,
      parameters: ["bit", "35", "uuid", this.vault.id, "decimal", this.amount],
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

<style lang="scss" scoped></style>
