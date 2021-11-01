import utils from "~/utils";
import { getNextPairPrice } from "~/utils/oracle";

export function getMarketFields(_: any, getters: Getter.GettersTree) {
  return (id: string) => {
    const getCollateralById: State.GetCollateralById =
      getters["collateral/getCollateralById"];
    const getAssetById: State.GetAssetById = getters["asset/getAssetById"];

    const collateral = getCollateralById(id ?? "");
    const mat = Number(collateral?.mat ?? "0");
    const rate = Number(collateral?.rate ?? "1");
    const price = Number(collateral?.price ?? "0");
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

    const collateralFiat = collateralAmount * price;

    const maxAvailable = Math.max(
      Number(collateral?.line) -
        Number(collateral?.art) * Number(collateral?.rate),
      0
    );

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
      mat,
      rate,
      price,
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

export function getPredictions(_: any, getters: Getter.GettersTree) {
  return (deposit: number, mint: number, collateral: API.Collateral) => {
    // 抵押率
    const collateralizationRatio = (deposit * Number(collateral?.price)) / mint;

    // 清算价格计算
    const liquidationPrice = (mint * Number(collateral?.mat || "0")) / deposit;

    // stabilityFee: duty = 1.03 , fee rate: 0.03
    const stabilityFee = +collateral?.duty - 1;

    // 该类型最多可铸币
    const maxToGenerate = utils.collateral.maxAvailable(collateral);

    // 本仓库最大可铸币
    let maxAvailable =
      (deposit * Number(collateral?.price || "0")) / Number(collateral?.mat);
    if (maxAvailable > maxToGenerate) {
      maxAvailable = maxToGenerate;
    }
    return {
      collateralizationRatio,
      liquidationPrice,
      stabilityFee,
      maxToGenerate,
      maxAvailable,
    };
  };
}
