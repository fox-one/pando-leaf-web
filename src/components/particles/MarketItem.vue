<template>
  <v-layout @click="generateNewVault" class="pl-4 pr-2 py-3 f-bg-greyscale-7">
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
    <v-icon class="icon" size="20">{{ "$vuetify.icons.iconListArrow" }}</v-icon>
  </v-layout>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter, State } from "vuex-class";
import { ICollateral } from "~/services/types/vo";

@Component
export default class MarketItem extends Vue {
  @Prop() collateral!: ICollateral;
  @State((state) => state.app.settings) settings;

  get meta() {
    return {
      name: this.collateral.name,
      price: this.collateral.price,
      rate: this.$utils.number.toPercent(this.collateral.duty),
      rho: this.$utils.time.format(this.collateral.rho),
    };
  }

  generateNewVault() {
    this.$router.push(`/vault/generate?id=${this.collateral.id}`);
  }
}
</script>

<style lang="scss" scoped>
.icon {
  align-self: center;
  margin-right: 2px;
  margin-left: 8px;
}
</style>
