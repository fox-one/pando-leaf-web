<template>
  <f-bottom-sheet
    v-model="dialog"
    :adaptive="true"
    overlay-opacity="0.9"
    max-width="800"
    :wapper-in-desktop="'dialog'"
    :show-close-icon="true"
  >
    <template #activator="{ on }">
      <slot name="activator" :on="on">
        <div v-on="on">
          <v-icon size="24" color="primary">$FIconAdd</v-icon>
        </div>
      </slot>
    </template>

    <f-bottom-sheet-title>
      {{ $t("common.add-a-vault") }}
    </f-bottom-sheet-title>

    <v-list class="dialog-content overflow-auto py-0">
      <f-bottom-sheet-subtitle class="pb-4 pt-0">
        <div class="text-center">
          <div class="f-caption mb-6 greyscale_3--text">
            {{ $t("tooltip.vault-selector") }}
          </div>

          <f-search-input
            v-model="filter"
            :place-holder="$t('common.search')"
            class="search-margin"
          />
        </div>
      </f-bottom-sheet-subtitle>

      <div v-if="filtedCollaterals.length > 0">
        <collateral-list-item
          v-for="item in filtedCollaterals"
          :key="item.id"
          :collateral="item"
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
import { Component, PropSync, Vue, Watch } from "vue-property-decorator";
import CollateralListItem from "./CollateralListItem.vue";
import { Get } from "vuex-pathify";

@Component({
  components: { CollateralListItem },
})
class ActionCreateVault extends Vue {
  @Get("collateral/collaterals") collaterals!: API.Collateral[];

  @PropSync("show") bindDialog!: boolean;

  dialog = false;

  filter = "";

  get filtedCollaterals() {
    return this.collaterals?.filter((item) =>
      item.name?.toLowerCase().includes(this.filter?.toLowerCase())
    );
  }

  @Watch("dialog")
  onBindDialogChange(val: boolean) {
    this.bindDialog = val;
  }

  close() {
    this.dialog = !this.dialog;
  }

  handleAddVault(item: API.Collateral) {
    this.dialog = false;
    this.$emit("itemclick", item);
  }
}
export default ActionCreateVault;
</script>
<style lang="scss" scoped>
.xx-small {
  width: 24px;
  height: 24px;
}

.dialog-content {
  max-height: calc(100vh - 156px);
  height: calc(100vh - 156px);
}

.search-margin {
  ::v-deep {
    .v-input__control {
      .v-input__slot {
        margin-bottom: 0px;
      }
    }
  }
}
</style>
