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

@Component({
  components: {
    AuctionsListItemHeader,
    AuctionsListItemInfo,
    AuctionsListItemFooter,
  },
})
export default class AuctionsListItem extends Vue {
  @Prop() flip!: API.Flip;

  toDetail(flip: API.Flip) {
    this.$router.push(`/auction?id=${flip.id}`);
  }
}
</script>
