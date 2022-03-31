<template>
  <f-app-bar v-bind="appbar" @back="handleBack" class="appbar--no-shadow">
    <action-create-vault @itemclick="handleItemclick">
      <template v-slot:activator="{ on }">
        <v-layout
          align-center
          justify-center
          class="greyscale_1--text pr-5"
          @click.stop="on.click"
        >
          <base-step-indicator :current="step" :total="2"></base-step-indicator>
        </v-layout>
      </template>
    </action-create-vault>
  </f-app-bar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ActionCreateVault from "../ActionCreateVault.vue";
import BaseStepIndicator from "@/components/base/StepIndicator.vue";

@Component({
  components: {
    ActionCreateVault,
    BaseStepIndicator,
  },
})
export default class extends Vue {
  @Prop() appbar;

  @Prop() step!: number;

  handleBack() {
    this.$router.back();
  }

  handleItemclick(item: API.Collateral) {
    this.$emit("change", item);
  }
}
</script>

<style lang="scss" scoped>
.appbar--no-shadow {
  position: sticky;
  top: 0px;
  z-index: 10;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0) !important;
}
</style>
