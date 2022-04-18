<template>
  <f-bottom-sheet v-model="dialog" :title="$t('chart')">
    <template #activator="{ on }">
      <div v-if="showSwitcher" class="type-field type-field--switch" v-on="on">
        <span class="mr-2 f-body-2">{{ display }}</span>
        <v-icon v-if="showSwitcher" size="16"> $FIconChevronDown4P </v-icon>
      </div>
      <div v-else class="type-field">
        <span class="mr-2 f-body-2">{{ display }}</span>
      </div>
    </template>

    <base-select-item
      v-for="(item, index) in types"
      :key="index"
      :title="item.text"
      :value="item.value"
      :active="item.value === bindValue"
      @select="handleSelect"
    />
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from "vue-property-decorator";

@Component
class TypeSelect extends Vue {
  @PropSync("value") bindValue;

  @Prop() types;

  dialog = false;

  get showSwitcher() {
    return this.types.length > 1;
  }

  get display() {
    return this.types.find((x) => x.value === this.bindValue)?.text;
  }

  handleSelect(value) {
    this.dialog = false;
    this.bindValue = value;
  }

  handleClick(on) {
    if (this.showSwitcher) {
      on.click();
    }
  }
}
export default TypeSelect;
</script>

<style lang="scss" scoped>
.type-field {
  display: inline-block;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  border-radius: 8px;

  &--switch {
    padding: 8px 12px;
    background: var(--v-forth-base);
  }
}
</style>
