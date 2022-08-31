<template>
  <f-panel
    elevation="none"
    v-if="events && events.length !== 0"
    class="pa-4 pb-0 no-border-radius"
  >
    <h2 v-if="events && events.length !== 0" class="text-2 mb-2">
      {{ $t("auction.history") }}
    </h2>

    <template v-for="(event, index) in events">
      <f-divider :key="`${index}_divider`" v-if="index !== 0" />

      <auction-history-item
        :key="`${event.lot}_${event.bid}_${event.created_at}`"
        :flip-event="event"
        :flip="flip"
        :is-your-bid="index === 0 && meta.isYourBid"
      />
    </template>
  </f-panel>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import AuctionHistoryItem from "./AuctionHistoryItem.vue";
import { FlipAction } from "~/enums";
import { Sync } from "vuex-pathify";

@Component({
  components: {
    AuctionHistoryItem,
  },
})
export default class AuctionEventHistory extends Vue {
  @Prop() flipId!: string;
  @Prop() flip!: API.Flip;

  @Sync("auctions/events") events!: API.FlipEvent[];

  intervalId = 0 as any;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    return {
      isYourBid: this.flip.guy === getters["account/userId"],
    };
  }

  mounted() {
    this.events = [];
    this.requestEvents();
    this.intervalId = setInterval(() => {
      if (this.flip?.action === FlipAction.FlipDeal) {
        clearInterval(this.intervalId);
        return;
      }
      this.requestEvents();
    }, 3000);
  }

  async requestEvents() {
    const res = await this.$http.getFlipEvents(this.flipId);
    this.events = res?.events?.reverse();
  }

  beforeDestroy() {
    clearInterval(this.intervalId);
  }
}
</script>
