import BigNumber from "bignumber.js";

export const feesDecimalImpact = (
  value: string | number,
  decimalImpact = 2
) => {
  const num = value.toString();
  const decimalPosition = num.indexOf(".");
  if (decimalPosition > -1) {
    //number has decimals, like 2.002
    const decimalDigits = num.length - decimalPosition;
    return decimalDigits + decimalImpact;
  }
  return decimalImpact;
};

export const amountWithDecimals = (
  amount: string | number | null,
  decimals: string | number | null
) => {
  return amount !== null && decimals !== null
    ? new BigNumber(amount).shiftedBy(-decimals).toString()
    : null;
};
