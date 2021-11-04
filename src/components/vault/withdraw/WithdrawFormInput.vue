<template>
  <div>
    <f-asset-amount-input
      class="no-left-padding"
      v-model="bindAmount"
      :assets="[meta.collateralAsset]"
      :asset.sync="meta.collateralAsset"
      :selectable="false"
      :rules="rules"
      :placeholder="meta.placeholder"
      :readonly="false"
      hide-message
    >
      <template #tools>
        <form-input-tools
          :left-label="$t('common.collateral')"
          :balance="meta.balance"
          :messages="meta.messages"
          @fill="handleFill"
        />
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

  @Prop() vault!: API.Vault;

  @Prop({ default: null }) asset!: API.Asset;

  @Prop({ default: null }) messages;

  rules: any[] = [];

  get meta() {
    const { format } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;
    const {
      collateralAsset,
      avaliableWithdraw,
      collateralSymbol,
    } = getters.getVaultFields(this.vault?.id);
    const validateMessage = this.validate();

    const messages = this.messages
      ? this.messages
      : validateMessage !== true
      ? validateMessage
      : null;
    const avaliableWithdrawText = format({
      n: avaliableWithdraw,
      dp: 8,
      mode: BigNumber.ROUND_DOWN,
    });

    const balance = `${avaliableWithdrawText} ${collateralSymbol}`;

    return {
      collateralAsset,
      balance,
      avaliableWithdraw,
      avaliableWithdrawText,
      placeholder: this.$t("form.hint.payback-amount"),
      messages,
    };
  }

  handleConnectWallet() {
    this.$utils.account.openAuth(this);
  }

  handleFill() {
    this.bindAmount =
      this.meta.avaliableWithdraw > 0 ? this.meta.avaliableWithdrawText : "";
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
