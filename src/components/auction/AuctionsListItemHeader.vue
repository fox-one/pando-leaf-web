<template>
  <v-layout align-center class="mx-6 pt-6">
    <base-pair-logo :base="meta.auctionLogo" :quote="meta.debtLogo" />

    <div v-if="meta.isMyVault" class="ml-2 tag">
      {{ $t("common.my-vault") }}
    </div>
    <div v-else class="f-caption ml-2 greyscale_4--text">
      #{{ meta.id.slice(0, 5) }}
    </div>

    <v-spacer />

    <span class="f-caption greyscale_4--text" justify-end>
      {{ meta.endTime }}
    </span>
  </v-layout>
</template>

<script lang="ts" scoped>
import dayjs from "dayjs";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Get } from "vuex-pathify";

@Component
export default class AuctionsListItemHeader extends Vue {
  @Prop() flip!: API.Flip;

  @Get("account/userId") userId!: string;

  get meta() {
    const { format } = this.$utils.time;
    const getters = this.$store.getters as Getter.GettersTree;

    const { auctionAsset, debtAsset, isDone, isMyVault } =
      getters.getFlipFields(this.flip);

    let endTime;

    if (isDone) {
      endTime = format(this.flip?.tic);
    } else {
      if (dayjs(this.flip.tic).unix() === 0) {
        endTime = format(this.flip?.tic);
      } else {
        endTime = dayjs(this.flip.tic).isBefore(dayjs(this.flip.end))
          ? format(this.flip.tic)
          : format(this.flip.end);
      }
    }

    return {
      id: this.flip.id,
      auctionLogo: auctionAsset?.logo,
      debtLogo: debtAsset?.logo,
      endTime,
      isMyVault,
    };
  }
}
</script>

<style lang="scss" scoped>
.tag {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2px 4px;
  color: #2e2e2e;
  background: #8fe613;
  border-radius: 4px;
  font-weight: 600;
  font-size: 10px;
}
</style>
