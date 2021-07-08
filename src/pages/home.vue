<template>
  <v-container class="pa-0 f-bg-greyscale-7" style="height: 100%">
    <v-layout column fill-height class="pa-0">
      <div class="py-2" v-if="loading">
        <f-loading :loading="loading"></f-loading>
      </div>
      <!-- 授权登陆按钮 -->
      <v-layout
        v-if="!isLogged"
        style="height: 88%"
        align-center
        justify-center
        column
      >
        <div class="f-greyscale-1 f-body-2 font-weight-medium mb-3">
          {{ $t("connect.wallet.hint") }}
        </div>
        <base-connect-wallet-btn
          rounded
          large
          depressed
          color="primary"
          @click="handleLogin"
        >
          {{ $t("connect.wallet") }}
        </base-connect-wallet-btn>
      </v-layout>
      <!-- no vault -->
      <v-layout
        v-if="isLogged && !haveVault"
        style="height: 100%"
        column
        align-center
        justify-center
      >
        <v-icon class="mb-8" size="110">$iconNoVault</v-icon>
        <h3 class="f-greyscale-2">{{ $t("me.no-vault-1") }}</h3>
        <f-button
          class="mt-4"
          color="primary"
          @click="openNewVault"
          :min-width="220"
          rounded
          depressed
        >
          <span>{{ $t("me.no-vault-button") }}</span>
        </f-button>
      </v-layout>

      <v-container column justify-center v-if="isLogged && haveVault">
        <!-- 总计card -->
        <total-card />

        <v-layout align-center class="mt-8 mb-2 mx-1 f-greyscale-1 f-title-1">
          My Vault
          <base-tooltip
            class="ml-1"
            hint="Pando leaf is product description product description product
            description product description"
          >
          </base-tooltip>
        </v-layout>

        <!-- vault list -->
        <v-row no-gutters>
          <v-col
            xs="12"
            sm="12"
            md="6"
            class="d-flex justify-center"
            :key="vault.id"
            v-for="vault in sortedMyVaults"
          >
            <my-vault-item
              class="leaf-card mt-4 rounded-lg sm-6 xs-12 mx-1 flex-grow-1"
              :vault="vault"
            ></my-vault-item>
          </v-col>
          <v-col
            xs="12"
            sm="12"
            md="6"
            class="d-flex mt-4 mx-1 justify-center f-bg-greyscale-7 add-new-vault"
          >
            <div class="add-new-vault-text f-body-2 f-greyscale-3">
              Need more vault?
            </div>
            <f-button class="my-8" @click="openNewVault"
              ><v-icon size="16">{{ $icons.mdiPlus }}</v-icon
              >{{ $t("vault.selector.title") }}</f-button
            >
          </v-col>
        </v-row>
      </v-container>
      <div style="height: 60px"></div>
      <div class="version-block f-caption text--secondary">
        {{ version }}
      </div>
    </v-layout>
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
import TotalCard from "@/components/particles/TotalCard.vue";
import WelcomeModal from "@/components/particles/WelcomeModal.vue";
import CollateralsRatio from "@/components/charts/CollateralsRatio.vue";
import { VERSION } from "~/constants";

@Component({
  components: {
    MyVaultItem,
    MarketSelectModal,
    WelcomeModal,
    TotalCard,
    CollateralsRatio,
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
        customContent: true,
        mixinImmersive: this.$utils.helper.isMixin(),
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
.add-new-vault {
  flex-direction: column;
  align-items: center;
  @media only screen and (min-width: 960px) {
    align-items: center;
    height: 342px;
    border: 1px dashed #cccccc;
    border-radius: 8px;
    max-width: calc(50% - 8px);
  }
  .add-new-vault-text {
    @media only screen and (max-width: 959px) {
      display: none;
    }
  }
}
</style>
