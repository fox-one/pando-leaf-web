export const ERROR_CODE = {
  /**
   *  未知错误
   */
  ErrUnknown: 100000,
  /**
   *  操作禁止
   */
  ErrOperationForbidden: 100001,
  /**
   *  参数有误
   */
  ErrInvalidArgument: 100002,
  /**
   *  未找到该资产所在的市场
   */
  ErrMarketNotFound: 100100,
  /**
   * 无效的金额
   */
  ErrInvalidAmount: 100101,
  /**
   * 未找到该存入
   */
  ErrSupplyNotFound: 100102,
  /**
   * 未找到该借款
   */
  ErrBorrowNotFound: 100103,
  /**
   * 担保资产不足
   */
  ErrInsufficientCollaterals: 100104,
  /**
   * 市场流动性不足
   */
  ErrInsufficientLiquidity: 100105,
  /**
   * 无法取出资产
   */
  ErrRedeemNotAllowed: 100106,
  /**
   * 无法进行清算
   */
  ErrSeizeNotAllowed: 100107,
  /**
   * 无效的价格
   */
  ErrInvalidPrice: 100108,
  /**
   * 无法借款
   */
  ErrBorrowNotAllowed: 100109,
  /**
   * 未能抵押资产
   */
  ErrPledgeNotAllowed: 100110,
  /**
   * 市场临时关闭
   */
  ErrMarketClosed: 100111,
};
