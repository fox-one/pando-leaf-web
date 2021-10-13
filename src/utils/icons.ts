import * as FIcons from "@foxone/icons";

const ficons = [
  "FIconUpRight",
  "FIconPersonFill",
  "FIconBankFill",
  "FIconAdd3PFill",
  "FIconAdd",
  "FIconChevronDown",
  "FIconRingsBrand",
  "FIconCheck",
  "FIconChevronRight",
  "FIconArrowRight",
  "FIconSupplyFill",
  "FIconBorrowFill",
  "FIconRepayFill",
  "FIconWithdrawFill",
  "FIconPledgeFill",
  "FIconUnpledgeFill",
  "FIconInfo4P",
  "FIconUpRight3PFill",
  "FIconConnect3PFill",
  "FIconChevronDown4P",
  "FIconChevronRight4P",
].reduce((m, k) => ({ ...m, [k]: { component: FIcons[k] } }), {});

const icons = [
  "IconWantBorrow",
  "IconWantSupply",
  "IconNotify",
  "IconNext",
  "IconLowRiskFace",
  "IconMidRiskFace",
  "IconHighRiskFace",
  "IconLowRiskFace2",
  "IconMidRiskFace2",
  "IconHighRiskFace2",
  "IconUnpledge",
  "IconPledge",
  "IconSupply",
  "IconWithdraw",
  "IconRepay",
  "IconBorrow",
  "IconArrowUpRight",
  "IconAdd",
  "IconSortNone",
  "IconSortDesc",
  "IconSortAsce",
].reduce((m, k) => ({ ...m, [k]: { component: k } }), {});

export default {
  ...ficons,
  ...icons,
};
