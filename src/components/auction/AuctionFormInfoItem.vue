<template>
  <v-layout class="action-form-info-item" align-center>
    <div class="greyscale_3--text">{{ label }}</div>

    <div class="ml-1" v-if="hint">
      <base-tooltip :hint="hint"></base-tooltip>
    </div>

    <v-spacer />

    <div
      class="font-weight-medium"
      :class="valueColor + '--text'"
      @click.stop="handleFill"
    >
      {{ value }}
    </div>

    <v-icon v-if="fillable" size="12" class="ml-1" @click.stop="handleFill">
      $fill
    </v-icon>
  </v-layout>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {},
})
export default class AuctionFormInfoItem extends Vue {
  @Prop() flip!: API.Flip;

  @Prop() label!: string;

  @Prop() hint!: string;

  @Prop() value!: string;

  @Prop({ default: "greyscale_1" }) valueColor!: string;

  @Prop({ default: false }) fillable!: boolean;

  handleFill() {
    this.$emit("fill");
  }
}
</script>

<style lang="scss" scoped>
.action-form-info-item {
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
}
</style>
