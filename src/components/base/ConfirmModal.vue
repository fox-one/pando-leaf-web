<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title
        class="f-error font-weight-bold d-flex flex-column justify-center align-center"
      >
        <div class="mb-2">
          <v-icon size="64" color="error">{{ $icons.mdiAlert }}</v-icon>
        </div>
        <h3>{{ $t("notice.title") }}</h3>
      </v-card-title>
      <v-card-text class="text-center pb-2">
        <div class="prediction mb-1 f-bg-greyscale-6 py-2 border-radius">
          <div>
            <span class="f-greyscale-1">{{ currentRate.toFixed(2) }}%</span
            ><br />
            <span class="f-caption">{{ $t("notice.current-rate") }}</span>
          </div>
          <v-divider class="my-2" />
          <div>
            <span class="f-greyscale-1">{{ liquidationRate.toFixed(2) }}%</span>
            <br /><span class="f-caption">{{
              $t("notice.liquidation-rate")
            }}</span>
          </div>
        </div>
        {{ $t("notice.content.p1") }}
        <span class="f-title-3 f-error"> {{ currentRate.toFixed(2) }}% </span>
        {{ $t("notice.content.p2") }} <br />
        <span class="f-error font-weight-bold">
          {{ $t("notice.content.p3") }}</span
        >
      </v-card-text>
      <v-card-actions class="d-flex justify-center align-center pb-6">
        <div class="d-flex flex-column justify-center align-center">
          <f-button type="primary" block @click="dialog = false">
            {{ $t("common.cancel") }}
          </f-button>
          <f-button
            type="subtitle"
            class="mt-2"
            block
            :disabled="!validated"
            @click="handleConfirm"
          >
            {{ $t("common.continue") }}
            {{ counter ? `(${counter})` : "" }}
          </f-button>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class ConfirmModal extends Vue {
  @Prop() currentRate!: number;

  @Prop() liquidationRate!: number;

  dialog = false;

  counter = 0;

  timer: any = null;

  get validated() {
    return this.counter === 0;
  }

  get risk() {
    return Math.round(
      Number(this.liquidationRate) - Number(this.currentRate) + 60
    );
  }

  show() {
    this.dialog = true;
    this.counter = this.risk;
    this.startCountDown();
  }

  startCountDown() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.decreaseCounter();
  }

  decreaseCounter() {
    if (this.counter === 0) {
      return;
    }
    this.timer = setTimeout(() => {
      this.counter -= 1;
      this.decreaseCounter();
    }, 1000);
  }

  handleConfirm() {
    this.dialog = false;
    this.$emit("confirm");
  }
}
export default ConfirmModal;
</script>
<style lang="scss" scoped>
.prediction {
  line-height: 1.2;
}
</style>
