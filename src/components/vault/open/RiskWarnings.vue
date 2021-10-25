<template>
  <div>
    <div class="mx-4 mt-6 text-3 greyscale_1--text font-weight-bold">
      {{ $t("risk.warnings") }}
    </div>

    <div class="mx-4 mt-6 f-caption greyscale_3--text">
      {{ $t("risk.warnings.content1") }}
    </div>

    <div class="mx-4 f-caption greyscale_3--text">
      {{ $t("risk.warnings.content2") }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class extends Vue {}
</script>
