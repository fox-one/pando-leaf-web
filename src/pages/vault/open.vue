<template>
  <v-container class="pa-0">
    <f-app-bar
      v-bind="appbar"
      @back="handleBack"
      class="desktop-support market-app-bar"
    >
      <v-layout align-center justify-center @click="toast">
        <!-- <v-avatar class="ml-2 z-index-2" size="32">
          <v-img :src="deposit.logo" :size="32"></v-img>
        </v-avatar>
        <v-avatar class="ml-n3" size="32">
          <v-img :src="mint.logo" :size="32"></v-img>
        </v-avatar> -->
        <h4 class="mx-2">{{ appbar.title }}</h4>
        <v-icon>
          {{ $icons.mdiChevronDown }}
        </v-icon>
      </v-layout>
    </f-app-bar>
    <v-layout column class="ma-0 pa-4 f-bg-greyscale-7">
      <div class="f-body-1 f-greyscale-3 mb-3 text-center">
        {{ $t("form.open.how-much-col", { symbol: depositSymbol }) }}
        <f-tooltip v-model="depositTips" bottom>
          <template #activator="{ on, attrs }">
            <v-icon class="icon-tips" v-on="on" v-bind="attrs" size="20">{{
              $icons.mdiHelpCircleOutline
            }}</v-icon>
          </template>
          <div>
            <div class="f-body-1">
              {{ $t("form.open.deposit.tooltip1", { symbol: depositSymbol }) }}
            </div>
            <div class="f-caption">
              {{
                $t("form.open.deposit.tooltip2", {
                  depositSymbol: depositSymbol,
                  mintSymbol: mintSymbol,
                })
              }}
            </div>
          </div>
        </f-tooltip>
      </div>

      <f-asset-amount-input
        v-model="depositAmount"
        :label="$t('form.hint.deposit-amount')"
        :assets="[deposit]"
        :asset.sync="deposit"
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
      <div v-else class="f-caption f-greyscale-3 my-2 ml-4">
        {{ $t("form.info.wallet-balance")
        }}<span class="f-blue" @click="depositAmount = depositBalance">
          {{ depositBalance }} </span
        >{{ depositSymbol }}
      </div>
      <div class="f-body-1 f-greyscale-3 my-3 text-center">
        {{ $t("form.open.how-much-dai", { symbol: mintSymbol }) }}
        <f-tooltip v-model="mintTips" bottom>
          <template #activator="{ on, attrs }">
            <v-icon class="icon-tips" v-on="on" v-bind="attrs" size="20">{{
              $icons.mdiHelpCircleOutline
            }}</v-icon>
          </template>
          <div>
            <div class="f-body-1">
              {{ $t("form.open.dai.tooltip1", { symbol: mintSymbol }) }}
            </div>
            <div class="f-caption">
              {{ $t("form.open.dai.tooltip2") }}
            </div>
          </div>
        </f-tooltip>
      </div>
      <div class="f-caption f-greyscale-2"></div>
      <f-asset-amount-input
        v-model="mintAmount"
        :label="$t('form.hint.mint-amount')"
        :assets="[mint]"
        :asset.sync="mint"
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
      <div v-else class="f-caption f-greyscale-3 my-2 ml-4">
        {{ $t("form.info.max-available-to-generate")
        }}<span class="f-blue" @click="mintAmount = meta.maxAvailable">
          {{ meta.maxAvailableText || "0.00" }} </span
        >{{ mintSymbol }}
      </div>

      <risk-slider
        :amount="depositAmount"
        class="ma-4"
        :percent.sync="percent"
      />

      <f-tip class="mt-2" :type="validate.type" v-if="validate.tip !== null">{{
        validate.tip
      }}</f-tip>
      <f-button
        type="primary"
        class="mt-5"
        :disabled="validate.disabled"
        @click="requestConfirm"
      >
        {{ $t("form.open.button.confirm") }}
      </f-button>
    </v-layout>

    <v-layout column class="my-4 f-bg-greyscale-7">
      <div class="mt-4 mx-4 f-title-1">{{ $t("form.predication") }}</div>
      <f-info-grid :window-size="2">
        <f-info-grid-item
          v-for="(item, ix) in infos"
          :key="ix"
          :index="ix"
          :title="item.title"
          :value="item.value"
          :value-unit="item.valueUnit"
          :value-color="item.valueColor"
          :value-custom-color="item.valueCustomColor"
          :hint="item.hint"
        ></f-info-grid-item>
      </f-info-grid>
    </v-layout>
    <market-select-modal
      :show.sync="showSelectModal"
      :current.sync="collateral"
    />

    <base-confirm-modal
      ref="cmodal"
      @confirm="confirm"
      :current-rate="this.meta.collateralizationRatio * 100"
      :liquidation-rate="Number(this.collateral.mat) * 100"
    />
    <div class="mx-4 mt-4 f-caption f-greyscale-1 font-weight-bold">
      {{ $t("risk.warnings") }}
    </div>
    <div class="mx-4 f-caption f-greyscale-3">
      {{ $t("risk.warnings.content1") }}
    </div>
    <div class="mx-4 f-caption f-greyscale-3">
      {{ $t("risk.warnings.content2") }}
    </div>
    <div style="height: 80px"></div>
  </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins, Ref, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { Action, Getter, State } from "vuex-class";
