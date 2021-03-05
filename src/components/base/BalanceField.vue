<template>
  <div>
    <span v-if="isLogged">
      钱包余额:
      <a @click="$emit('click:balance', balance)">{{ balance }}</a>
      {{ symbol }}
    </span>
    <a v-else @click="handleLogin">登录查看余额</a>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component({
  inheritAttrs: false,
})
class BalanceField extends Vue {
  @Prop() balance!: string;

  @Prop() symbol!: string;

  @Getter("auth/isLogged") isLogged;

  handleLogin() {
    this.$utils.helper.requestLogin(this);
  }
}
export default BalanceField;
</script>
