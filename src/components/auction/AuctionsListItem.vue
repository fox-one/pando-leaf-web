<template>
  <div @click="toDetail(flip)">
    <f-panel elevation="0" class="pa-0 greyscale_6">
      <auctions-list-item-header :flip="flip" />

      <auctions-list-item-info :flip="flip" />

      <f-divider class="mx-6 mt-2" />

      <auctions-list-item-footer :flip="flip" />
    </f-panel>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import AuctionsListItemHeader from "./AuctionsListItemHeader.vue";
import AuctionsListItemInfo from "./AuctionsListItemInfo.vue";
import AuctionsListItemFooter from "./AuctionsListItemFooter.vue";
import dayjs from "dayjs";

@Component({
  components: {
    AuctionsListItemHeader,
    AuctionsListItemInfo,
    AuctionsListItemFooter,
  },
})
export default class AuctionsListItem extends Vue {
  @Prop() flip!: API.Flip;

  timer: any = null;

  mounted() {
    let diffSeconds = dayjs(this.flip.tic).diff(dayjs(), "seconds");
    if (
      dayjs(this.flip.tic).unix() === 0 ||
      dayjs(this.flip.tic).isAfter(dayjs(this.flip.end))
    ) {
      diffSeconds = dayjs(this.flip.end).diff(dayjs(), "seconds");
    }
    if (diffSeconds > 0) {
      this.timer = setTimeout(() => {
        this.$emit("refresh");
      }, (diffSeconds + 3) * 1000);
    }
  }

  beforeDestroy() {
    clearTimeout(this.timer);
  }

  toDetail(flip: API.Flip) {
    this.$router.push(`/auction?id=${flip.id}`);
  }
}
</script>
