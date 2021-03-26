<template>
  <div class="f-greyscale-3 f-caption text-center pa-5">
    {{ $t("empty") }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class EmptySection extends Vue {}
export default EmptySection;
</script>
