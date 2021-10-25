<template>
  <f-app-bar v-bind="appbar" @back="handleBack" class="appbar--no-shadow">
    <action-create-vault @itemclick="handleItemclick">
      <template v-slot:activator="{ on }">
        <v-layout
          align-center
          justify-center
          class="greyscale_1--text pr-5"
          @click.stop="on.click"
        >
          <h4 class="mx-1">
            {{ appbar.customTitle }}
          </h4>
          <v-icon size="16" color="primary"> $iconChevronDown </v-icon>
        </v-layout>
      </template>
    </action-create-vault>
  </f-app-bar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ActionCreateVault from "../ActionCreateVault.vue";

@Component({
  components: {
    ActionCreateVault,
  },
})
export default class extends Vue {
  @Prop() appbar;

  handleBack() {
    this.$router.back();
  }

  handleItemclick(item: API.Collateral) {
    this.$emit("change", item);
  }
}
</script>

<style lang="scss" scoped>
.appbar--no-shadow {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0) !important;
}
</style>
