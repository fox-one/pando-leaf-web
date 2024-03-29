<template>
  <v-row align-center justify-center no-gutters class="f-caption">
    <v-col cols="6" class="pr-2">
      <div
        class="sort-button"
        :class="{ active: meta.sortByCollateralRatio }"
        @click.stop="handleCollateralRatioClick"
      >
        {{ $t("common.collateral-ratio") }}
        <v-icon v-if="meta.sortByCollateralRatio" class="ml-1" size="12">
          {{ meta.iconCollateralRatio }}
        </v-icon>
      </div>
    </v-col>

    <v-col cols="6" class="pl-2">
      <div
        class="sort-button"
        :class="{ active: meta.sortByCollateralValue }"
        @click.stop="handleCollateralValueClick"
      >
        {{ $t("common.collateral-value") }}
        <v-icon v-if="meta.sortByCollateralValue" class="ml-1" size="12">
          {{ meta.iconCollateralValue }}
        </v-icon>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Sync } from "vuex-pathify";
import { SortBy } from "~/enums";

@Component
class VaultSorter extends Vue {
  @Sync("page/home@sorter") sortedBy!: SortBy;

  get meta() {
    return {
      sortByCollateralValue:
        this.sortedBy === SortBy.COLLATERAL_VALUE_ASC ||
        this.sortedBy === SortBy.COLLATERAL_VALUE_DESC,

      sortByCollateralRatio:
        this.sortedBy === SortBy.COLLATERAL_RATIO_ASC ||
        this.sortedBy === SortBy.COLLATERAL_RATIO_DESC,

      iconCollateralValue:
        this.sortedBy === SortBy.COLLATERAL_VALUE_ASC
          ? "$IconSortAsc"
          : this.sortedBy === SortBy.COLLATERAL_VALUE_DESC
          ? "$IconSortDesc"
          : "$IconSort",

      iconCollateralRatio:
        this.sortedBy === SortBy.COLLATERAL_RATIO_ASC
          ? "$IconSortAsc"
          : this.sortedBy === SortBy.COLLATERAL_RATIO_DESC
          ? "$IconSortDesc"
          : "$IconSort",
    };
  }

  handleCollateralValueClick() {
    if (this.sortedBy !== SortBy.COLLATERAL_VALUE_ASC) {
      this.sortedBy = SortBy.COLLATERAL_VALUE_ASC;
    } else {
      this.sortedBy = SortBy.COLLATERAL_VALUE_DESC;
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
  font-weight: 500;
  box-sizing: border-box;
  border: 1px solid var(--v-greyscale_6-base);
  color: var(--v-greyscale_3-base);

  &.active {
    background-color: var(--v-greyscale_6-base);
    color: var(--v-greyscale_1-base);
    border-radius: 53px;
  }
}
</style>
