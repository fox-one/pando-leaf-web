<template>
  <div>
    <f-asset-amount-input
      class="no-left-padding"
      v-model="bindAmount"
      :assets="[meta.debtAsset]"
      :asset.sync="meta.debtAsset"
      :selectable="false"
      :placeholder="meta.placeholder"
      :readonly="false"
      hide-message
    >
      <template #tools>
        <form-input-tools
          :left-label="$t('form.hint.set-max')"
          :balance="''"
          :messages="meta.messages"
          @fill="handleFill"
        >
          <template #right>
            <span class="greyscale_1--text f-caption">
              <span class="greysclae_3--text">
                {{ $t("form.info.wallet-balance") }}
              </span>
              {{ meta.debtAmount }}
            </span>
          </template>
        </form-input-tools>
      </template>
    </f-asset-amount-input>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import FormInputTools from "@/components/base/FormInputTools.vue";
import BigNumber from "bignumber.js";

@Component({
  components: {
    FormInputTools,
  },
})
export default class extends Vue {
  @PropSync("amount") bindAmount;

  @PropSync("shotTip") bindShowTip!: boolean;

  @Prop() vault!: API.Vault;

  @Prop({ default: null }) messages;

  rules: any[] = [];

  get meta() {
    const { format } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;
    const { debtAsset, debtAmount } = getters.getVaultFields(this.vault?.id);
    const validateMessage = this.validate();
    const messages = this.messages
      ? this.messages
      : validateMessage !== true
      ? validateMessage
      : null;

    return {
      debtAsset,
      debtAmount: format({ n: debtAmount, dp: 4, mode: BigNumber.ROUND_UP }),
      placeholder: this.$t("form.hint.payback-amount"),
      messages,
    };
  }

  handleConnectWallet() {
    this.$utils.account.openAuth(this);
  }

  handleFill() {
    this.bindShowTip = true;
    this.bindAmount = this.meta.debtAmount !== "-" ? this.meta.debtAmount : "";
  }

  validate() {
    for (let index = 0; index < this.rules.length; index++) {
      const rule = this.rules[index];
      const checked = rule(this.bindAmount);
      if (checked !== true) return checked;
    }
    return true;
  }
}
</script>

<style lang="scss" scoped>
.no-left-padding {
  ::v-deep {
    .v-input__append-inner {
      padding-left: 0px !important;
    }
  }
}
</style>
