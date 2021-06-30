<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ICollateral } from "~/services/types/vo";

@Component({})
export default class CollateralsRatio extends Vue {
  @Prop() collaterals!: ICollateral[];
}
</script>
<style lang="scss"></style>
