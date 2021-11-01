import { RISK } from "@/enums";
import { getNextPairPrice } from "./oracle";

const RiskLevelMeta = {
  [RISK.NA]: {
    color: "",
    bg_color: "greyscale_6",
    value: RISK.NA,
  },
  [RISK.HIGH]: {
    color: "risk_high",
    bg_color: "risk_high_bg",
    value: RISK.HIGH,
  },
  [RISK.MEDIUM]: {
    color: "risk_mid",
    bg_color: "risk_mid_bg",
    value: RISK.MEDIUM,
  },
  [RISK.LOW]: {
    color: "risk_low",
    bg_color: "risk_low_bg",
    value: RISK.LOW,
  },
};

export function getRiskLevelMeta(current: number, min: number) {
  if (min <= 0 || current <= 0) return RiskLevelMeta[RISK.NA];

  const risk = current / min;

  return getRiskLevelMetaByPercent(risk);
}

// 根据抵押率计算风险
export function getRiskLevelMetaByPercent(collateralRatio: number) {
  if (collateralRatio < 0) {
    return RiskLevelMeta[RISK.NA];
  } else if (collateralRatio <= 1.25) {
    return RiskLevelMeta[RISK.HIGH];
  } else if (collateralRatio <= 5 / 3) {
    return RiskLevelMeta[RISK.MEDIUM];
  } else {
    return RiskLevelMeta[RISK.LOW];
  }
}

export function maxAvailable(cat: API.Collateral) {
  return Math.max(Number(cat.line) - Number(cat.art) * Number(cat.rate), 0);
}

export function getVaultRisk(vm: Vue, vault: API.Vault) {
  const getCollateralById: State.GetCollateralById =
    vm.$store.getters["collateral/getCollateralById"];

  const collateral = getCollateralById(vault.collateral_id);
  const debtAmount = Number(vault.art || "0") * Number(collateral?.rate || "1");
  const collateralAmount = Number(vault.ink);
  const ratio =
    (collateralAmount * Number(collateral?.price ?? 0)) / debtAmount;

  return ratio / Number(collateral?.rate ?? "1");
}

export function getVaultFields(vm: Vue, id: string) {
  const getters = vm.$store.getters;
  const getVaultById: State.GetVaultById = getters["vault/getVaultById"];
  const getCollateralById: State.GetCollateralById =
    getters["collateral/getCollateralById"];
  const getAssetById: State.GetAssetById = getters["asset/getAssetById"];

  const vault = getVaultById(id);
  const collateral = getCollateralById(vault?.collateral_id ?? "");
  const art = Number(vault?.art ?? "0");
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
  const collateralAmount = Number(vault?.ink ?? "0");
  const debtAmount = art * rate;
  const collateralAmountUSD = collateralAmount * collateralAssetPrice;
  const debtAmountUSD = debtAmount * debtAssetPrice;

  // 稳定费率
  const stabilityFee = duty - 1;

  // 抵押率
  const ratio = debtAmount && (collateralAmount * price) / debtAmount;

  // 风险等级
  const riskLevelMeta = getRiskLevelMeta(ratio, mat);

  // 清算价格
  const liquidationPrice = (debtAmount * mat) / collateralAmount;

  //清算罚金费率
  const liquidationPenalty = chop;

  // 交易对下个价格
  const nextPrice = getNextPairPrice(vm.$store.getters, {
    base: collateral?.gem ?? "",
    quote: collateral?.dai ?? "",
  });

  // 可借数量
  const avaliableDebt = (collateralAmount * price) / mat - debtAmount;

  // 可提现数量
  const avaliableWithdraw = collateralAmount - (mat * debtAmount) / price;

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
    ratio,
    riskLevelMeta,
    liquidationPrice,
    liquidationPenalty,
    price,
    nextPrice,
    avaliableDebt,
    avaliableWithdraw,
  };
}
