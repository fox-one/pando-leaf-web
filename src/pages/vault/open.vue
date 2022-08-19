<template>
  <v-container class="pa-0">
    <open-app-bar
      :appbar="appbar"
      :step="currentStep"
      @change="handleCollateralChange"
    />

    <div class="py-2" v-if="loading && collateral">
      <f-loading :loading="loading"></f-loading>
    </div>

    <div v-else-if="currentStep === 1">
      <step-one-form
        :collateral.sync="collateral"
        :deposit-amount.sync="depositAmount"
        :debt-amount.sync="debtAmount"
        @next="handleNext"
      />

      <step-one-infomations
        class="pa-4 mt-n4"
        :collateral="collateral"
        :deposit-amount="depositAmount"
      />

      <f-divider class="mx-4" />

      <base-safety-warning />

      <f-divider class="mx-4" />

      <div style="height: 200px"></div>
    </div>

    <div v-else>
      <open-form
        :collateral="collateral"
        :deposit-amount.sync="depositAmount"
        :debt-amount.sync="debtAmount"
        @back="handleBackStep"
        @success="handleSuccess"
      />

      <open-vault-prediction
        class="pa-4 mt-n4"
        :collateral="collateral"
        :deposit-amount="depositAmount"
        :debt-amount="debtAmount"
      />

      <div style="height: 200px"></div>
    </div>
  </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import OpenAppBar from "@/components/vault/open/OpenAppBar.vue";
import OpenForm from "@/components/vault/open/OpenForm.vue";
import StepOneForm from "@/components/vault/open/StepOneForm.vue";
import StepOneInfomations from "@/components/vault/open/StepOneInfomations.vue";
import StepOneAction from "@/components/vault/open/StepOneAction.vue";
import RiskWarnings from "@/components/vault/open/RiskWarnings.vue";
import BaseFormInput from "@/components/base/FormInput.vue";
import OpenVaultPrediction from "@/components/vault/open/OpenVaultPrediction.vue";
import { Get } from "vuex-pathify";

@Component({
  components: {
    OpenAppBar,
    OpenForm,
    RiskWarnings,
    BaseFormInput,
    OpenVaultPrediction,
    StepOneForm,
    StepOneInfomations,
    StepOneAction,
  },
})
export default class GenerateVault extends Mixins(mixins.page) {
  @Get("collateral/getCollateralById") getCollateral;

  @Get("auth/isLogged") isLogged;

  loading = true;

  depositAmount = "";

  debtAmount = "";

  currentStep = 1;

  riskInfo = {
    continue: {},
    confirm: {},
  };

  showSelectModal = false;
  showCModel = false;
  collateral: API.Collateral | null = null;

  get appbar() {
    return {
      show: false,
      back: true,
      align: "center",
      customTitle: this.collateral?.name,
    };
  }

  get title() {
    const t = this.$t("title.open-a-new-vault", {
      name: this.collateral?.name,
    });
    return `${t}`;
  }

  get queryId() {
    return this.$route.query["id"];
  }

  handleNext() {
    this.currentStep = 2;
  }

  handleBackStep() {
    this.currentStep = 1;
    this.debtAmount = "";
  }

  handleSuccess() {
    this.currentStep = 1;
    this.depositAmount = "";
  }

  handleCollateralChange(item: API.Collateral) {
    this.collateral = item;
  }

  @Watch("collateral")
  onCollateralChange(newVal, oldVal) {
    if (newVal) this.loading = false;
    if (newVal?.id === oldVal?.id || newVal.id === this.queryId) return;
    this.$router.replace(
      this.localePath({
        query: {
          id: newVal.id,
        },
      })
    );
  }

  intervalid = 0;
  mounted() {
    if (!this.queryId) {
      this.$uikit.toast.error({
        message: "Collateral ID not found.",
      });
      this.$router.replace(this.localePath("/"));
    }
    this.collateral = this.getCollateral(this.queryId);
  }

  destroyed() {
    clearInterval(0);
    clearInterval(this.intervalid);
  }
}
</script>
<style lang="scss" scoped></style>
