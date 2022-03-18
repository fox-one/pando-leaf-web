import { toPrecision } from "@foxone/utils/number";
import { FlipAction } from "~/enums";

export function getFlipFields(_: any, getters: Getter.GettersTree) {
  return (flip: API.Flip) => {
    const getCollateralById: State.GetCollateralById =
      getters["collateral/getCollateralById"];
    const getAssetById: State.GetAssetById = getters["asset/getAssetById"];
    const vault = getters["vault/getVaultById"](flip.vault_id);
    const isMyVault = Boolean(vault);

    const isYourBid = flip.guy === getters["account/userId"];
    const flipKickEvent = getters["auctions/flipKickEvent"];
    const vaultCollateralAmount = flipKickEvent?.lot;
    const vaultDebtAmount = flip.tab;

    const collateral = getCollateralById(flip?.collateral_id ?? "");
    const auctionAsset = getAssetById(collateral?.gem ?? "");
    const debtAsset = getAssetById(collateral?.dai ?? "");
    const isDone = flip.action === FlipAction.FlipDeal;
    const isStage1 = Number(flip.bid) < Number(flip.tab) && !isDone;
    const isStage2 = Number(flip.bid) >= Number(flip.tab) && !isDone;
    const collateralPrice = auctionAsset?.price ?? "";
    const debtPrice = debtAsset?.price ?? "";
    const collateralValue = toPrecision({
      n: (Number(collateralPrice) * Number(flip.lot)) / Number(debtPrice),
    });
    const auctionSymbol = auctionAsset?.symbol ?? "";
    const debtSymbol = debtAsset?.symbol ?? "";

    let minBid = "0",
      maxBid = "0",
      curPrice = "",
      debtFiatValue = 0,
      collateralFiatValue = 0;

    const debt2collateral = toPrecision({
      n: +debtPrice / +collateralPrice,
    });

    const collateral2debt = toPrecision({
      n: 1 / +debt2collateral,
    });

    minBid = toPrecision({
      n: +flip.bid * +(collateral?.beg ?? "1.03"),
      dp: 8,
      mode: 2,
    });

    maxBid = isStage1
      ? toPrecision({ n: flip.tab, dp: 8 })
      : toPrecision({
          n: +flip.lot / +(collateral?.beg ?? "1.03"),
          dp: 8,
        });

    if (+minBid >= +maxBid) minBid = maxBid;

    curPrice = isStage1
      ? `1 ${debtSymbol} = ${debt2collateral} ${auctionSymbol}`
      : `1 ${auctionSymbol} = ${collateral2debt} ${debtSymbol}`;

    debtFiatValue = +debtPrice * +flip.tab;

    collateralFiatValue = +collateralPrice * +flip.lot;

    return {
      flip,
      collateral,
      auctionAsset,
      auctionSymbol,
      collateralPrice,
      collateralValue,
      collateral2debt,
      debtAsset,
      debtSymbol,
      debtPrice,
      isDone,
      isStage1,
      isStage2,
      minBid,
      maxBid,
      curPrice,
      debtFiatValue,
      collateralFiatValue,
      vaultCollateralAmount,
      vaultDebtAmount,
      isYourBid,
      isMyVault,
    };
  };
}
