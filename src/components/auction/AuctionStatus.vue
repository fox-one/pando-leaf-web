<template>
  <div>
    <div class="py-2" v-if="loading">
      <f-loading :loading="loading"></f-loading>
    </div>

    <v-layout
      v-else
      align-center
      justify-space-between
      class="pa-4 text-1 statusbar white--text"
      :class="meta.bgcls"
    >
      <div class="text-center statusbar-left">
        {{ meta.title }}
      </div>

      <auction-timer v-if="!meta.isDone" :flip="flip" />
    </v-layout>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import AuctionTimer from "./AuctionTimer.vue";

@Component({
  components: {
    AuctionTimer,
  },
})
export default class AuctionStatus extends Vue {
  @Prop() flip!: API.Flip;

  loading = false;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { isDone, isStage1, isStage2, auctionSymbol } = getters.getFlipFields(
      this.flip
    );

    let title = "";
    let bgcls = "";

    if (isDone) {
      title = this.$t("auction.statusbar.done") as string;
      bgcls = "greyscale_3";
    } else if (isStage1) {
      title = this.$t("auction.statusbar.debt") as string;
      bgcls = "statusbar-debt";
    } else if (isStage2) {
      title = this.$t("auction.statusbar.collateral", {
        symbol: auctionSymbol,
      }) as string;
      bgcls = "statusbar-collateral";
    }

    return {
      isDone,
      auctionSymbol,
      isStage1,
      isStage2,
      title,
      bgcls,
    };
  }
}
</script>

<style lang="scss" scoped>
.statusbar {
  position: fixed;
  top: 44px;
  left: 0;
  z-index: 3;
  width: 100vw;
  line-height: 17px;
  &-debt {
    background-color: #2cc94e !important;
  }
  &-collateral {
    background-color: #f58721 !important;
  }

  &-left {
    font-weight: 500;
  }
}
</style>
