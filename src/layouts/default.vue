<template>
  <default-layout />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DefaultLayout from "@/components/layouts/default/Index.vue";

@Component({
  components: {
    DefaultLayout,
  },
})
class NuxtDefaultLayout extends Vue {
  mounted() {
    this.$utils.app.initApp(this);
  }
}
export default NuxtDefaultLayout;
</script>
