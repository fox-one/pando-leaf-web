<template>
  <div>
    <template v-for="(item, index) in informations">
      <div
        v-if="item === 'divider'"
        :key="index"
        class="pt-2 greyscale_6 mx-n4"
      />
      <base-information-item
        v-else
        :key="index"
        :label="item.label"
        :value="item.value"
        :hint="item.hint"
        :changed-value="item.changedValue"
        :changed-value-color="item.changedValueColor"
        :value-color="item.valueColor"
        :value-unit="item.valueUnit"
        :show-change="item.showChange"
        :last="informations[index + 1] === 'divider'"
        :learn-more="item.learnMore"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import BaseInformationItem from "./InformationItem.vue";

@Component({
  components: {
    BaseInformationItem,
  },
})
export default class InformationItemList extends Vue {
  @Prop() informations!: any[];
}
</script>
