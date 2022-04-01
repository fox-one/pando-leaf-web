<template>
  <base-bottom-action-bar>
    <base-connect-wallet-btn class="pa-4" block>
      <f-button
        :disabled="disabled"
        color="primary"
        @click="handleNext"
        style="width: 100%"
      >
        {{ $t("form.next-step") }}
      </f-button>
    </base-connect-wallet-btn>
  </base-bottom-action-bar>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {},
})
export default class StepOneAction extends Vue {
  @Prop({ default: false }) disabled!: boolean;

  handleNext() {
    this.$emit("next");
  }
}
</script>

<style lang="scss" scoped>
.input-collateral {
  width: 100%;
}
</style>
