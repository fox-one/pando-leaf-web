<template>
  <f-bottom-sheet
    v-model="dialog"
    :adaptive="true"
    overlay-opacity="0.9"
    max-width="800"
    desktop-wapper="dialog"
  >
    <template #activator="{ on }">
      <slot name="activator" :on="on">
        <f-button rounded depressed color="primary" :min-width="220" v-on="on">
          <v-icon size="16">$FIconAdd</v-icon>
          <span>{{ $t("common.add-a-vault") }}</span>
        </f-button>
      </slot>
    </template>

    <f-bottom-sheet-title>
      <div class="title text-center">
        {{ $t("common.add-a-vault") }}
      </div>
    </f-bottom-sheet-title>

    <f-bottom-sheet-subtitle class="pb-0">
      <div class="px-1 text-center">
        <div class="f-caption px-2 mb-6 text--disabled">
          {{ $t("tooltip.vault-selector") }}
        </div>

        <base-search v-model="filter" />
      </div>
    </f-bottom-sheet-subtitle>

    <v-list class="dialog-content overflow-auto">
      <div v-if="filtedCollaterals.length > 0">
        <collateral-list-item
          v-for="item in filtedCollaterals"
          :key="item.id"
          :collateral="item"
          @click.native="handleAddVault(item)"
          @add="handleAddVault(item)"
        />
      </div>

      <div v-else class="greyscale_1--text text-1 text-center mt-2">
        {{ $t("common.no-result") }}
      </div>
    </v-list>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CollateralListItem from "./CollateralListItem.vue";
import { Get } from "vuex-pathify";

@Component({
  components: { CollateralListItem },
})
class ActionCreateVault extends Vue {
  @Get("collateral/collaterals") collaterals!: API.Collateral[];

  dialog = false;

  filter = "";

  get filtedCollaterals() {
    return this.collaterals?.filter((item) =>
      item.name?.toLowerCase().includes(this.filter?.toLowerCase())
    );
  }

  handleAddVault(item: API.Collateral) {
    this.dialog = false;
    this.$emit("itemclick", item);
  }
}
export default ActionCreateVault;
</script>
<style lang="scss" scoped>
.dialog-content {
  max-height: 500px;
  height: calc(90vh - 220px);
}
</style>
