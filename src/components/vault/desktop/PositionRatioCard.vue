<template>
  <v-sheet class="rounded greyscale_6 pa-12 pb-4 ratio-card">
    <div class="body-2">
      {{ $t("me.collaterals-ratio") }}
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
class PositionRatioCard extends Vue {}
export default PositionRatioCard;
</script>

<style lang="scss" scoped>
.ratio-card {
  height: 100%;
}
</style>
