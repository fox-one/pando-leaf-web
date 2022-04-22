import { format, toPercent } from "@foxone/utils/number";
import { isValid } from "~/utils/number";
import { getNextPairPrice } from "~/utils/oracle";
import { getRiskLevelMeta } from "~/utils/vault";

export function getVaultFields(_: any, getters: Getter.GettersTree) {
  return (id: string) => {
    const getVaultById: State.GetVaultById = getters["vault/getVaultById"];
    const getCollateralById: State.GetCollateralById =
      getters["collateral/getCollateralById"];
    const getAssetById: State.GetAssetById = getters["asset/getAssetById"];

    const vault = getVaultById(id);
    const collateral = getCollateralById(vault?.collateral_id ?? "");
    const art = Number(vault?.art ?? "0");
    const rate = Number(collateral?.rate ?? "1");
    const price = Number(collateral?.price ?? "0");
    const duty = Number(collateral?.duty ?? "1");
    const chop = Number(collateral?.chop ?? "0");
    const minimumRatio = Number(collateral?.mat ?? "0");

    const collateralAsset = getAssetById(collateral?.gem ?? "");
    const debtAsset = getAssetById(collateral?.dai ?? "");
    const collateralSymbol = collateralAsset?.symbol ?? "";
    const debtSymbol = debtAsset?.symbol ?? "";
    const collateralAssetPrice = Number(collateralAsset?.price ?? "0");
    const debtAssetPrice = Number(debtAsset?.price ?? "0");
    const collateralAmount = Number(vault?.ink ?? "0");
    const debtAmount = art * rate;
    const collateralAmountUSD = collateralAmount * collateralAssetPrice;
    const debtAmountUSD = debtAmount * debtAssetPrice;

    // 稳定费率
    const stabilityFee = duty - 1;
    const stabilityFeeText = toPercent({ n: stabilityFee });

    // 抵押率
    const ratio = debtAmount && (collateralAmount * price) / debtAmount;
    let ratioText = toPercent({
      n: ratio,
      dp: 1,
    });
    if (!isValid(ratio) || ratio === 0) {
      ratioText = "-";
    }

    // 风险等级
    const riskLevelMeta = getRiskLevelMeta(ratio, minimumRatio);

    // 清算价格
    const liquidationPrice = (debtAmount * minimumRatio) / collateralAmount;
    let liquidationPriceText = format({ n: liquidationPrice });
    if (!isValid(liquidationPrice) || liquidationPrice === 0) {
      liquidationPriceText = "-";
    }

    //清算罚金费率
    const liquidationPenalty = chop;

    // 交易对下个价格
    const nextPrice = getNextPairPrice(getters, {
      base: collateral?.gem ?? "",
      quote: collateral?.dai ?? "",
    });

    // 可借数量
    const avaliableDebt =
      (collateralAmount * price) / minimumRatio - debtAmount;

    // 可提现数量
    const avaliableWithdraw =
      collateralAmount - (minimumRatio * debtAmount) / price;

    return {
      vault,
      collateral,
      collateralAsset,
      debtAsset,
      collateralSymbol,
      debtSymbol,
      collateralAmount,
      debtAmount,
      collateralAmountUSD,
      debtAmountUSD,
      stabilityFee,
      stabilityFeeText,
      ratio,
      ratioText,
      riskLevelMeta,
      liquidationRatio: minimumRatio,
      liquidationPrice,
      liquidationPriceText,
      liquidationPenalty,
      price,
      nextPrice,
      avaliableDebt,
      avaliableWithdraw,
    };
  };
}
