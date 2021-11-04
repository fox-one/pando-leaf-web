<template>
  <div>
    <div class="py-2" v-if="loading && meta.vault">
      <f-loading :loading="loading"></f-loading>
    </div>

    <div v-else>
      <generate-form :vault="meta.vault" :debt-amount.sync="amount" />

      <div class="greyscale_6" style="height: 8px"></div>

      <generate-prediction class="pa-4" :vault="meta.vault" :amount="amount" />

      <div style="height: 80px"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GenerateForm from "@/components/vault/generate/GenerateForm.vue";
import GeneratePrediction from "@/components/vault/generate/GeneratePrediction.vue";
import mixins from "@/mixins";
import { Call, Get } from "vuex-pathify";

@Component({
  components: {
    GenerateForm,
    GeneratePrediction,
  },
})
class VaultGeneratePage extends Mixins(mixins.page) {
  @Get("vault/getVaultById") getVault;

  @Call("vault/loadVaults") loadVaults;

  loading = true;

  amount = "";

  get appbar() {
    return {
      back: true,
      align: "center",
    };
  }

  get title() {
    return this.$t("form.title.generate");
  }

  get meta() {
    const vaultId = this.$route.query["id"];
    return {
      vaultId,
      vault: this.getVault(vaultId),
    };
  }

  mounted() {
    if (!this.meta.vaultId) {
      this.$uikit.toast.error({
        message: "Vault ID not found.",
      });
      this.$router.replace("/");
    }
    this.refresh();
  }

  async refresh() {
    await this.$utils.app.refresh(this);
    this.loading = false;
  }
}
export default VaultGeneratePage;
</script>
