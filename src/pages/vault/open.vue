<template>
  <v-container class="pa-0">
    <open-app-bar :appbar="appbar" @change="handleCollateralChange" />

    <div class="py-2" v-if="loading && collateral">
      <f-loading :loading="loading"></f-loading>
    </div>

    <div v-else>
      <open-form
        :collateral="collateral"
        :deposit-amount.sync="depositAmount"
        :debt-amount.sync="debtAmount"
      />

      <div class="greyscale_6" style="height: 8px"></div>

      <open-vault-prediction
        class="pa-4"
        :collateral="collateral"
        :deposit-amount="depositAmount"
        :debt-amount="debtAmount"
      />
      <!-- 
      <risk-info
        v-model="showCModel"
        :custom-text="riskInfo"
        :custom-color="{
          continue: {
            btn_cancel: 'f-bg-greyscale-1',
          },
        }"
        :impact="`${(meta.collateralizationRatio * 100).toFixed(1)}%`"
        :countdown="countdown"
        @confirm="confirm"
        ref="riskInfo"
      /> -->

      <risk-warnings />

      <div style="height: 80px"></div>
    </div>
  </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import OpenAppBar from "@/components/vault/open/OpenAppBar.vue";
import OpenForm from "@/components/vault/open/OpenForm.vue";
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
  },
})
export default class GenerateVault extends Mixins(mixins.page) {
  @Get("collateral/getCollateralById") getCollateral;

  @Get("auth/isLogged") isLogged;

  loading = true;

  depositAmount = "";

  debtAmount = "";

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

  handleCollateralChange(item: API.Collateral) {
    this.collateral = item;
  }

  @Watch("collateral")
  onCollateralChange(newVal, oldVal) {
    if (newVal) this.loading = false;
    if (newVal?.id === oldVal?.id || newVal.id === this.queryId) return;
    this.$router.replace({
      query: {
        id: newVal.id,
      },
    });
  }

  intervalid = 0;
  mounted() {
    if (!this.queryId) {
      this.$uikit.toast.error({
        message: "Collateral ID not found.",
      });
      this.$router.replace("/");
    }
    this.collateral = this.getCollateral(this.queryId);

    this.riskInfo = {
      continue: {
        title: this.$t("risk-info.continue.title"),
        highlights: [
          this.$t("risk-info.continue.highlight-collateral-rate"),
          this.$t("risk-info.continue.highlight-liquidation-ratio"),
        ],
        btn_cancel: this.$t("risk-info.continue.btn-cancel"),
        btn_continue: this.$t("risk-info.continue.btn-continue"),
      },
      confirm: {
        title: this.$t("risk-info.confirm.title"),
        content: this.$t("risk-info.confirm.content"),
        btn_cancel: this.$t("risk-info.confirm.btn-cancel"),
        btn_confirm: this.$t("common.confirm"),
      },
    };
  }

  destroyed() {
    clearInterval(0);
    clearInterval(this.intervalid);
  }

  toast() {
    this.showSelectModal = !this.showSelectModal;
  }
}
</script>
<style lang="scss" scoped></style>
