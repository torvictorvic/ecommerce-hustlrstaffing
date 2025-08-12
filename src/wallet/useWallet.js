import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Constants
const STATUS = Object.freeze({
  DISCONNECTED: "disconnected",
  CONNECTING: "connecting",
  CONNECTED: "connected",
});

const CHAINS = {
  "0x1":       { name: "Ethereum Mainnet" },
  "0xaa36a7":  { name: "Sepolia" },
  "0x89":      { name: "Polygon" },
  "0x13881":   { name: "Polygon Mumbai" },
};

const ADD_CHAIN_CONFIG = {
  "0x89": {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
  "0x13881": {
    chainId: "0x13881",
    chainName: "Polygon Mumbai",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
};

// Hook
export function useWalletCore() {
  // Capture provider once; do not put on state to avoid re-renders
  const ethereumRef = useRef(
    typeof window !== "undefined" ? window.ethereum ?? null : null
  );
  const ethereum = ethereumRef.current;

  // Reactive state
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [status, setStatus] = useState(STATUS.DISCONNECTED);

  // Derived
  const isInstalled = Boolean(ethereum && ethereum.isMetaMask);
  const isConnected = status === STATUS.CONNECTED && !!account;
  const network = useMemo(
    () => (chainId && CHAINS[chainId]?.name) || "Unknown",
    [chainId]
  );

  // Actions 
  const connect = useCallback(async () => {
    if (!isInstalled) throw new Error("MetaMask is not installed.");
    setStatus(STATUS.CONNECTING);
    try {
      const [accs, cid] = await Promise.all([
        ethereum.request({ method: "eth_requestAccounts" }),
        ethereum.request({ method: "eth_chainId" }),
      ]);
      const acc = accs?.[0] ?? null;
      setAccount(acc);
      setChainId(cid ?? null);
      setStatus(acc ? STATUS.CONNECTED : STATUS.DISCONNECTED);
      return acc;
    } catch (err) {
      setStatus(STATUS.DISCONNECTED);
      throw err;
    }
  }, [isInstalled, ethereum]);

  const disconnect = useCallback(async () => {
    try {
      await ethereum?.request?.({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }],
      }).catch(() => {});
    } finally {
      setAccount(null);
      setChainId(null);
      setStatus(STATUS.DISCONNECTED);
    }
  }, [ethereum]);

  const switchNetwork = useCallback(
    async (targetHex) => {
      if (!ethereum?.request) throw new Error("No provider");
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: targetHex }],
        });
      } catch (err) {
        if (err?.code === 4902 && ADD_CHAIN_CONFIG[targetHex]) {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [ADD_CHAIN_CONFIG[targetHex]],
          });
        } else {
          throw err;
        }
      }
    },
    [ethereum]
  );

  // Listeners , initial state sync
  useEffect(() => {
    if (!ethereum?.on) return;

    // Initial, silent sync (no permission popup)
    (async () => {
      try {
        const [accs, cid] = await Promise.all([
          ethereum.request({ method: "eth_accounts" }),
          ethereum.request({ method: "eth_chainId" }),
        ]);
        const acc = accs?.[0] ?? null;
        setAccount(acc);
        setChainId(cid ?? null);
        setStatus(acc ? STATUS.CONNECTED : STATUS.DISCONNECTED);
      } catch {
        console.log("Error...")
      }
    })();

    const onAccountsChanged = (accs) => {
      const acc = accs?.[0] ?? null;
      setAccount(acc);
      setStatus(acc ? STATUS.CONNECTED : STATUS.DISCONNECTED);
    };
    const onChainChanged = (cid) => setChainId(cid ?? null);
    const onDisconnect = () => {
      setAccount(null);
      setChainId(null);
      setStatus(STATUS.DISCONNECTED);
    };

    ethereum.on("accountsChanged", onAccountsChanged);
    ethereum.on("chainChanged", onChainChanged);
    ethereum.on("disconnect", onDisconnect);

    return () => {
      ethereum.removeListener?.("accountsChanged", onAccountsChanged);
      ethereum.removeListener?.("chainChanged", onChainChanged);
      ethereum.removeListener?.("disconnect", onDisconnect);
    };
  }, [ethereum]);

  // API
  return {
    // state
    isInstalled,
    isConnected,
    account,
    chainId,
    network,
    status,
    // actions
    connect,
    disconnect,
    switchNetwork,
  };
}
