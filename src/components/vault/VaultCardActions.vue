<template>
  <v-layout class="full-width" justify-space-around>
    <div
      v-for="item in actions"
      :key="item.value"
      class="action"
      :class="[{ 'action--disabled': item.disabled }]"
      @click.stop="handleClick(item)"
    >
      <v-icon size="24" :color="'primary'">{{ item.icon }}</v-icon>
    </div>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class VaultCardActions extends Vue {
  @Prop() id!: string;

  @Prop({ default: false }) hasCollateral!: boolean;

  @Prop({ default: false }) hasDebt!: boolean;

  get actions() {
    const { hasCollateral, hasDebt } = this;

    const actions: any[] = [];

    if (hasDebt) {
      actions.push({
        icon: "$iconPayback",
        value: "payback",
        text: this.$t("common.payback"),
        disabled: !hasDebt,
        href: "vault-payback",
      });
    }
    if (hasCollateral) {
      actions.push(
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
        }
      );
    }
    actions.push({
      icon: "$iconDeposit",
      value: "deposit",
      text: this.$t("common.deposit"),
      disabled: false,
      href: "vault-deposit",
    });
    return actions;
  }

  handleClick(item) {
    this.$router.push(
      this.localePath({ name: item.href, query: { id: this.id } })
    );
  }
}
export default VaultCardActions;
</script>

<style lang="scss" scoped>
.full-width {
  width: 100%;
}
.action {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;

  &--disabled {
    opacity: 0.2;
    pointer-events: none;
  }
}

.label {
  margin-top: 2px;
}
</style>
