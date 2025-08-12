import React from "react";
import { useWallet } from "../wallet/wprovider";

const short = (a) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : "";

export default function WButton() {
  const { isInstalled, account, network, status, connect, disconnect, switchNetwork } = useWallet();

  if (!isInstalled) {
    return (
      <a className="btn btn-outline-dark m-2" href="https://metamask.io/download/" target="_blank" rel="noreferrer">
        Install MetaMask
      </a>
    );
  }

  if (!account) {
    return (
      <button className="btn btn-outline-dark m-2" onClick={connect} disabled={status === "connecting"}>
        {status === "connecting" ? "Connecting..." : "Connect Wallet"}
      </button>
    );
  }

  return (
    <div className="btn-group m-2">
      <button className="btn btn-dark">{short(account)}</button>
      <button type="button" className="btn btn-dark dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
        <span className="visually-hidden">Toggle</span>
      </button>
      <ul className="dropdown-menu dropdown-menu-end">
        <li className="dropdown-item-text"><strong>Network:</strong> {network}</li>
        <li><hr className="dropdown-divider" /></li>
        <li><button className="dropdown-item" onClick={() => switchNetwork("0x1")}>Switch Ethereum</button></li>
        <li><button className="dropdown-item" onClick={() => switchNetwork("0x89")}>Switch Polygon</button></li>
        <li><hr className="dropdown-divider" /></li>
        <li><button className="dropdown-item text-danger" onClick={disconnect}>Disconnect</button></li>
      </ul>
    </div>
  );
}
