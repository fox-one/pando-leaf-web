<template>
  <v-container class="pa-0" fluid>
    <v-layout column fill-height class="pa-0 custom-info-grid">
      <base-connect-wallet-btn
        v-if="!isLogged"
        rounded
        large
        depressed
        color="primary"
        @click="handleLogin"
      >
        {{ $t("connect.wallet") }}
      </base-connect-wallet-btn>
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
      <div class="py-2" v-if="loading">
        <f-loading :loading="loading"></f-loading>
      </div>
      <v-container v-if="isLogged && !haveVault" fill-height>
        <v-layout column align-center justify-center>
          <h3 class="f-greyscale-2">{{ $t("me.no-vault-1") }}</h3>
          <p class="mx-4 mt-2 text-center">
            {{ $t("me.no-vault-2") }}
          </p>
          <v-btn
            class="mt-4"
            color="primary"
            @click="openNewVault"
            :min-width="220"
            rounded
            depressed
          >
            <span>{{ $t("me.no-vault-button") }}</span>
          </v-btn>
        </v-layout>
      </v-container>
      <div v-if="isLogged && haveVault" class="px-4 pt-4">
        <v-expansion-panels accordion flat v-model="expanded" multiple>
          <my-vault-item
            class="mb-4 rounded-lg"
            :key="vault.id"
            v-for="vault in sortedMyVaults"
            :vault="vault"
          ></my-vault-item>
        </v-expansion-panels>
        <div style="height: 60px"></div>
        <div class="version-block f-caption text--secondary">{{ version }}</div>
      </div>
    </v-layout>
    <!-- <v-fab-transition> -->
    <v-btn
      class="custom-fab-btn rounded-circle"
      circle
      height="64"
      bottom
      right
      elevation="2"
      color="primary"
      @click="openNewVault"
    >
      <v-icon>{{ $icons.mdiPlus }}</v-icon>
    </v-btn>
    <!-- </v-fab-transition> -->
    <market-select-modal
      :show.sync="showSelectModal"
      v-on:update:current="onSelect"
    />
    <welcome-modal ref="welcome" />
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Ref, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { Action, Getter, Mutation, State } from "vuex-class";
import { ICollateral, IVault } from "~/services/types/vo";
import MyVaultItem from "~/components/particles/MyVaultItem.vue";
import MarketSelectModal from "~/components/particles/MarketSelectModal.vue";
import WelcomeModal from "@/components/particles/WelcomeModal.vue";
import { VERSION } from "~/constants";

@Component({
  components: {
    MyVaultItem,
    MarketSelectModal,
    WelcomeModal,
  },
})
export default class Me extends Mixins(mixins.page) {
  @State((state) => state.global.myVaults) myVaults!: IVault[];
  @State((state) => state.global.collaterals) collaterals!: ICollateral[];
  @State((state) => state.app.firstUsePandoLeaf) firstUsePandoLeaf;
  @Getter("global/haveVault") haveVault!: boolean;
  @Getter("global/getCollateral") getCollateral;
  @Getter("global/getAssetById") getAssetById;
  @Action("global/syncMyVaults") syncMyVaults;
  @Mutation("app/SET_FIRST_USE_PANDO_LEAF") setFirstUsePandoLeaf;
  @Ref("welcome") welcome;

  loading = true;
  expanded = [0];
  showSelectModal = false;
  collateral = {} as ICollateral;

  @Watch("expanded")
  onExpandedChange(nVal: any[], oVal: any[]) {
    if (
      nVal?.length === oVal?.length ||
      nVal?.length === 1 ||
      nVal?.length === 0
    )
      return;
    const filtered = nVal.filter((v) => !oVal.includes(v));
    this.expanded = filtered;
  }

  get title() {
    const s = this.$t("tab.home");
    return `${s}`;
  }

  get version() {
    return VERSION;
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
      mixinImmersive: this.$utils.helper.isMixin(),
    };
  }

  get sortedMyVaults() {
    const sorted = Object.assign([], this.myVaults) as IVault[];
    sorted.sort((a, b) => {
      const aRisk = this.getRisk(a);
      const bRisk = this.getRisk(b);
      if (!this.$utils.number.isValid(aRisk)) return 1;
      if (!this.$utils.number.isValid(bRisk)) return -1;
      return Number(aRisk) - Number(bRisk);
    });
    return sorted;
  }

  getRisk(vault: IVault) {
    const collateral = this.getCollateral(vault?.collateral_id) as ICollateral;
    const debtAmount =
      Number(vault?.art || "0") * Number(collateral?.rate || "1");
    const collateralAmount = Number(vault?.ink);
    const collateralizationRatio =
      (collateralAmount * Number(collateral?.price)) / debtAmount;
    const risk = collateralizationRatio / Number(collateral?.rate);
    return risk;
  }

  get bottomNav() {
    return "home";
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
      const daiAmount = Number(v.art || "0") * Number(collateral?.rate || "1");
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

  created() {
    if (this.$route.query["r"] === "auction") {
      if (this.$route.query["id"]) {
        this.$router.replace(`/auction?id=${this.$route.query["id"]}`);
      } else {
        this.$router.replace("/auctions");
      }
    }
  }

  mounted() {
    // this.checkLogin();
    this.loading = true;
    setTimeout(() => {
      console.log("isLogged:", this.isLogged);
      this.syncMyVaults()
        .then((res) => {
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    }, 200);
    if (this.firstUsePandoLeaf) {
      this.welcome.show();
      this.setFirstUsePandoLeaf(false);
    }
  }

  checkLogin() {
    if (!this.isLogged) {
      this.$utils.helper.requestLogin(this);
    } else {
      this.loading = true;
      this.syncMyVaults()
        .then((res) => {
          this.loading = false;
        })
        .catch((err) => {
          console.log(this.isLogged);
          this.loading = false;
        });
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

  openNewVault() {
    if (this.collaterals.length === 0) {
      this.$utils.helper.toast(this, {
        message: `${this.$t("tip.no-collaterals")}`,
      });
      return;
    }
    if (this.collaterals.length === 1) {
      this.$router.push(`/vault/open?id=${this.collaterals[0].id}`);
      return;
    }
    this.showSelectModal = true;
  }

  onSelect(col) {
    this.showSelectModal = false;
    this.$router.push(`/vault/open?id=${col.id}`);
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
.version-block {
  padding-bottom: constant(safe-area-inset-bottom) + 10px;
  padding-bottom: env(safe-area-inset-bottom) + 10px;
  text-align: center;
}
.custom-fab-btn {
  z-index: 2;
  position: fixed;
  bottom: 16px;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  right: 16px;
}
.fab-icon {
  height: 24px;
  align-self: center !important;
  justify-self: center !important;
}
</style>
