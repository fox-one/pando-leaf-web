<template>
  <v-layout justify-space-between>
    <div
      v-for="(item, index) in actions"
      :key="index"
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
class VaultListItemActions extends Vue {
  @Prop() hasCollateral!: boolean;

  @Prop() id!: string;

  get actions() {
    const { hasCollateral } = this;

    return [
      {
        icon: "$iconPayback",
        value: "payback",
        text: this.$t("button.pay-back"),
        disabled: !hasCollateral,
        href: "vault-payback",
      },
      {
        icon: "$iconGenerate",
        value: "generate",
        text: this.$t("button.generate"),
        disabled: !hasCollateral,
        href: "vault-generate",
      },
      {
        icon: "$iconWithdraw",
        value: "withdraw",
        text: this.$t("button.withdraw"),
        disabled: !hasCollateral,
        href: "vault-withdraw",
      },
      {
        icon: "$iconDeposit",
        value: "deposit",
        text: this.$t("button.deposit"),
        disabled: false,
        href: "vault-deposit",
      },
    ];
  }

  handleClick(item) {
    this.$router.push({ name: item.href, query: { id: this.id } });
  }
}
export default VaultListItemActions;
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