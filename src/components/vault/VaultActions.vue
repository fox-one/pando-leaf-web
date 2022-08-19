<template>
  <v-layout justify-space-around>
    <div
      v-for="item in actions"
      :key="item.value"
      class="action"
      :class="[{ 'action--disabled': item.disabled }]"
      @click.stop="handleClick(item)"
    >
      <v-icon
        size="56"
        class="pa-4 rounded-circle"
        :class="item.clazz"
        :color="item.color"
        >{{ item.icon }}</v-icon
      >
      <div class="f-caption label greyscale_3--text">{{ item.text }}</div>
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
        icon: "$iconPaybackOld",
        value: "payback",
        text: this.$t("common.payback"),
        disabled: !hasDebt,
        href: "vault-payback",
        color: "primary",
        clazz: "bg-color",
      },
      {
        icon: "$iconGenerateOld",
        value: "generate",
        text: this.$t("common.generate"),
        disabled: !hasCollateral,
        href: "vault-generate",
        color: "primary",
        clazz: "bg-color",
      },
      {
        icon: "$iconWithdrawOld",
        value: "withdraw",
        text: this.$t("common.withdraw"),
        disabled: !hasCollateral,
        href: "vault-withdraw",
        color: "primary",
        clazz: "bg-color",
      },
      {
        icon: "$iconDepositOld",
        value: "deposit",
        text: this.$t("common.deposit"),
        disabled: false,
        href: "vault-deposit",
        color: "greyscale_7",
        clazz: "bg-color-opposite",
      },
    ];
  }

  handleClick(item) {
    this.$router.push(
      this.localePath({ name: item.href, query: { id: this.id } })
    );
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
  font-weight: 500;
  margin-top: 8px;
}

.bg-color {
  background-color: var(--v-greyscale_6-base);
}
.bg-color-opposite {
  background-color: var(--v-greyscale_1-base);
}
</style>
