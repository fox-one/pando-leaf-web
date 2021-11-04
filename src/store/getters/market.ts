import { format, toPercent } from "@foxone/utils/number";
import BigNumber from "bignumber.js";
import utils from "~/utils";
import { isValid } from "~/utils/number";
import { getNextPairPrice } from "~/utils/oracle";

export function getMarketFields(_: any, getters: Getter.GettersTree) {
  return (id: string) => {
    const getCollateralById: State.GetCollateralById =
      getters["collateral/getCollateralById"];
    const getAssetById: State.GetAssetById = getters["asset/getAssetById"];

    const collateral = getCollateralById(id ?? "");
    const minimumRatio = Number(collateral?.mat ?? "0");
    const rate = Number(collateral?.rate ?? "1");
    const collateralPrice = Number(collateral?.price ?? "0");
    const duty = Number(collateral?.duty ?? "1");
    const chop = Number(collateral?.chop ?? "0");

    const collateralAsset = getAssetById(collateral?.gem ?? "");
    const debtAsset = getAssetById(collateral?.dai ?? "");

    const collateralSymbol = collateralAsset?.symbol ?? "";
    const debtSymbol = debtAsset?.symbol ?? "";

    const collateralAssetPrice = Number(collateralAsset?.price ?? "0");
    const debtAssetPrice = Number(debtAsset?.price ?? "0");

    const collateralAmount = Number(collateral?.ink ?? "0");
    const debtAmount = Number(collateral?.art) * rate;

    const collateralFiat = collateralAmount * collateralPrice;

    const maxAvailable = Math.max(
      Number(collateral?.line) -
        Number(collateral?.art) * Number(collateral?.rate),
      0
    );

    // mat
    const minimumRatioText = toPercent({ n: minimumRatio });

    // 稳定费率
    const stabilityFee = duty - 1;

    //清算罚金费率
    const liquidationPenalty = chop;

    // 交易对下个价格
    const nextPrice = getNextPairPrice(getters, {
      base: collateral?.gem ?? "",
      quote: collateral?.dai ?? "",
    });

    return {
      collateral,
      minimumRatio,
      minimumRatioText,
      rate,
      collateralPrice,
      duty,
      chop,
      collateralAmount,
      debtAmount,
      collateralAsset,
      debtAsset,
      collateralSymbol,
      debtSymbol,
      collateralAssetPrice,
      debtAssetPrice,
      collateralFiat,
      maxAvailable,
      stabilityFee,
      liquidationPenalty,
      nextPrice,
    };
  };
}

export function openVaultPrediction(_: any, getters: Getter.GettersTree) {
  return (deposit: number, mint: number, collateral: API.Collateral | null) => {
    // 抵押率
    const collateralizationRatio = (deposit * Number(collateral?.price)) / mint;
    let collateralizationRatioText = toPercent({
      n: collateralizationRatio,
      dp: 1,
    });
    if (!isValid(collateralizationRatio)) {
      collateralizationRatioText = "-";
    }

    // 清算价格计算
    const liquidationPrice = (mint * Number(collateral?.mat || "0")) / deposit;
    let liquidationPriceText = format({ n: liquidationPrice });
    if (!isValid(liquidationPrice) || liquidationPrice === 0) {
      liquidationPriceText = `-`;
    }

    // stabilityFee: duty = 1.03 , fee rate: 0.03
    const stabilityFee = +(collateral?.duty ?? "1.03") - 1;
    const stabilityFeeText = toPercent({ n: stabilityFee });

    // 该类型最多可铸币
    const maxToGenerate = utils.collateral.maxAvailable(collateral);
    const maxToGenerateText = format({ n: maxToGenerate });

    // 本仓库最大可铸币
    let maxAvailable =
      (deposit * Number(collateral?.price || "0")) / Number(collateral?.mat);
    if (maxAvailable > maxToGenerate) {
      maxAvailable = maxToGenerate;
    }
    const maxAvailableText = format({
      n: maxAvailable,
      max_dp: 8,
      mode: BigNumber.ROUND_DOWN,
    });
    return {
      collateralizationRatio,
      collateralizationRatioText,
      liquidationPrice,
      liquidationPriceText,
      stabilityFee,
      stabilityFeeText,
      maxToGenerate,
      maxToGenerateText,
      maxAvailable,
      maxAvailableText,
    };
  };
}
