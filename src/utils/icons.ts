// import * as FIcons from "@foxone/icons";
import FIconUpRight from "@foxone/icons/FIconUpRight";
import FIconPersonFill from "@foxone/icons/FIconPersonFill";
import FIconBankFill from "@foxone/icons/FIconBankFill";
import FIconAdd3PFill from "@foxone/icons/FIconAdd3PFill";
import FIconAdd from "@foxone/icons/FIconAdd";
import FIconChevronDown from "@foxone/icons/FIconChevronDown";
import FIconRingsBrand from "@foxone/icons/FIconRingsBrand";
import FIconCheck from "@foxone/icons/FIconCheck";
import FIconChevronLeft from "@foxone/icons/FIconChevronLeft";
import FIconChevronRight from "@foxone/icons/FIconChevronRight";
import FIconSupplyFill from "@foxone/icons/FIconSupplyFill";
import FIconBorrowFill from "@foxone/icons/FIconBorrowFill";
import FIconRepayFill from "@foxone/icons/FIconRepayFill";
import FIconWithdrawFill from "@foxone/icons/FIconWithdrawFill";
import FIconPledgeFill from "@foxone/icons/FIconPledgeFill";
import FIconUnpledgeFill from "@foxone/icons/FIconUnpledgeFill";
import FIconInfo4P from "@foxone/icons/FIconInfo4P";
import FIconUpRight3PFill from "@foxone/icons/FIconUpRight3PFill";
import FIconConnect3PFill from "@foxone/icons/FIconConnect3PFill";
import FIconChevronDown4P from "@foxone/icons/FIconChevronDown4P";
import FIconChevronRight4P from "@foxone/icons/FIconChevronRight4P";
import FIconChevronLeft4P from "@foxone/icons/FIconChevronLeft4P";
import FIconLink4P from "@foxone/icons/FIconLink4P";
import FIconDocument from "@foxone/icons/FIconDocument";
import FIconComment from "@foxone/icons/FIconComment";
import FIconInformation3PFill from "@foxone/icons/FIconInformation3PFill";
import FIconExchange4PBold from "@foxone/icons/FIconExchange4PBold";
import FIconAdd4P from "@foxone/icons/FIconAdd4P";
import FIconAdd4PBold from "@foxone/icons/FIconAdd4PBold";
import FIconArrowRight4P from "@foxone/icons/FIconArrowRight4P";
import FIconFilter from "@foxone/icons/FIconFilter";
import FIconDoneAFill from "@foxone/icons/FIconDoneAFill";
import FIconRadioOff from "@foxone/icons/FIconRadioOff";

const ficons = {
  FIconUpRight: { component: FIconUpRight },
  FIconPersonFill: { component: FIconPersonFill },
  FIconBankFill: { component: FIconBankFill },
  FIconAdd3PFill: { component: FIconAdd3PFill },
  FIconAdd: { component: FIconAdd },
  FIconChevronDown: { component: FIconChevronDown },
  FIconRingsBrand: { component: FIconRingsBrand },
  FIconCheck: { component: FIconCheck },
  FIconChevronLeft: { component: FIconChevronLeft },
  FIconChevronRight: { component: FIconChevronRight },
  FIconSupplyFill: { component: FIconSupplyFill },
  FIconBorrowFill: { component: FIconBorrowFill },
  FIconRepayFill: { component: FIconRepayFill },
  FIconWithdrawFill: { component: FIconWithdrawFill },
  FIconPledgeFill: { component: FIconPledgeFill },
  FIconUnpledgeFill: { component: FIconUnpledgeFill },
  FIconInfo4P: { component: FIconInfo4P },
  FIconUpRight3PFill: { component: FIconUpRight3PFill },
  FIconConnect3PFill: { component: FIconConnect3PFill },
  FIconChevronDown4P: { component: FIconChevronDown4P },
  FIconChevronRight4P: { component: FIconChevronRight4P },
  FIconChevronLeft4P: { component: FIconChevronLeft4P },
  FIconLink4P: { component: FIconLink4P },
  FIconDocument: { component: FIconDocument },
  FIconComment: { component: FIconComment },
  FIconInformation3PFill: { component: FIconInformation3PFill },
  FIconExchange4PBold: { component: FIconExchange4PBold },
  FIconAdd4P: { component: FIconAdd4P },
  FIconAdd4PBold: { component: FIconAdd4PBold },
  FIconArrowRight4P: { component: FIconArrowRight4P },
  FIconFilter: { component: FIconFilter },
  FIconDoneAFill: { component: FIconDoneAFill },
  FIconRadioOff: { component: FIconRadioOff },
};

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
  "IconHome",
  "IconMarket",
  "IconAuctions",
  "IconDeposit",
  "IconDepositOld",
  "IconWithdraw",
  "IconWithdrawOld",
  "IconPayback",
  "IconPaybackOld",
  "IconGenerate",
  "IconGenerateOld",
  "IconAuctionDetail",
  "IconWelcomeImg",
  "IconLeaf",
  "IconNoVault",
  "IconSort",
  "IconSortAsc",
  "IconSortDesc",
  "IconUpdateRight",
  "IconBids",
  "IconBidFill",
  "IconClose",
].reduce((m, k) => ({ ...m, [k]: { component: k } }), {});

export default {
  ...ficons,
  ...icons,
};
