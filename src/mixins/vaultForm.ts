// Todo the base vault form.
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Mutation } from "vuex-class";
import PageView from "./page";

export interface VaultForm extends Vue {
  updateWalletAssets: () => void;
}

@Component
export default class VaultFormPage extends PageView {}
