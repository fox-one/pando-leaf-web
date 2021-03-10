<template>
  <f-panel v-if="url && !isMixin" flat>
    <v-layout column align-center>
      <f-qr-code v-if="url && !isMixin" :text="url" :size="260" />
    </v-layout>
  </f-panel>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class PayQrcode extends Vue {
  @Prop() url!: string;

  get isMixin() {
    return this.$utils.helper.isMixin();
  }
}
export default PayQrcode;
</script>

<style></style>
