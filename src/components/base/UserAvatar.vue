<template>
  <v-avatar v-bind="$attrs" v-on="$listeners">
    <v-img v-if="avatar" :src="avatar" />
    <span v-else class="white--text">{{ shortName }}</span>
  </v-avatar>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class UserAvatar extends Vue {
  @Prop() avatar!: string;

  @Prop() name!: string;

  get shortName() {
    return this.name?.[0] ?? "-";
  }
}
export default UserAvatar;
</script>
