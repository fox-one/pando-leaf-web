<template>
  <v-row align-center justify-center no-gutters class="f-caption">
    <v-col cols="6" class="pr-2">
      <div
        class="sort-button"
        :class="{ active: meta.sortByCreateTime }"
        @click.stop="handleCreateTimeClick"
      >
        {{ $t("common.create-time") }}
        <v-icon size="12">{{ meta.iconCreateTime }}</v-icon>
      </div>
    </v-col>

    <v-col cols="6" class="pl-2">
      <div
        class="sort-button"
        :class="{ active: meta.sortByCollateralRatio }"
        @click.stop="handleCollateralRatioClick"
      >
        {{ $t("common.collateral-ratio") }}
        <v-icon size="12">{{ meta.iconCollateralRatio }}</v-icon>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from "vue-property-decorator";
import { SortBy } from "~/enums";
import Sort from "../icons/Sort.vue";

@Component
class VaultSorter extends Vue {
  @PropSync("sort") sortedBy!: SortBy;

  get meta() {
    return {
      sortByCreateTime:
        this.sortedBy === SortBy.CREATE_TIME_ASC ||
        this.sortedBy === SortBy.CREATE_TIME_DESC,

      sortByCollateralRatio:
        this.sortedBy === SortBy.COLLATERAL_RATIO_ASC ||
        this.sortedBy === SortBy.COLLATERAL_RATIO_DESC,

      iconCreateTime:
        this.sortedBy === SortBy.CREATE_TIME_ASC
          ? "$iconSortAsc"
          : this.sortedBy === SortBy.CREATE_TIME_DESC
          ? "$iconSortDesc"
          : "$iconSort",

      iconCollateralRatio:
        this.sortedBy === SortBy.COLLATERAL_RATIO_ASC
          ? "$iconSortAsc"
          : this.sortedBy === SortBy.COLLATERAL_RATIO_DESC
          ? "$iconSortDesc"
          : "$iconSort",
    };
  }

  handleCreateTimeClick() {
    if (this.sortedBy !== SortBy.CREATE_TIME_ASC) {
      this.sortedBy = SortBy.CREATE_TIME_ASC;
    } else {
      this.sortedBy = SortBy.CREATE_TIME_DESC;
    }
  }

  handleCollateralRatioClick() {
    if (this.sortedBy !== SortBy.COLLATERAL_RATIO_ASC) {
      this.sortedBy = SortBy.COLLATERAL_RATIO_ASC;
    } else {
      this.sortedBy = SortBy.COLLATERAL_RATIO_DESC;
    }
  }
}
export default VaultSorter;
</script>
<style lang="scss" scoped>
.sort-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  border-radius: 16px;
  background-color: var(--v-greyscale_6-base);
  color: var(--v-greyscale_3-base);

  &.active {
    background-color: var(--v-greyscale_7-base);
    color: var(--v-greyscale_2-base);
    border: 1.5px solid var(--v-greyscale_2-base);
    border-radius: 53px;
  }
}
</style>
