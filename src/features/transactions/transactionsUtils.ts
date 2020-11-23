import { GatewaySession } from "@renproject/ren-tx";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import {
  BridgeChain,
  BridgeCurrency,
  BridgeNetwork,
  getCurrencyConfigByRentxName,
} from "../../utils/assetConfigs";
import { toPercent } from "../../utils/converters";

export enum TxType {
  MINT = "mint",
  BURN = "burn",
}

export enum TxConfigurationStep {
  INITIAL = "initial",
  FEES = "fees",
}
export type TxConfigurationStepProps = {
  onPrev?: () => void;
  onNext?: () => void;
};

export type LocationTxState = {
  txState?: {
    newTx?: boolean;
  };
};

export const useTxParam = () => {
  const location = useLocation();
  const tx = parseTxQueryString(location.search);
  const locationState = location.state as LocationTxState;

  return { tx, txState: locationState?.txState };
};

export const createTxQueryString = (tx: GatewaySession) => {
  const { customParams, transactions, ...sanitized } = tx;

  return queryString.stringify({
    ...sanitized,
    customParams: JSON.stringify(customParams),
    transactions: JSON.stringify(transactions),
  } as any);
};

const parseNumber = (value: any) => {
  if (typeof value === "undefined") {
    return undefined;
  }
  return Number(value);
};

export const parseTxQueryString: (
  query: string
) => Partial<GatewaySession> | null = (query: string) => {
  const parsed = queryString.parse(query);
  if (!parsed) {
    return null;
  }
  const {
    expiryTime,
    suggestedAmount,
    targetAmount,
    transactions,
    customParams,
    ...rest
  } = parsed;

  return {
    ...rest,
    transactions: JSON.parse((transactions as string) || "{}"),
    customParams: JSON.parse((customParams as string) || "{}"),
    expiryTime: parseNumber(expiryTime),
    suggestedAmount: parseNumber(suggestedAmount),
    targetAmount: parseNumber(targetAmount),
  };
};

const sochainTestnet = "https://sochain.com/tx/";
const sochain = "https://sochain.com/tx/";
const etherscanTestnet = "https://kovan.etherscan.io/tx/";
const etherscan = "https://etherscan.io/tx/";
const binanceTestnet = "https://testnet.bscscan.com/";
const binance = "https://bscscan.com/";

export const getChainExplorerLink = (
  chain: BridgeChain,
  network: BridgeNetwork,
  txId: string
) => {
  if (network === BridgeNetwork.TESTNET) {
    switch (chain) {
      case BridgeChain.ETHC:
        return etherscanTestnet + txId;
      case BridgeChain.BSCC:
        return binanceTestnet + txId;
      case BridgeChain.BTCC:
        return sochainTestnet + "BTCTEST/" + txId;
      case BridgeChain.ZECC:
        return sochainTestnet + "ZECTEST/" + txId;
    }
  } else if (network === BridgeNetwork.MAINNET) {
    switch (chain) {
      case BridgeChain.ETHC:
        return etherscan + txId;
      case BridgeChain.BSCC:
        return binance + txId;
      case BridgeChain.BTCC:
        return sochain + "BTC/" + txId;
      case BridgeChain.ZECC:
        return sochain + "ZEC/" + txId;
    }
  }
};

type GetFeeToltipsArgs = {
  mintFee: number;
  releaseFee: number;
  sourceCurrency?: BridgeCurrency;
  destinationCurrency?: BridgeCurrency;
  type: TxType;
};

export const getFeeTooltips = ({
  mintFee,
  releaseFee,
  sourceCurrency,
  destinationCurrency,
  type,
}: GetFeeToltipsArgs) => {
  return {
    renVmFee: `RenVM takes a ${toPercent(
      mintFee
    )}% fee per mint transaction and ${toPercent(
      releaseFee
    )}% per burn transaction. This is shared evenly between all active nodes in the decentralized network.`,
    bitcoinMinerFee:
      "The fee required by BTC miners, to move BTC. This does not go RenVM or the Ren team.",
    estimatedEthFee:
      "The estimated cost to perform a transaction on the Ethereum network. This fee goes to Ethereum miners and is paid in ETH.",
    // estimatedReleasingChainFee:
    //   "The fee required by BTC miners, to move BTC. This does not go RenVM or the Ren team.",
    // estimatedMintingChainFee:
    //   "The estimated cost to perform a transaction on the Ethereum network. This fee goes to Ethereum miners and is paid in ETH.",
  };
};

export const getTxPageTitle = (tx: GatewaySession) => {
  const amount = tx.targetAmount;
  const asset = getCurrencyConfigByRentxName(tx.sourceAsset).short;
  const type = tx.type === TxType.MINT ? "Mint" : "Release";
  const date = new Date(tx.expiryTime - 24 * 3600 * 1000).toISOString();

  return `${type} - ${amount} ${asset} - ${date}`;
};