<template>
  <v-layout column fill-height class="pa-0">
    <v-btn
      v-if="!isLogged"
      rounded
      large
      block
      depressed
      color="primary"
      @click="handleLogin"
    >
      {{ $t("connect.wallet") }}
    </v-btn>
    <v-layout v-if="isLogged" column class="pa-4 f-bg-greyscale-7">
      <div class="f-caption f-greyscale-3">Total Vault Collateral Balance</div>
      <h2>{{ totalVaultsBalance }}</h2>
    </v-layout>

    <v-container v-if="isLogged && !haveVault" fill-height>
      <v-layout column align-center justify-center>
        <h3 class="f-greyscale-2">You haven't any Vault yet.</h3>
        <p class="mx-4 mt-2 text-center">
          Open your first Vault to start generating Pando Assets.
        </p>
        <v-btn
          class="mt-4"
          color="primary"
          @click="generateVault"
          :min-width="220"
          rounded
          depressed
        >
          <span>Open a new Vault</span>
        </v-btn>
        <!-- <v-btn
          class="mt-4"
          color="primary"
          @click="mockVaults"
          :min-width="220"
          rounded
          depressed
          >Mock Vault</v-btn
        > -->
      </v-layout>
    </v-container>
    <div class="px-4 pt-4">
      <v-expansion-panels accordion flat>
        <my-vault-item
          class="mb-4 rounded-xl"
          :key="vault.id"
          v-for="vault in myVaults"
          :vault="vault"
        ></my-vault-item>
      </v-expansion-panels>
    </div>
    <v-layout column fill-height align-center>
      <v-btn
        v-if="haveVault && isLogged"
        class="mt-4 pb-20"
        color="primary"
        @click="refreshMyVaults"
        :min-width="220"
        rounded
        depressed
        >Refresh My Vaults</v-btn
      >
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import { Action, Getter, State } from "vuex-class";
import { IVault } from "~/services/types/vo";
import MyVaultItem from "~/components/particles/MyVaultItem.vue";

@Component({
  components: {
    MyVaultItem,
  },
})
export default class Me extends Mixins(mixins.page) {
  @State((state) => state.global.myVaults) myVaults!: IVault[];
  @Getter("auth/isLogged") isLogged!: boolean;
  @Getter("global/haveVault") haveVault!: boolean;
  @Getter("global/getCollateral") getCollateral;
  @Getter("global/getAssetById") getAssetById;
  @Action("global/syncMyVaults") syncMyVaults;

  loading = true;
  get title() {
    const s = this.$t("tab.me");
    return `${s}`;
  }

  get appbar() {
    if (this.isLogged) {
      return {
        back: false,
        avatar: false,
      };
    }
    return {
      back: false,
      customContent: true,
      avatar: true,
      mixinImmersive: true,
    };
  }

  get bottomNav() {
    return "me";
  }

  get totalVaultsBalance() {
    if (this.myVaults.length === 0) return "$0.00";
    let total = 0;
    this.myVaults.forEach((v) => {
      const collateral = this.getCollateral(v.collateral_id);
      const asset = this.getAssetById(collateral?.gem);
      const amount = Number(v.ink || "0");
      const price = Number(asset?.price || "0");
      total += amount * price;
    });
    return `$${this.$utils.number.toPrecision(total)}`;
  }

  mounted() {
    this.checkLogin();
    try {
      this.syncMyVaults();
    } catch (e) {
      this.loading = false;
    } finally {
      this.loading = false;
    }
  }

  checkLogin() {
    if (!this.isLogged) {
      this.$utils.helper.requestLogin(this);
    } else {
    }
  }

  handleLogin() {
    this.$utils.helper.requestLogin(this);
  }

  generateVault() {
    this.$router.push("/market");
  }

  refreshMyVaults() {
    this.syncMyVaults();
  }

  mockVaults() {
    this.$store.commit("global/SET_MY_VAULTS", [
      {
        id: "e40060ae-fb63-3b6b-8c17-72550ffa5a5d",
        created_at: "2021-03-03T08:56:34Z",
        collateral_id: "176f8903-27c4-5a47-aaf1-1a50b9d3e4e1",
        ink: "1", // Total Deposited
        art: "120", // Total Normalised Debt, debt = art * rate
      } as IVault,
    ]);
  }

  clearVaults() {
    this.$store.commit("global/SET_MY_VAULTS", []);
  }
}
</script>

<style></style>
