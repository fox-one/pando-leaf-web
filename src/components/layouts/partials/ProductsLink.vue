<template>
  <f-bottom-sheet
    v-model="dialog"
    :adaptive="true"
    max-width="600"
    nudge-top="-20"
    overlay-opacity="0.9"
    desktop-wapper="menu"
    :title="$t('common.jump-to')"
  >
    <template #activator="{ on }">
      <slot name="activator" :on="{ on }">
        <div v-on="on" class="d-flex align-center">
          <v-icon size="65" class="mr-1"> $iconLeaf </v-icon>
          <v-icon size="16" color="primary"> $iconChevronDown </v-icon>
        </div>
      </slot>
    </template>
    <div
      v-for="(item, index) in items"
      align-center
      class="pa-4 d-flex align-center body-1"
      :key="index"
      :class="[item.disabled ? 'greyscale_4--text' : 'greyscale_1--text']"
      @click="handleToProduct(item, index)"
    >
      <div>
        {{ item.title }}
      </div>
      <v-spacer />
      <v-icon v-if="item.check" size="20"> {{ $icons.mdiCheck }}</v-icon>
    </div>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class PandoProductionNav extends Vue {
  dialog = false;

  get items() {
    return [
      {
        title: "Pando Lakes (Coming soon)",
        check: false,
        disabled: true,
        href: "#",
      },
      {
        title: "Pando Leaf",
        check: true,
        disabled: false,
        href: "#",
      },
      {
        title: "Pando Rings (Coming soon)",
        check: false,
        disabled: true,
        href: "#",
      },
    ];
  }

  handleToProduct(item) {
    window.location.href = item.href;
  }
}
export default PandoProductionNav;
</script>
