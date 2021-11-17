<template>
  <f-input
    class="search"
    :value="value"
    :label="$t('common.search')"
    @focus="handleFocus(true)"
    @blur="handleFocus(false)"
    @input="(e) => $emit('change', e)"
    @change="(e) => $emit('change', e)"
  >
    <template #prependInner>
      <icon-search v-show="prependInner" class="mt-1 mr-2" />
    </template>
  </f-input>
</template>

<script lang="ts">
import { Component, Model, Vue } from "vue-property-decorator";

@Component
class Search extends Vue {
  @Model("change") value!: string;

  isFocus = false;

  get prependInner() {
    return !this.value && !this.isFocus;
  }

  handleFocus(bool: boolean) {
    this.isFocus = bool;
  }
}
export default Search;
</script>
