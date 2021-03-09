<template>
  <f-panel class="ma-4 mb-0">
    <v-layout column>
      <v-layout row class="ma-0" justify-space-between align-center>
        <div class="f-greyscale-1 f-body-2">
          {{ meta.name }}
        </div>
        <div class="f-greyscale-1 f-body-2 font-weight-bold">
          {{ meta.rate }}
        </div>
      </v-layout>
      <v-layout row class="ma-0" justify-space-between align-center>
        <div class="f-greyscale-3 f-body-2">
          {{ meta.price }}
        </div>
        <div class="f-greyscale-1 f-body-2">
          {{ meta.rho }}
        </div>
      </v-layout>
    </v-layout>
  </f-panel>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter, State } from "vuex-class";
import { ICollateral, IVault } from "~/services/types/vo";

@Component
export default class MyVaultItem extends Vue {
  @Prop() vault!: IVault;
  @State((state) => state.app.settings) settings;
  @Getter("global/getCollateral") getCollateral!: (id) => ICollateral;

  get collateral() {
    return this.getCollateral(this.vault?.collateral_id);
  }

  get meta() {
    return {
      name: this.collateral?.name,
      price: this.collateral?.price,
      rate: this.$utils.number.toPercent(this.collateral?.duty),
      rho: this.$utils.time.format(this.collateral?.rho),
    };
  }
}
</script>

<style lang="scss" scoped></style>
