<template>
  <div class="label-1 mb-4">
    {{ meta.rules }}

    <auction-rules-tip :flip="flip" />
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import AuctionRulesTip from "./AuctionRulesTip.vue";

@Component({
  components: { AuctionRulesTip },
})
export default class AuctionRules extends Vue {
  @Prop() flip!: API.Flip;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { isStage1 } = getters.getFlipFields(this.flip);

    const rules = isStage1
      ? this.$t("auction.label.stage.title.debt")
      : this.$t("auction.label.stage.title.collateral");

    return { rules };
  }
}
</script>

<style lang="scss" scoped></style>
