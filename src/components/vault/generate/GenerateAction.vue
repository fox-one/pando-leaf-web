<template>
  <base-connect-wallet-btn class="mt-8 mb-4 text-center">
    <f-button
      :disabled="disabled"
      :loading="loading"
      color="primary"
      @click="handleClick"
      class="px-8"
    >
      {{ $t("form.generate.button.confirm") }}
    </f-button>
  </base-connect-wallet-btn>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import { Get } from "vuex-pathify";
import { ACTION_ASSET_ID } from "~/constants";

@Component({
  components: {},
})
export default class extends Vue {
  @Get("account/userId") user_id;

  @Prop() vault!: API.Vault;

  @Prop() amount!: string;

  @Prop({ default: false }) disabled!: boolean;

  loading = false;

  follow_id = "";

  mounted() {
    this.follow_id = this.$utils.helper.uuidV4();
  }

  handleClick() {
    if (!this.$utils.payment.shouldGetMoreActionAsset(this)) {
      this.requestAction();
    }
  }

  requestAction() {
    if (this.loading) return;
    this.loading = true;
    this.follow_id = this.$utils.helper.uuidV4();
    const request = {
      user_id: this.user_id,
      follow_id: this.follow_id,
      amount: "0.00000001",
      asset_id: ACTION_ASSET_ID,
      parameters: ["bit", "35", "uuid", this.vault.id, "decimal", this.amount],
    } as API.ActionPayload;

    try {
      this.$utils.payment.requestPayment(this, request, {
        success: () => {
          this.loading = false;
          this.$emit("success");
        },
        error: () => {
          this.loading = false;
        },
      });
    } catch (error) {
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
