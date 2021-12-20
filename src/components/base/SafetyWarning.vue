<template>
  <div>
    <div class="title">{{ $t("safety-warning") }}</div>
    <div class="content">{{ $t("safety-warning-content") }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class SafetyWarning extends Vue {}
export default SafetyWarning;
</script>
<style lang="scss" scoped>
.title {
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
}
.content {
  font-weight: normal;
  margin-top: 16px;
  font-size: 12px;
  line-height: 15px;
  color: var(--v-greyscale_3-base);
}
</style>
