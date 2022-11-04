<template>
  <v-layout column align-center justify-center>
    <v-icon class="mb-8" size="110">$IconNoVault</v-icon>
    <div class="greyscale_3--text font-weight-medium body-2 mb-8">
      {{ $t("me.no-vault-1") }}
    </div>

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
            <v-icon class="mr-1" size="16">$FIconAdd4PBold</v-icon>

            <span>{{ $t("common.add-a-vault") }}</span>
          </f-button>
        </slot>
      </template>
    </action-create-vault>

    <vault-hidden />
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VaultHidden from "@/components/vault/VaultHidden.vue";
import ActionCreateVault from "@/components/vault/ActionCreateVault.vue";

@Component({
  components: {
    ActionCreateVault,
    VaultHidden,
  },
})
class EmptyPlaceHolder extends Vue {
  handleItemclick(item: API.Collateral) {
    this.$router.push(
      this.localePath({ name: "vault-open", query: { id: item.id } })
    );
  }
}
export default EmptyPlaceHolder;
</script>
