<template>
  <f-action-bar
    :elevation="2"
    fixed
    custom-content
    class="flex-grow-1"
    style="border-radius: 0 !important"
  >
    <base-connect-wallet-btn
      class="text-center"
      style="flex: 1 0 auto; width: 100%"
    >
      <f-button
        :disabled="disabled"
        :loading="loading"
        color="primary"
        @click="confirm"
        style="width: 100%"
      >
        {{ $t("form.button.deposit-to-generate") }}
      </f-button>
    </base-connect-wallet-btn>
  </f-action-bar>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import { Get } from "vuex-pathify";

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
