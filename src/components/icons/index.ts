import Vue from "vue";
import upperFirst from "lodash/upperFirst";

const requireComponent = require.context("./", true, /\.vue/);
requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName);
  const componentName = upperFirst(
    fileName.replace(/^\.\//, "").replace(/\.\w+$/, "")
  );
  Vue.component(
    "Icon" + componentName,
    componentConfig.default || componentConfig
  );
});

export function makeIconValues() {
  return {
    iconHome: {
      component: "icon-home",
    },
    iconMarket: {
      component: "icon-market",
    },
    iconAuctions: {
      component: "icon-auctions",
    },
    iconDeposit: {
      component: "icon-deposit",
    },
    iconWithdraw: {
      component: "icon-withdraw",
    },
    iconPayback: {
      component: "icon-payback",
    },
    iconGenerate: {
      component: "icon-generate",
    },
    iconAuctionDetail: {
      component: "icon-auction-detail",
    },
    iconWelcomeImg: {
      component: "icon-welcome-img",
    },
    iconLeaf: {
      component: "icon-leaf",
    },
    iconNoVault: {
      component: "icon-no-vault",
    },
    iconSwitchChart: {
      component: "icon-switch-chart",
    },
    iconSwitchNumber: {
      component: "icon-switch-number",
    },
    iconSort: {
      component: "icon-sort",
    },
    iconSortAsc: {
      component: "icon-sort-asc",
    },
    iconSortDesc: {
      component: "icon-sort-desc",
    },
  };
}
