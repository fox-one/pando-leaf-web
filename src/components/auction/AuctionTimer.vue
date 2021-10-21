<template>
  <div class="text-center status-timer">
    <span class="ml-2 statusbar-timer-ends">
      {{ $t("auction.statusbar.ends") }}
    </span>
    {{ countDownText }}
    <span class="ml-2 statusbar-timer-ends">
      {{ $t("auction.statusbar.ends-shuffix") }}
    </span>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import dayjs from "dayjs";

@Component({
  components: {},
})
export default class AuctionTimer extends Vue {
  @Prop() flip!: API.Flip;

  countDownTimer = 0;

  countDownText = "";

  countId = 0 as any;

  format(duration) {
    return dayjs.duration(duration, "seconds").format("HH:mm:ss");
  }

  @Watch("flip", { immediate: true })
  updateTimer() {
    this.countDownTimer = dayjs(this.flip.tic).diff(dayjs(), "seconds");
    if (
      dayjs(this.flip.tic).unix() === 0 ||
      dayjs(this.flip.tic).isAfter(dayjs(this.flip.end))
    ) {
      this.countDownTimer = dayjs(this.flip.end).diff(dayjs(), "seconds");
    }
    this.countDownText = this.format(this.countDownTimer);
    this.startCountDown();
  }

  startCountDown() {
    if (this.countDownTimer <= 0) return;
    clearInterval(this.countId);
    this.countId = setInterval(() => {
      this.countDownTimer = dayjs(this.flip.tic).diff(dayjs(), "seconds");
      if (
        dayjs(this.flip.tic).unix() === 0 ||
        dayjs(this.flip.tic).isAfter(dayjs(this.flip.end))
      ) {
        this.countDownTimer = dayjs(this.flip.end).diff(dayjs(), "seconds");
      }
      this.countDownText = this.format(this.countDownTimer);
      if (this.countDownTimer <= 0) {
        clearInterval(this.countId);
      }
    }, 1000);
  }

  beforeDestroy() {
    clearInterval(this.countId);
  }
}
</script>

<style lang="scss" scoped>
.status-timer {
  position: fixed;
  top: 44px;
  left: 0;
  z-index: 99;
  width: 100vw;
  line-height: 17px;
  font-weight: bold !important;
  &-ends {
    font-weight: normal !important;
    opacity: 0.5;
  }
}
</style>
