import Vue from "vue";
import VueI18n from "vue-i18n";
import en from "@/lang/en-US.json";
import zh from "@/lang/zh-CN.json";

Vue.use(VueI18n);

const messages = {
  en,
  zh,
};

export default new VueI18n({
  fallbackLocale: "en",
  locale: "cn",
  messages,
});
