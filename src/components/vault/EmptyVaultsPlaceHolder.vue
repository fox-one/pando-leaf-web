<template>
  <v-layout column align-center justify-center>
    <v-icon class="mb-8" size="110">$iconNoVault</v-icon>
    <div class="greyscale_1--text body-2 mb-8">{{ $t("me.no-vault-1") }}</div>

    <action-create-vault @itemclick="handleItemclick">
      <template #activator="{ on }">
        <slot name="activator" :on="on">
          <f-button
            rounded
            depressed
            color="primary"
            :min-width="220"
            v-on="on"
          >
            <v-icon size="16">$FIconAdd</v-icon>
            <span>{{ $t("common.add-a-vault") }}</span>
          </f-button>
        </slot>
      </template>
    </action-create-vault>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ActionCreateVault from "./ActionCreateVault.vue";

@Component({
  components: {
    ActionCreateVault,
  },
})
class EmptyPlaceHolder extends Vue {
  handleItemclick(item: API.Collateral) {
    this.$router.push({ name: "vault-open", query: { id: item.id } });
  }
}
export default EmptyPlaceHolder;
</script>
