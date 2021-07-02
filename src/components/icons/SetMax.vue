<template>
  <svg
    width="12"
    height="13"
    viewBox="0 0 12 13"
    class="icon"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6" cy="6.5" r="6" :fill="colors[1]" />
    <path
      d="M6 9.72094L6.00048 6.52905"
      :stroke="colors[0]"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M4 3.72095L8 3.72095"
      :stroke="colors[0]"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M4 7.7207L5.99981 5.7209L8.00005 7.72114"
      :stroke="colors[0]"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";

@Component
class IconSearch extends Vue {
  @State((state) => state.app.settings.dark) isDark;

  get colors() {
    return this.isDark ? ["#000000", "#ffffff"] : ["#ffffff", "#000000"];
  }
}
export default IconSearch;
</script>

<style lang="scss" scoped>
.icon {
  fill: none;
}
</style>
