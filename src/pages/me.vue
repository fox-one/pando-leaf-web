<template>
  <v-container class="pa-0" fluid>
    <v-layout column fill-height class="pa-0 custom-info-grid">
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
      <v-layout justify-space-between>
        <v-layout v-if="isLogged" column class="pa-4 f-bg-greyscale-7">
          <div class="f-caption f-greyscale-3">
            {{ $t("me.total-collaterals") }}
          </div>
          <h2>{{ total.collaterals }}</h2>
        </v-layout>
        <v-layout
          v-if="isLogged"
          column
          class="pa-4 f-bg-greyscale-7 text-right"
        >
          <div class="f-caption f-greyscale-3">{{ $t("me.total-debts") }}</div>
          <h2>{{ total.debts }}</h2>
        </v-layout>
      </v-layout>

      <v-container v-if="isLogged && !haveVault" fill-height>
        <v-layout column align-center justify-center>
          <h3 class="f-greyscale-2">{{ $t("me.no-vault-1") }}</h3>
          <p class="mx-4 mt-2 text-center">
            {{ $t("me.no-vault-2") }}
          </p>
          <v-btn
            class="mt-4"
            color="primary"
            @click="generateVault"
            :min-width="220"
            rounded
            depressed
          >
            <span>{{ $t("me.no-vault-button") }}</span>
          </v-btn>
        </v-layout>
      </v-container>
      <div v-if="isLogged && haveVault" class="px-4 pt-4">
        <v-expansion-panels accordion flat>
          <my-vault-item
            class="mb-4 rounded-lg"
            :key="vault.id"
            v-for="vault in myVaults"
            :vault="vault"
          ></my-vault-item>
        </v-expansion-panels>
      </div>
    </v-layout>
  </v-container>
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
    if (!this.isLogged) {
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

  get total() {
    if (this.myVaults.length === 0)
      return {
        collaterals: "$0.00",
        debts: "$0.00",
      };
    let col = 0;
    let dai = 0;
    this.myVaults.forEach((v) => {
      const collateral = this.getCollateral(v.collateral_id);
      const colAsset = this.getAssetById(collateral?.gem);
      const colAmount = Number(v.ink || "0");
      const daiAmount = Number(v.art || "0") * Number(collateral.rate || "1");
      const colPrice = Number(colAsset?.price || "0");
      const daiAsset = this.getAssetById(collateral?.dai);
      const daiPrice = Number(daiAsset?.price || "0");
      col += colAmount * colPrice;
      dai += daiAmount * daiPrice;
    });
    return {
      collaterals: `$${this.$utils.number.toShort(col)}`,
      debts: `$${this.$utils.number.toShort(dai)}`,
    };
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

<style lang="scss" scoped>
.custom-info-grid {
  overflow: hidden;
  ::v-deep {
    .f-info-grid {
      .f-info-grid-inner {
        width: calc(100vw - 32px) !important;
        .f-info-grid-item {
          width: calc(50vw - 16px);
        }
      }
    }
  }
}
</style>
