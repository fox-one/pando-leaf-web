<template>
  <v-container class="pa-0">
    <v-layout column class="ma-0 pa-4 f-bg-greyscale-7">
      <f-asset-amount-input
        class="mt-6"
        v-model="amount"
        :label="$t('form.hint.generate-amount')"
        :assets="[asset]"
        :asset.sync="asset"
        :selectable="false"
        :precision="precision"
      >
      </f-asset-amount-input>
      <div
        v-if="!isLogged"
        class="f-caption f-blue my-2 ml-4"
        @click="requestLogin"
      >
        {{ $t("connect.wallet") }}
      </div>
      <div v-else class="f-caption f-greyscale-3 my-2">
        {{ $t("form.info.max-available") }}
        <span> {{ maxAvailable }} </span>{{ assetSymbol }}
      </div>

      <percent-slider class="ma-4" :percent.sync="percent" />

      <f-tip :type="validate.type" v-if="validate.tip !== null">{{
        validate.tip
      }}</f-tip>
      <div class="my-8 text-center">
        <v-btn
          rounded
          depressed
          color="primary"
          height="56px"
          class="px-8"
          :disabled="validate.disabled"
          @click="requestConfirm"
          >{{ $t("form.generate.button.confirm") }}</v-btn
        >
      </div>
    </v-layout>

    <prediction
      class="my-4"
      :collateral="collateral"
      :vault="vault"
      :amount="amount"
      :type="vaultStatsType"
    ></prediction>

    <base-confirm-modal
      ref="cmodal"
      @confirm="confirm"
      :current-rate="this.meta.ratio * 100"
      :liquidation-rate="Number(this.collateral.mat) * 100"
    />

    <need-cnb-modal :visible.sync="needCnb" />
    <!-- <div class="mx-4 mt-4 risk-title f-caption">RISK WARNING</div>
    <div class="mx-4 f-caption">
      Price of the pair tokens fluctuates due to change in supply and demand of
      the tokens. Investors are expected to take caution and take full
      responsibilities of their own investment decisions.
    </div> -->
  </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins, Ref, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { IAsset, ICollateral, IVault } from "~/services/types/vo";
import { Action, Getter } from "vuex-class";
import VaultStats from "@/components/particles/VaultStats.vue";
import Prediction from "@/components/particles/Prediction.vue";
import PercentSlider from "@/components/particles/PercentSlider.vue";
import NeedCnbModal from "@/components/particles/NeedCnbModal.vue";
import BigNumber from "bignumber.js";
import { IActionsParams } from "~/services/types/dto";
import { RISK, TransactionStatus, VatAction } from "~/types";
import { ACTION_ASSET_ID } from "~/constants";
import { isDesktop } from "~/utils/helper";

@Component({
  components: {
    VaultStats,
    PercentSlider,
    NeedCnbModal,
    Prediction,
  },
})
export default class GenerateForm extends Mixins(mixins.page) {
  @Getter("global/getCollateral") getCollateral;
  @Getter("global/getAssetById") getAssetById;
  @Getter("global/getVault") getVault;
  @Getter("global/getWalletAssetById") getWalletAssetById;
  @Action("global/syncMyVaults") syncMyVaults;
  @Action("global/syncMarkets") syncMarkets;
  @Ref("cmodal") cmodal;

  vaultStatsType = VatAction.VatGenerate;
  collateral = {} as ICollateral;
  vault = {} as IVault;
  asset = {} as IAsset;
  amount = "";
  precision = 8;
  percent = 0;

  get appbar() {
    return {
      align: "center",
      back: true,
    };
  }

  get maxAvailable() {
    const debtAmount =
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1");
    const collateralAmount = Number(this.vault?.ink);
    const price = Number(this.collateral?.price);
    const mininumRatio = Number(this.collateral?.mat);
    const max =
      (collateralAmount * price) / mininumRatio - debtAmount - 0.00000001;
    const catMax = this.$utils.collateral.maxAvailable(this.collateral);
    return this.$utils.number.toPrecision(
      Math.min(max, catMax),
      8,
      BigNumber.ROUND_DOWN
    );
  }

  get assetSymbol() {
    return this.asset?.symbol || "";
  }

  get title() {
    const t = this.$t("form.title.generate");
    return `${t}`;
  }

  get vaultId() {
    return this.$route.query["id"];
  }

  get validate() {
    if (this.amount === "") {
      return {
        disabled: true,
        tip: null,
      };
    }
    if (Number(this.amount) <= 0) {
      return {
        disabled: true,
        type: "error",
        tip: this.$t("form.validate.amount-zero"),
      };
    }
    const debtAmount =
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1");
    const ma = Number(this.amount || "0");
    const max = this.$utils.collateral.maxAvailable(this.collateral);
    if (ma + debtAmount < Number(this.collateral.dust)) {
      // mint 小于最小值
      return {
        disabled: true,
        type: "error",
        tip: this.$t("form.validate.minimum-debt", {
          amount: this.collateral.dust,
          symbol: this.assetSymbol,
        }),
      };
    }
    if (ma > max) {
      // mint 大于最大值
      return {
        disabled: true,
        type: "error",
        tip: this.$t("form.validate.max-debt", {
          amount: this.$utils.number.toPrecision(max),
          symbol: this.assetSymbol,
        }),
      };
    }
    if (this.isLogged) {
      const risk = this.$utils.helper.riskLevel(
        this.meta.ratio,
        this.collateral.mat
      );
      switch (risk) {
        case RISK.HIGH:
          if (Number(this.meta.ratio) < Number(this.collateral.mat)) {
            // 抵押率低于清算线
            return {
              disabled: true,
              type: "error",
              tip: this.$t("form.validate.below-liquidation-rate"),
            };
          }
          // 抵押率高于清算线，处于高风险区间
          return {
            disabled: false,
            type: "error",
            tip: this.$t("form.validate.high-risk", {
              symbol: this.assetSymbol,
            }),
          };
        // 中风险区间
        case RISK.MEDIUM:
          return {
            disabled: false,
            type: "warning",
            tip: this.$t("form.validate.medium-risk", {
              symbol: this.assetSymbol,
            }),
          };
        // 低风险区间
        case RISK.LOW:
          return {
            disabled: false,
            type: "info",
            tip: null,
          };
        // 抵押率 N/A
        default:
          if (Number(this.meta.ratio) < 0) {
            return {
              disabled: true,
              type: "info",
              tip: null,
            };
          }
          return {
            disabled: true,
            type: "info",
            tip: null,
          };
      }
    }
    return {
      disabled: false,
      type: "info",
      tip: null,
    };
  }

