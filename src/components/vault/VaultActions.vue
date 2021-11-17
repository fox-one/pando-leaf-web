<template>
  <v-layout justify-space-between>
    <div
      v-for="item in actions"
      :key="item.value"
      class="action"
      :class="[{ 'action--disabled': item.disabled }]"
      @click.stop="handleClick(item)"
    >
      <v-icon size="32" :color="'primary'">{{ item.icon }}</v-icon>
      <div class="caption label">{{ item.text }}</div>
    </div>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class VaultActions extends Vue {
  @Prop() id!: string;

  @Prop({ default: false }) hasCollateral!: boolean;

  @Prop({ default: false }) hasDebt!: boolean;

  get actions() {
    const { hasCollateral, hasDebt } = this;

    return [
      {
        icon: "$iconPayback",
        value: "payback",
        text: this.$t("common.pay-back"),
        disabled: !hasDebt,
        href: "vault-payback",
      },
      {
        icon: "$iconGenerate",
        value: "generate",
        text: this.$t("common.generate"),
        disabled: !hasCollateral,
        href: "vault-generate",
      },
      {
        icon: "$iconWithdraw",
        value: "withdraw",
        text: this.$t("common.withdraw"),
        disabled: !hasCollateral,
        href: "vault-withdraw",
      },
      {
        icon: "$iconDeposit",
        value: "deposit",
        text: this.$t("common.deposit"),
        disabled: false,
        href: "vault-deposit",
      },
    ];
  }

  handleClick(item) {
    this.$router.push({ name: item.href, query: { id: this.id } });
  }
}
export default VaultActions;
</script>

<style lang="scss" scoped>
.action {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &--disabled {
    opacity: 0.2;
    pointer-events: none;
  }
}

.label {
  margin-top: 2px;
}
</style>