import { IAsset, ICollateral } from "~/services/types/vo";
import { IActionsParams } from "~/services/types/dto";
import { RISK, TransactionStatus } from "~/types";
import MarketSelectModal from "~/components/particles/MarketSelectModal.vue";
import RiskSlider from "~/components/particles/RiskSlider.vue";
import BigNumber from "bignumber.js";
import { isDesktop } from "~/utils/helper";

@Component({
  components: { MarketSelectModal, RiskSlider },
})
export default class GenerateVault extends Mixins(mixins.page) {
  @Getter("auth/isLogged") isLogged;
  @Getter("global/getCollateral") getCollateral;
  @Getter("global/getAssetById") getAssetById;
  @Getter("global/getWalletAssetById") getWalletAssetById;
  @Action("global/syncMyVaults") syncMyVaults;
  @Action("global/syncMarkets") syncMarkets;
  @State((state) => state.auth.id) user_id!: string;
  @Ref("cmodal") cmodal;

  depositAmount = "";
  depositTips = false;
  mintAmount = "";
  mintTips = false;
  selectable = true;
  precision = 8;
  percent = 0;

  showSelectModal = false;
  collateral = {} as ICollateral;
  deposit = ({} as any) as IAsset;
  mint = ({} as any) as IAsset;

  get depositBalance() {
    return this.getWalletAssetById(this.deposit?.id)?.balance;
  }

  get mintBalance() {
    return this.getWalletAssetById(this.mint?.id)?.balance;
  }

  get depositSymbol() {
    return this.deposit?.symbol;
  }

  get mintSymbol() {
    return this.mint?.symbol;
  }

  get appbar() {
    const state = this.$store.state;
    const appbar = state.app.appbar;
    const isDark = state.app.settings.dark;

    return {
      ...appbar,
      disabled: true,
      back: true,
      align: "center",
      title: this.collateral.name,
      customContent: true,
      mixinImmersive: false,
      color: isDark ? "#000000" : "#FFFFFF",
    };
  }

  get title() {
    const t = this.$t("form.title.open", {
      name: this.collateral.name,
    });
    return `${t}`;
  }

  get queryId() {
    return this.$route.query["id"];
  }

