import React, { createContext, useContext } from "react";
import { useWalletCore } from "./useWallet";

const WalletCtx = createContext(null);
export const useWallet = () => useContext(WalletCtx);

export default function Wprovider({ children }) {
  const value = useWalletCore();
  return <WalletCtx.Provider value={value}>{children}</WalletCtx.Provider>;
}
