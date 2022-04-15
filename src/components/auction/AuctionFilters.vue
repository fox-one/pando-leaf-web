<template>
  <f-bottom-sheet
    v-model="dialog"
    :title="$t('filter')"
    wapper-in-desktop="dialog"
  >
    <template #activator="{ on }">
      <v-layout v-on="on" class="filter-activator">
        <v-icon size="20">$FIconFilter</v-icon>
        <span class="ml-1">Filter</span>
      </v-layout>
    </template>

    <div class="px-4 pb-6">
      <div class="items pt-0">
        <auction-filter-item
          v-for="(item, index) in items"
          :item="item"
          :active="isActive(item)"
          :key="index"
          @click.native="handleSelect(item)"
        />
      </div>

      <div class="text-center mt-2">
        <f-button color="primary" @click="handleApply">
          {{ $t("apply") }}
        </f-button>
      </div>
    </div>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue, Model, Watch } from "vue-property-decorator";
import { FlipPhase } from "~/enums";
import AuctionFilterItem from "./AuctionFilterItem.vue";

@Component({
  components: {
    AuctionFilterItem,
  },
})
export default class AuctionFilters extends Vue {
  @Model("change") value!: string;

  types: string[] = [];

  dialog = false;

  get items() {
    const round1 = {
      value: FlipPhase.tend,
      text: "Round 1",
    };
    const round2 = {
      value: FlipPhase.dent,
      text: "Round 2",
    };
    const myVault = {
      value: "my-vault",
      text: "My Vault",
    };
    return [round1, round2, myVault];
  }

  get hasMyVault() {
    return this.types.includes("my-vault");
  }

  @Watch("dialog")
  handleDialogChange() {
    this.types = this.value.split(",");
  }

  isActive(item) {
    return this.types.includes(item.value);
  }

  created() {
    this.$emit(
      "change",
      this.items
        .slice(0, 2)
        .map((x) => x.value)
        .join(",")
    );
  }

  handleSelect(item) {
    if (this.isActive(item) && this.types.length > 1) {
      this.types = this.types.filter((x) => x !== item.value);
    } else if (!this.types.includes(item.value)) {
      this.types = [...this.types, item.value];
    }
  }

  handleApply() {
    this.dialog = false;
    const params: API.FlipParams = {
      offset: 0,
      limit: 20,
      phase: FlipPhase.tend,
    };
    if (this.types.includes("my-vault")) {
      params.my_vaults = 1;
    }
    if (
      this.types.includes(FlipPhase.tend) &&
      this.types.includes(FlipPhase.dent)
    ) {
      params.phase = FlipPhase.bid;
    } else if (this.types.includes(FlipPhase.tend)) {
      params.phase = FlipPhase.tend;
    } else if (this.types.includes(FlipPhase.dent)) {
      params.phase = FlipPhase.dent;
    }
    this.$store.commit("auctions/SET_ONGOING_PARAMS", params);
    this.$emit("change", this.types.join(","));
  }
}
</script>

<style lang="scss" scoped>
.items {
  max-height: 60vh;
  overflow: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px;
  padding: 16px;
}

.filter-activator {
  display: flex;
  flex: 0 1 auto;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 16px;

  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  width: 88px;
  height: 37px;
  background: var(--v-greyscale_6-base);
  border-radius: 53px;
}
</style>
