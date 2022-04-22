<template>
  <div class="empty">
    {{ $t("auction.empty") }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.empty {
  background: url(../../assets/images/no_auction.png) no-repeat 110px / 110px;
  background-position-x: center;
  background-position-y: calc(100% - 52px);
  padding-top: 32.5vh;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--v-greyscale_3-base);
}
</style>
