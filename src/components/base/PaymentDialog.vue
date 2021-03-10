<template>
  <v-dialog v-model="show">
    <f-panel>
      <v-layout column align-center>
        <div></div>
        <f-qr-code :text="url" :size="260" />
        <div class="my-4 f-body-2 f-greyscale-2 text-center">
          {{ $t("common.qr") }}
        </div>
        <f-button color="primary" @click="cancel">{{
          $t("common.close")
        }}</f-button>
      </v-layout>
    </f-panel>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";

@Component
export default class PaymentDialog extends Vue {
  @Prop() url;
  @Prop() show;

  @Emit()
  cancel(val) {
    // emit cancel event,do nothing here
  }
}
</script>

<style></style>