  get meta() {
    const depositNum = Number(this.depositAmount);
    const mintNum = Number(this.mintAmount);
    // 抵押率计算
    const collateralizationRatio =
      (depositNum * Number(this.collateral?.price)) / mintNum;
    let collateralizationRatioText = `${this.$utils.number.toFixed(
      collateralizationRatio * 100,
      2
    )}`;
    if (!this.$utils.number.isValid(collateralizationRatio)) {
      collateralizationRatioText = "-";
    }
    // 价格计算
    const liquidationPrice =
      (mintNum * Number(this.collateral?.mat || "0")) / depositNum;
    let liquidationPriceText = `${this.$utils.number.toPrecision(
      liquidationPrice
    )}`;
    if (
      !this.$utils.number.isValid(liquidationPrice) ||
      liquidationPrice === 0
    ) {
      liquidationPriceText = `-`;
    }
    // fee
    const stabilityFee =
      this.$utils.number.toPrecision(Number(this.collateral.duty) - 1) * 100;
    // 该类型最大可用额
    const maxToGenerate = this.$utils.collateral.maxAvailable(this.collateral);
    const maxToGenerateText = this.$utils.number.toPrecision(maxToGenerate);
    // 实际最大可用
    let maxAvailable =
      (depositNum * Number(this.collateral?.price || "0")) /
        Number(this.collateral?.mat) || 0;
    if (maxAvailable > maxToGenerate) {
      maxAvailable = maxToGenerate;
    }
    const maxAvailableText = this.$utils.number.toPrecision(
      maxAvailable,
      8,
      BigNumber.ROUND_DOWN
    );
    return {
      collateralizationRatio,
      collateralizationRatioText,
      liquidationPrice: liquidationPriceText,
      currentDepositPrice: `${this.$utils.number.toPrecision(
        this.collateral?.price || "0"
      )}`,
      stabilityFee: this.$utils.number.toFixed(stabilityFee, 2),
      maxToGenerate: maxToGenerateText,
      maxAvailable,
      maxAvailableText,
    };
  }

