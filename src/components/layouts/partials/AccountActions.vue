<template>
  <div>
    <f-list-item
      :title="$t('me.learn.more')"
      hide-tail
      @click="handleLearnMore"
    >
      <template #head>
        <v-icon>$FIconDocumentFill</v-icon>
      </template>
    </f-list-item>

    <f-list-item :title="$t('contact.us')" hide-tail @click="handleContact">
      <template #head>
        <v-icon>$FIconCommentFill</v-icon>
      </template>
    </f-list-item>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { PANDO_DOC } from "@/constants";

@Component
class AccountActions extends Vue {
  handleLearnMore() {
    location.assign(PANDO_DOC);
  }

  handleContact() {
    this.$router.push({ name: "contacts" });
  }
}
export default AccountActions;
</script>
