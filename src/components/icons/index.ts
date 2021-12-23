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
    iconChevronDown: {
      component: "icon-chevron-down",
    },
    iconListArrow: {
      component: "icon-list-arrow",
    },
    iconHome: {
      component: "icon-home",
    },
    iconMarket: {
      component: "icon-market",
    },
    iconAuctions: {
      component: "icon-auctions",
    },
    iconPointerRight: {
      component: "icon-pointer-right",
    },
    iconQuestion: {
      component: "icon-question",
    },
    iconSearch: {
      component: "icon-search",
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
    iconMoreInfo: {
      component: "icon-more-info",
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
    iconTotalCardTexture: {
      component: "icon-total-card-texture",
    },
    iconPusd: {
      component: "icon-pusd",
    },
    iconSetMax: {
      component: "icon-set-max",
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
