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
        icon: "$FIconRepay4P",
        value: "payback",
        text: this.$t("common.pay-back"),
        disabled: !hasDebt,
        href: "vault-payback",
        color: "primary",
        clazz: "bg-color",
      },
      {
        icon: "$iconGenerate",
        value: "generate",
        text: this.$t("common.generate"),
        disabled: !hasCollateral,
        href: "vault-generate",
        color: "primary",
        clazz: "bg-color",
      },
      {
        icon: "$iconWithdraw",
        value: "withdraw",
        text: this.$t("common.withdraw"),
        disabled: !hasCollateral,
        href: "vault-withdraw",
        color: "primary",
        clazz: "bg-color",
      },
      {
        icon: "$FIconAdd4P",
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

.bg-color {
  background-color: var(--v-greyscale_6-base);
}
.bg-color-opposite {
  background-color: var(--v-greyscale_1-base);
}
</style>
