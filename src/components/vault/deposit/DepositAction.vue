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
        style="width: 100%"
        @click="handleClick"
      >
        {{ $t("common.deposit") }}
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
export default class extends Vue {
  @Get("account/userId") user_id;

  @Prop() vault!: API.Vault;

  @Prop() amount!: string;

  @Prop({ default: false }) disabled!: boolean;

  loading = false;

  follow_id = "";

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { collateralAsset } = getters.getVaultFields(this.vault?.id);
    return {
      asset: collateralAsset,
    };
  }

  mounted() {
    this.follow_id = this.$utils.helper.uuidV4();
  }

  handleClick() {
    this.requestAction();
  }

  async requestAction() {
    if (this.loading) return;

    this.loading = true;
    this.follow_id = this.$utils.helper.uuidV4();

    const request = {
      user_id: this.user_id,
      follow_id: this.follow_id,
      amount: this.amount,
      asset_id: this.meta.asset?.id,
      parameters: ["bit", "32", "uuid", this.vault.id],
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
