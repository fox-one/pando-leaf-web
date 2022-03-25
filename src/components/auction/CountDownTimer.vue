<template>
  <div class="text-center d-flex">{{ hour }}:{{ minute }}:{{ second }}</div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import dayjs from "dayjs";

@Component({
  components: {},
})
export default class CountDownTimer extends Vue {
  @Prop() diffSeconds!: number;

  countDownTimer = 0;

  countDownText = "";

  countId = 0 as any;

  hour = "00";

  minute = "00";

  second = "00";

  format(duration) {
    return dayjs.duration(duration, "seconds").format("HH:mm:ss");
  }

  @Watch("diffSeconds", { immediate: true })
  start() {
    if (this.diffSeconds <= 0) {
      this.stop();
      return;
    }

    clearInterval(this.countId);
    this.countDownTimer = this.diffSeconds;
    this.setUpTimer();
    this.countId = setInterval(() => {
      this.setUpTimer();
    }, 1000);
  }

  setUpTimer() {
    this.countDownTimer--;
    this.countDownText = this.format(this.countDownTimer);
    this.countDownText.split(":").forEach((item, index) => {
      if (index === 0) {
        this.hour = item;
      } else if (index === 1) {
        this.minute = item;
      } else if (index === 2) {
        this.second = item;
      }
    });
    if (this.countDownTimer <= 0) {
      clearInterval(this.countId);
    }
  }

  stop() {
    this.countDownTimer = 0;
    this.countDownText = "";
    this.hour = "00";
    this.minute = "00";
    this.second = "00";
    clearInterval(this.countId);
  }

  beforeDestroy() {
    clearInterval(this.countId);
  }
}
</script>

<style lang="scss" scoped>
.count-down-timer {
  color: #9fc665;
}
</style>
