<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title
        class="f-error font-weight-bold d-flex flex-column justify-center align-center"
      >
        <div class="mb-2">
          <v-icon size="64" color="primary">{{ icon }}</v-icon>
        </div>
        <!-- <h3>{{ $t("notice.cnb.title") }}title</h3> -->
      </v-card-title>
      <v-card-text class="pb-2 my-2">
        <div>
          <span>{{ $t("notice.cnb.content1-0") }}</span>
          <span class="font-weight-bold">0.00000001 CNB</span>
          <span>{{ $t("notice.cnb.content1-1") }}</span>
          <span class="font-weight-bold">0</span>
          <span>{{ $t("notice.cnb.content1-2") }}</span>
        </div>
        <div class="mt-2">
          <span>{{ $t("notice.cnb.content2-1") }}</span>
          <span class="font-weight-bold">0</span>
          <span>{{ $t("notice.cnb.content2-2") }}</span>
        </div>
      </v-card-text>
      <v-card-actions class="d-flex justify-center align-center pb-6">
        <div>
          <f-button type="primary" block @click="go4swap">
            {{ $t("notice.to-4swap") }}
          </f-button>
          <f-button type="primary" class="mt-2" block @click="dialog = false">
            {{ $t("notice.cancel") }}
          </f-button>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { mdiAlertCircle } from "@mdi/js";
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";

@Component
export default class NeedCnbModal extends Vue {
  @PropSync("visible") dialog;

  get icon() {
    return mdiAlertCircle;
  }

  go4swap() {
    location.assign(
      "https://f1-4swap-mtg.firesbox.com/#/swap?output=965e5c6e-434c-3fa9-b780-c50f43cd955c"
    );
  }
}
</script>

<style lang="scss" scoped></style>
