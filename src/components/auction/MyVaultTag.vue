<template>
  <div class="d-flex flex-column align-center">
    <icon-auction-triangle
      v-if="triangle"
      class="icon-triagnle"
    ></icon-auction-triangle>
    <span class="top-arrow-tag"> {{ $t("common.my-vault") }}</span>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {},
})
export default class CountDownTimer extends Vue {
  @Prop({ default: true }) triangle!: boolean;
}
</script>

<style lang="scss" scoped>
.icon-triagnle {
  color: #f58721;
}

.top-arrow-tag {
  color: white;
  background: #f58721;
  border-radius: 28px;
  padding: 6px 10px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
}
</style>
