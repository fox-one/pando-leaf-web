<template>
  <v-row class="pa-0" no-gutters>
    <v-col xs="12" sm="12" md="6" class="d-flex justify-center">
      <f-panel
        :class="`mt-2 mx-1 pa-0 leaf-card rounded-lg total-card main-card flex-grow-1 sm-6 xs-12 ${
          switchState ? 'opened-card' : 'closed-card'
        }`"
      >
        <v-icon v-if="!switchState" size="144" class="total-card-texture"
          >$iconTotalCardTexture</v-icon
        >
        <total-card-switch :enable.sync="switchState" class="total-switch" />
        <v-layout column class="ml-6 white--text">
          <div class="total-label f-body-2 mt-6">
            {{ $t("me.total-collaterals") }}
          </div>
          <div class="total-value mt-2">
            <span class="total-legal-symbol mr-1">$</span
            >{{ total.collaterals }}
          </div>
          <collaterals-ratio
            class="pt-5"
            v-if="switchState"
            :vaults="myVaults"
          />
          <div class="total-label f-body-2 mt-6">
            {{ $t("me.total-debts") }}
          </div>
          <div class="total-value mt-2">
            <span class="total-legal-symbol f-green mr-1">$</span
            >{{ total.debts }}
          </div>
        </v-layout>
      </f-panel>
    </v-col>
    <v-col class="extra-card" md="6">
      <f-panel
        class="mt-2 mx-1 pa-0 leaf-card rounded-lg total-card f-bg-greyscale-6 sm-6 xs-12"
      >
        <v-layout column class="f-greyscale-1 ml-6">
          <div class="f-body-2 mt-6">
            {{ $t("me.collaterals-ratio") }}
          </div>
          <collaterals-ratio
            class="mt-6"
            :vaults="myVaults"
            label-color="f-greyscale-1"
          />
          <div class="divider"></div>
        </v-layout>
      </f-panel>
    </v-col>
  </v-row>
</template>

<script lang="ts" scoped>
import { Vue, Component } from "vue-property-decorator";
import { Getter, State } from "vuex-class";
import { IVault } from "~/services/types/vo";
import CollateralsRatio from "@/components/charts/CollateralsRatio.vue";
import TotalCardSwitch from "@/components/particles/home/TotalCardSwitch.vue";
import { debounce } from "~/utils/helper";

@Component({
  components: {
    CollateralsRatio,
    TotalCardSwitch,
  },
})
export default class TotalCard extends Vue {
  @State((state) => state.global.myVaults) myVaults!: IVault[];
  @Getter("global/getCollateral") getCollateral;
  @Getter("global/getAssetById") getAssetById;

  switchState = false;
  restoreState = false;

  saveState() {
    if (window.innerWidth >= 960) {
      if (this.switchState) {
        this.restoreState = true;
        this.switchState = false;
      }
    } else {
      if (this.restoreState) {
        this.switchState = true;
        this.restoreState = false;
      }
    }
  }

  listener = debounce(this.saveState, 300);

  mounted() {
    addEventListener("resize", this.listener);
  }

  beforeDestroyed() {
    removeEventListener("resize", this.listener);
  }

  get total() {
    if (this.myVaults.length === 0)
      return {
        collaterals: "0.00",
        debts: "0.00",
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
      collaterals: `${this.$utils.number.toShort(col)}`,
      debts: `${this.$utils.number.toShort(dai)}`,
    };
  }
}
</script>

<style lang="scss" scoped>
.total-card {
  display: block;
  position: relative;
  @media only screen and (min-width: 960px) {
    height: 287px !important;
  }
  .total-card-texture {
    position: absolute;
    bottom: 0px;
    right: 0px;
  }
  .total-switch {
    display: none;
    @media only screen and (max-width: 959px) {
      display: block;
      position: absolute;
      margin: 0px;
      padding: 0px;
      right: 16px;
      top: 16px;
    }
  }
  .total-label {
    @media only screen and (min-width: 960px) {
      margin-left: 24px !important;
      margin-top: 48px !important;
    }
  }
  .total-value {
    display: flex;
    align-items: center;
    font-size: 25px;
    font-weight: 700;
    @media only screen and (min-width: 960px) {
      margin-left: 24px;
    }
    .total-legal-symbol {
      font-size: 16px;
      margin-top: -4px;
      color: #bbf50d;
    }
  }
}
.opened-card {
  height: 393px;
}
.closed-card {
  height: 204px;
}
.main-card {
  background-color: #333333 !important;
}
.extra-card {
  @media only screen and (max-width: 959px) {
    display: none;
  }
}
</style>