  // 表单校验
  get validate() {
    if (this.depositAmount === "" && this.mintAmount === "") {
      return {
        disabled: true,
        type: "info",
        tip: null,
      };
    }
    if (
      (this.depositAmount === "" && this.mintAmount !== "") ||
      (this.depositAmount !== "" && this.mintAmount === "")
    ) {
      return {
        disabled: true,
        type: "error",
        tip: null,
      };
    }
    if (this.depositAmount !== "" && this.mintAmount !== "") {
      const ma = Number(this.mintAmount || "0");
      const max = this.$utils.collateral.maxAvailable(this.collateral);
      if (ma > max) {
        // mint 大于最大值
        return {
          disabled: true,
          type: "error",
          tip: this.$t("form.validate.max-debt", {
            amount: this.$utils.number.toPrecision(max),
            symbol: this.mintSymbol,
          }),
        };
      }
      if (ma < Number(this.collateral.dust)) {
        // mint 小于最小值
        return {
          disabled: true,
          type: "error",
          tip: this.$t("form.validate.minimum-debt", {
            amount: this.collateral.dust,
            symbol: this.mintSymbol,
          }),
        };
      }
      const risk = this.$utils.helper.riskLevel(
        this.meta.collateralizationRatio,
        this.collateral.mat
      );
      switch (risk) {
        case RISK.HIGH:
          if (
            Number(this.meta.collateralizationRatio) <
            Number(this.collateral.mat)
          ) {
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
              symbol: this.mintSymbol,
            }),
          };
        // 中风险区间
        case RISK.MEDIUM:
          return {
            disabled: false,
            type: "warning",
            tip: this.$t("form.validate.medium-risk", {
              symbol: this.mintSymbol,
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

  get infos() {
    return [
      {
        title: this.$t("form.info.liquidation-price"), // mint * mat / deposit
        value: this.meta.liquidationPrice,
        valueUnit: `${this.mint.symbol}`,
        hint: this.$t("form.tooltip.liquidation-price"),
      },
      {
        title: this.$t("form.info.collateralization-ratio"), // deposit * price / mint
        value: this.meta.collateralizationRatioText,
        valueUnit: "%",
        valueColor: this.$utils.helper.risk(
          this.meta.collateralizationRatio,
          this.collateral.mat
        ),
        hint: this.$t("form.tooltip.collateralization-ratio"),
      },
      {
        title: this.$t("form.info.current-symbol-price", {
          symbol: `${this.deposit?.symbol}/${this.mint?.symbol}`,
        }),
        value: this.meta.currentDepositPrice,
        valueUnit: `${this.mint.symbol}`,
      },
      {
        title: this.$t("form.info.minimum-ratio"),
        value: this.$utils.number.toFixed(
          Number(this.collateral?.mat) * 100,
          2
        ),
        valueUnit: "%",
        hint: this.$t("form.tooltip.minimum-ratio"),
      },
      {
        title: this.$t("form.info.market-debt-ceiling"), // line- debt
        value: this.meta.maxToGenerate,
        valueUnit: this.mint?.symbol,
      },
      {
        title: this.$t("form.info.stability-fee"),
        value: this.meta.stabilityFee,
        valueUnit: "%",
        hint: this.$t("form.tooltip.stability-fee"),
      },
    ];
  }

  @Watch("percent")
  onPercent(newVal) {
    if (!this.$utils.number.isValid(Number(this.depositAmount))) return;
    if (this.modMint) return;
    this.mintAmount = this.$utils.number.toPrecision(
      (newVal / 100) * this.meta.maxAvailable,
      8
    );
  }

  modMint = false;

  @Watch("mintAmount")
  onMintChanged(newVal) {
    this.modMint = true;
    const newPercent = Number(newVal) / Number(this.meta.maxAvailable);
    if (this.$utils.number.isValid(newPercent)) {
      this.percent = newPercent * 100;
    }
    this.$utils.helper.debounce(() => {
      this.modMint = false;
    }, 10)();
  }

  @Watch("collateral")
  onCollateralChange(newVal, oldVal) {
    if (newVal?.id === oldVal?.id) return;
    this.$router.replace({
      query: {
        id: newVal.id,
      },
    });
    this.deposit = this.getAssetById(newVal?.gem);
    this.mint = this.getAssetById(newVal?.dai);
    this.updateWalletAsset(newVal);
  }

  intervalid = 0;
  mounted() {
    if (!this.queryId) {
      this.$utils.helper.toast(this, {
        message: "Collateral ID not found.",
        color: "red",
      });
      this.$router.replace("/");
    }
    this.follow_id = this.$utils.helper.uuidV4();
    this.collateral = this.getCollateral(this.queryId);
    this.deposit = this.getAssetById(this.collateral?.gem);
    this.mint = this.getAssetById(this.collateral?.dai);
    this.updateWalletAsset();
    this.intervalid = (setInterval(async () => {
      await this.syncMarkets();
      this.updateWalletAsset();
      this.collateral = this.getCollateral(this.queryId);
    }, 5000) as any) as number;
  }

  destroyed() {
    clearInterval(0);
    clearInterval(this.intervalid);
  }

  toast() {
    this.showSelectModal = !this.showSelectModal;
  }

  handleBack() {
    this.$router.back();
  }

  updateWalletAsset(collateral = this.collateral) {
    this.$utils.helper.loadWalletAsset(this, collateral.gem);
    this.$utils.helper.loadWalletAsset(this, collateral.dai);
  }

  requestLogin() {
    this.$utils.helper.requestLogin(this);
  }

  requestConfirm() {
    if (
      (this.meta.collateralizationRatio - Number(this.collateral.mat)) * 100 <
      61
    ) {
      this.cmodal.show();
      return;
    }
    this.confirm();
  }

  follow_id = "";
  async confirm() {
    const request = {
      user_id: this.user_id,
      follow_id: this.follow_id,
      amount: this.depositAmount,
      asset_id: this.deposit?.id,
      parameters: [
        "bit",
        "31",
        "uuid",
        this.collateral.id,
        "decimal",
        this.$utils.number.toPrecision(this.mintAmount, 8),
      ],
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
        this.$utils.helper.toast(this, {
          message: "New Vault has been created.",
          color: "success",
        });
        this.$router.replace("/me");
      }
    }, 3000);
  }
}
</script>
<style lang="scss" scoped>
.z-index-2 {
  z-index: 2;
}
.icon-tips {
  vertical-align: middle;
}
</style>
