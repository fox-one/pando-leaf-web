<template>
  <f-button-tabs :value="value" @change="handleChange">
    <template #tabs>
      <v-btn
        v-for="(item, index) in tabs"
        :key="index"
        :data-value="index"
        :ripple="false"
      >
        <span>{{ item.text }}</span>
      </v-btn>
    </template>
  </f-button-tabs>
</template>

<script lang="ts">
import { Component, Vue, Model } from "vue-property-decorator";

@Component
class DetailTabs extends Vue {
  @Model("change") value!: number;

  get tabs() {
    return [
      {
        text: this.$t("vault.tab.details"),
      },
      {
        text: this.$t("vault.tab.history"),
      },
    ];
  }

  handleChange(value) {
    this.$emit("change", value);
  }
}
export default DetailTabs;
</script>
