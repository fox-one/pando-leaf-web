<template>
  <v-layout align-center class="mx-6" style="height: 49.5px">
    <div :class="`f-caption ${meta.isDone ? 'text--disabled' : ''}`">
      {{ meta.status }}
    </div>

    <v-spacer style="border-color: rgba(0, 0, 0, 0.1) !important" />

    <v-icon size="16" color="primary">$FIconChevronRight</v-icon>
  </v-layout>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import { FlipAction } from "~/enums";

@Component({
  components: {},
})
export default class AuctionsListItem extends Vue {
  @Prop() flip!: API.Flip;

  get meta() {
    const isDone = this.flip.action === FlipAction.FlipDeal;
    const status = isDone
      ? this.$t("auction.item.status.done")
      : this.$t("auction.item.status.in-auction");

    return {
      isDone,
      status,
    };
  }
}
</script>
