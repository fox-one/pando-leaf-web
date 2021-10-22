<template>
  <f-panel
    elevation="none"
    v-if="events && events.length !== 0"
    class="px-4 pt-6 pb-0 no-border-radius"
  >
    <div v-if="events && events.length !== 0" class="text-1 mb-2">
      {{ $t("auction.history") }}
    </div>

    <template v-for="(event, index) in events">
      <f-divider :key="`${index}_divider`" v-if="index !== 0" />

      <auction-history-item
        :key="`${event.lot}_${event.bid}_${event.created_at}`"
        :flip-event="event"
        :flip="flip"
      />
    </template>
  </f-panel>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import AuctionHistoryItem from "./AuctionHistoryItem.vue";
import { FlipAction } from "~/enums";

@Component({
  components: {
    AuctionHistoryItem,
  },
})
export default class AuctionEventHistory extends Vue {
  @Prop() flipId!: string;
  @Prop() flip!: API.Flip;

  events: API.FlipEvent[] = [];

  intervalId = 0 as any;

  mounted() {
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
