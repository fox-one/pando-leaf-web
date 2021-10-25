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
          <span>{{ $t("me.no-vault-button") }}</span>
        </f-button>
      </slot>
    </template>

    <f-bottom-sheet-title>
      <div class="title text-center">
        {{ $t("vault.selector.title") }}
      </div>
    </f-bottom-sheet-title>

    <f-bottom-sheet-subtitle class="pb-0">
      <div class="px-1 text-center">
        <div class="f-caption px-2 mb-6 text--disabled">
          {{ $t("vault.selector.tips") }}
        </div>
        <base-search v-model="filter" />
      </div>
    </f-bottom-sheet-subtitle>

    <v-list height="500" class="overflow-auto">
      <collateral-list-item
        v-for="(item, index) in filtedCollaterals"
        :key="index"
        :collateral="item"
        @click.native="handleAddVault(item)"
        @add="handleAddVault(item)"
      />
    </v-list>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
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