  get meta() {
    const debtAmount =
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1");
    const collateralAmount = Number(this.vault?.ink);
    const liquidationRatio = Number(this.collateral?.mat);
    if (!Number(this.amount)) {
      const liquidationPrice =
        (debtAmount * liquidationRatio) / collateralAmount;
      const collateralizationRatio =
        (collateralAmount * Number(this.collateral?.price)) / debtAmount;
      return {
        price: this.$utils.number.toPrecision(liquidationPrice),
        ratio: collateralizationRatio,
        ratioText: this.$utils.number.toFixed(collateralizationRatio * 100, 2),
      };
    }
    const increasedDebt = Number(this.amount);
    const price =
      ((debtAmount + increasedDebt) * liquidationRatio) / collateralAmount;
    const ratio =
      (collateralAmount * Number(this.collateral?.price)) /
      (debtAmount + increasedDebt);
    return {
      price: this.$utils.number.toPrecision(price),
      ratio,
      ratioText: this.$utils.number.toFixed(ratio * 100, 2),
    };
  }

  get predictions() {
    return [
      {
        title: this.$t("form.info.new-liquidation-price"),
        value: this.meta.price,
        valueUnit: this.assetSymbol,
      },
      {
        title: this.$t("form.info.new-collateralization-ratio"),
        value: this.meta.ratioText,
        valueUnit: "%",
        valueColor: this.$utils.helper.risk(
          this.meta.ratio,
          this.collateral.mat
        ),
      },
    ];
  }

  @Watch("percent")
  onPercent(newVal) {
    if (!this.$utils.number.isValid(Number(this.amount))) return;
    if (this.modAmount) return;
    this.amount = this.$utils.number.toPrecision(
      (newVal / 100) * this.maxAvailable,
      8
    );
  }

  modAmount = false;

  @Watch("amount")
  onMintChanged(newVal) {
    this.modAmount = true;
    const newPercent = Number(newVal) / Number(this.maxAvailable);
    if (this.$utils.number.isValid(newPercent)) {
      this.percent = newPercent * 100;
    }
    this.$utils.helper.debounce(() => {
      this.modAmount = false;
    }, 10)();
  }

  mounted() {
    if (!this.vaultId) {
      this.$utils.helper.toast(this, {
        message: "Vault ID not found.",
        color: "red",
      });
      this.$router.replace("/");
    }
    this.follow_id = this.$utils.helper.uuidV4();
    this.vault = this.getVault(this.vaultId);
    this.collateral = this.getCollateral(this.vault.collateral_id);
    this.asset = this.getAssetById(this.collateral.dai);
    this.updateWalletAsset();
  }

  destroyed() {
    clearInterval(0);
  }

  needCnb = false;
  checkCNB() {
    if (this.isLogged && this.canReadAsset) {
      if (Number(this.getAssetById(ACTION_ASSET_ID)?.balance) <= 0) {
        this.needCnb = true;
        return true;
      }
    }
    return false;
  }

  updateWalletAsset() {
    this.$utils.helper.loadWalletAsset(this, this.collateral.gem);
    this.$utils.helper.loadWalletAsset(this, this.collateral.dai);
  }

  requestLogin() {
    this.$utils.helper.requestLogin(this);
  }

  requestConfirm() {
    if (this.checkCNB()) return;
    if ((this.meta.ratio - Number(this.collateral.mat)) * 100 < 61) {
      this.cmodal.show();
      return;
    }
    this.confirm();
  }

  follow_id = "";
  async confirm() {
    this.follow_id = this.$utils.helper.uuidV4();
    const request = {
      user_id: this.user_id,
      follow_id: this.follow_id,
      amount: "0.00000001",
      asset_id: ACTION_ASSET_ID,
      parameters: ["bit", "35", "uuid", this.vaultId, "decimal", this.amount],
    } as IActionsParams;
    const url = await this.$utils.helper.requestPayment(this, request);
    if (url && isDesktop() && !this.$fennec.connected) {
      this.$utils.helper.showPayDialog(this, {
        paymentUrl: url,
      });
    } else {
      this.$utils.helper.showPaying(this, {
        timer: this.$utils.helper.uuidV4(),
      });
    }
    this.checkTransaction(this.follow_id);
  }

  checkTransaction(follow_id: string) {
    let intervalId = 0 as any;
    clearInterval(intervalId);
    intervalId = setInterval(async () => {
      const response = await this.$http.getTransaction(follow_id);
      if (
        response.data?.status === TransactionStatus.OK ||
        response.data?.status === TransactionStatus.Abort
      ) {
        clearInterval(intervalId);
        this.updateWalletAsset();
        this.syncMyVaults();
        this.$utils.helper.hidePaying(this);
        this.$utils.helper.hidePaymentDialog(this);
        this.$utils.helper.handleTxResult(this, response.data);
      }
    }, 3000);
  }
}
</script>

<style lang="scss" scoped></style>
