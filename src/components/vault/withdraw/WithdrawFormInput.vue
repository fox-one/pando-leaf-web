<template>
  <v-form ref="form" autocomplete="off">
    <f-asset-amount-input
      class="no-left-padding"
      v-model="bindAmount"
      :assets="[meta.collateralAsset]"
      :asset.sync="meta.collateralAsset"
      :selectable="false"
      :rules="rules"
      :placeholder="meta.placeholder"
      :readonly="false"
    >
      <template #tools>
        <form-input-tools
          :left-label="$t('common.collateral')"
          :balance="meta.balance"
          @fill="handleFill"
        />
      </template>
    </f-asset-amount-input>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync, Ref } from "vue-property-decorator";
import FormInputTools from "@/components/base/FormInputTools.vue";
import BigNumber from "bignumber.js";
import { RISK } from "~/enums";

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

  @Ref("form") form;

  get rules() {
    return [
      (v: string) => !!v || this.$t("common.amount-required"),
      (v: string) => +v > 0 || this.$t("common.amount-invalid"),
      (v: string) =>
        +v <= this.meta.avaliableWithdraw || this.$t("common.amount-invalid"),
      (v: string) => {
        if (this.meta.risk.value === RISK.HIGH) {
          if (this.meta.ratio < this.meta.liquidationRatio) {
            return this.$t("validate.below-liquidation-rate");
          }

          return this.$t("validate.high-risk-withdraw", {
            symbol: this.meta.collateralSymbol,
          });
        }
        return true;
      },
      (v: string) =>
        this.meta.risk.value !== RISK.MEDIUM ||
        this.$t("validate.medium-risk-withdraw", {
          symbol: this.meta.collateralSymbol,
        }),
    ];
  }

  get meta() {
    const { format } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;
    const {
      collateralAsset,
      avaliableWithdraw,
      collateralSymbol,
      collateralAmount,
      debtAmount,
      liquidationRatio,
      price,
    } = getters.getVaultFields(this.vault?.id);

    const avaliableWithdrawText = format({
      n: avaliableWithdraw,
      dp: 8,
      mode: BigNumber.ROUND_DOWN,
    });

    const balance = `${avaliableWithdrawText} ${collateralSymbol}`;

    const ratio = ((collateralAmount - +this.bindAmount) * price) / debtAmount;

    const risk = this.$utils.vault.getRiskLevelMeta(ratio, liquidationRatio);
    return {
      collateralAsset,
      balance,
      collateralSymbol,
      avaliableWithdraw,
      avaliableWithdrawText,
      placeholder: this.$t("form.payback-amount"),
      ratio,
      risk,
      liquidationRatio,
    };
  }

  getForm() {
    return this.form;
  }

  handleConnectWallet() {
    this.$utils.account.openAuth(this);
  }

  handleFill() {
    this.bindAmount =
      this.meta.avaliableWithdraw > 0 ? this.meta.avaliableWithdrawText : "";
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
