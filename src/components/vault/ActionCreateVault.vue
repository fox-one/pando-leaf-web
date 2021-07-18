<template>
  <f-bottom-sheet
    v-model="dialog"
    :adaptive="true"
    overlay-opacity="0.9"
    max-width="800"
    desktop-wapper="dialog"
    content-class="welcome-modal"
  >
    <template #activator="{ on }">
      <slot name="activator" :on="{ on }">
        <f-button rounded depressed color="primary" :min-width="220" v-on="on">
          <span>{{ $t("me.no-vault-button") }}</span>
        </f-button>
      </slot>
    </template>

    <template #title>
      <div class="title text-center">
        {{ $t("vault.selector.title") }}
      </div>
    </template>

    <template #subheader>
      <div class="px-1 text-center">
        <div class="f-caption px-2 mb-6">
          {{ $t("vault.selector.tips") }}
        </div>
        <base-search v-model="filter" />
      </div>
    </template>

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
    this.$router.push({ name: "vault-open", query: { id: item.id } });
  }
}
export default ActionCreateVault;
</script>
