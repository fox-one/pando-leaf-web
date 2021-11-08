<template>
  <v-dialog v-model="dialog" max-width="340">
    <f-panel class="px-8">
      <v-card-title class="justify-center">
        <v-icon color="error">$warning</v-icon>
        <span class="ml-2"> {{ $t("common.warning") }} </span>
      </v-card-title>
      <v-card-text class="error--text warning-content pa-4 rounded">
        <div>{{ $t("risk.warning.text_1") }}</div>
        <div class="risk my-2">{{ riskText }}</div>
        <div>
          {{ $t("risk.warning.text_2") }}
        </div>
        <div>
          {{ $t("risk.warning.text_3") }}
        </div>
      </v-card-text>
      <v-card-actions class="actions">
        <div>
          <f-button
            v-if="action"
            :disabled="time > 0"
            color="primary"
            @click="handleConfirm"
          >
            {{ text }}
          </f-button>
        </div>
        <div class="mt-4">
          <f-button @click="handleCancel">
            {{ $t("common.cancel") }}
          </f-button>
        </div>
      </v-card-actions>
    </f-panel>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { EVENTS } from "@/constants";

type Action = {
  text?: string;
  callback?: (...args: any) => void;
};

@Component
class RiskWarning extends Vue {
  dialog = false;

  action: Action = {};

  risk: string | number = 0;

  time = 60;

  timer: any = null;

  get riskText() {
    return this.$utils.number.toPercent({ n: this.risk });
  }

  get text() {
    if (this.time > 0) {
      return `${this.action.text} (${this.time}s)`;
    }

    return this.action.text;
  }

  mounted() {
    this.$root.$on(
      EVENTS.OPEN_RISK_WARN,
      (opts: { risk: string | number; timer?: number; action?: Action }) => {
        this.dialog = true;
        this.action = opts.action ?? {};
        this.timer = opts.timer ?? 60;
        this.risk = opts.risk;
      }
    );
  }

  @Watch("dialog")
  handleDialogChange(value: boolean) {
    if (value) {
      this.startTimer();
    } else {
      this.timer && clearTimeout(this.timer);
      this.reset();
    }
  }

  reset() {
    this.risk = 0;
    this.time = 60;
    this.timer = null;
    this.action = {};
  }

  handleCancel() {
    this.dialog = false;
  }

  handleConfirm() {
    this.dialog = false;
    this.action.callback?.();
  }

  startTimer() {
    this.timer = setTimeout(() => {
      this.time -= 1;

      if (this.time > 0) {
        this.startTimer();
      } else {
        clearTimeout(this.timer);
      }
    }, 1000);
  }
}
export default RiskWarning;
</script>

<style lang="scss" scoped>
.warning-content {
  background-color: rgba($color: #f44c4c, $alpha: 0.1);
}

.theme--dark .warning-content {
  background-color: rgba($color: #f29a60, $alpha: 0.3);
}

.risk {
  color: var(--v-risk_emphasize-base);
  font-size: 18px;
  font-weight: 700;
}

.actions {
  padding-top: 32px;
  flex-direction: column;
}
</style>
