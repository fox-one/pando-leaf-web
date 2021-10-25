<template>
  <div>
    <v-layout align-center class="form-input-tools">
      <slot name="left">
        <f-button
          v-if="!walletConnected"
          text
          x-small
          color="primary"
          class="ml-n2"
          @click.stop="handleConnectWallet"
        >
          {{ text.connect_wallet }}
          <v-icon size="12" class="ml-1">$connect</v-icon>
        </f-button>

        <div v-else class="greyscale_3--text d-flex align-center">
          <span class="mr-1"> {{ text.leftLabel }} </span>

          <span
            @click.stop="handleFill"
            class="greyscale_1--text font-weight-semibold"
          >
            {{ balance }}
          </span>
          <v-icon size="12" class="ml-1" @click.stop="handleFill">$fill</v-icon>
        </div>
      </slot>

      <v-spacer />

      <slot name="right">
        <template>
          <span
            v-if="walletConnected && fiatAmount"
            class="greyscale_3--text fiat-amount"
          >
            ≈ {{ fiatAmount }}
          </span>
        </template>
      </slot>
    </v-layout>

    <slot name="messages">
      <template>
        <v-messages
          v-if="messages"
          color="error"
          :value="messages"
          class="text-right"
        />
      </template>
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Get } from "vuex-pathify";

@Component({
  components: {},
})
export default class extends Vue {
  @Get("auth/isLogged") walletConnected!: boolean;

  @Prop({ type: [String, Number], default: "" }) balance!: string;

  @Prop({ type: [String, Number, Boolean], default: false }) fiatAmount;

  @Prop({ default: null }) leftLabel!: string | null;

  @Prop() messages;

  get text() {
    return {
      leftLabel: this.leftLabel ? this.leftLabel : this.$t("common.balance"),
      connect_wallet: this.$t("connect.wallet"),
    };
  }

  handleConnectWallet() {
    this.$utils.account.openAuth(this);
  }

  handleFill() {
    this.$emit("fill", this.balance);
  }
}
</script>

<style lang="scss" scoped>
.f-asset-input-tools {
  font-size: 12px;
  font-weight: 400;
  padding: 0 16px;
}

.fiat-amount {
  white-space: nowrap;
}
</style>
