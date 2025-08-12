# Blockchain Developer Test

## Overview
This project implements wallet connection, network detection, and UI state synchronization based on blockchain interactions for an existing React E-commerce application.

### Features Implemented
1. **Wallet Connection / Disconnection**
   - MetaMask connection and disconnection using 'eth_requestAccounts' and 'wallet_revokePermissions'.
   - Navbar button dynamically changes between **"Connect Wallet"** and short wallet address.
   - Uses React Context ('Wprovider') and custom hook ('useWalletCore') for global wallet state.

2. **Network Change Detection**
   - Listens to 'chainChanged' from MetaMask.
   - Automatically updates UI with current network name (Ethereum, Polygon, Sepolia, Mumbai).
   - Provides quick network switch buttons in Navbar dropdown.

3. **Transaction Lifecycle Feedback**
   - Checkout page integrates 'useTx' hook to handle blockchain transaction/signature flow.
   - Displays:
     - Loader with "Confirm in wallet..." when MetaMask prompt is open.
     - Success message "Signature captured." after confirmation.
     - Error message if user rejects or fails.

---

## How to Run Locally

**Requirements:**
- Node.js v20+
- npm v10+
- MetaMask installed in browser

**Steps:**
'''bash
npm install --legacy-peer-deps
npm run dev
'''

**Testing Flow:**
1. **Wallet Connection**
   - Click **Connect Wallet** in Navbar  ->  approve connection in MetaMask.
   - To disconnect: open wallet dropdown  ->  click **Disconnect**.

2. **Network Change Detection**
   - Switch network in MetaMask or use dropdown buttons (**Switch Ethereum**, **Switch Polygon**).
   - Confirm UI updates **Network:** label immediately.

3. **Transaction Lifecycle**
   - Add items to cart  ->  go to **Checkout**.
   - Click **Confirm in Wallet**  ->  MetaMask opens signature request.
   - Approve or reject and observe loader, success, or error message.

---

## File Changes
- 'src/wallet/useWallet.js': Core wallet hook with connection, disconnection, network switching, and event listeners.
- 'src/wallet/wprovider.jsx': Context provider for wallet state.
- 'src/components/button.jsx': Navbar wallet button with connection, disconnection, and network switching.
- 'src/wallet/useTx.js': Hook handling transaction/signature flow with UI state updates.
- 'src/components/TxStatus.jsx': Component showing loader/success/error messages.

---

## Screenshots Proof
Include these in 'hustlr-test-screenshots' folder:
1. Wallet disconnected ('Connect Wallet' visible).
2. Wallet connected (short address visible).
3. Network Ethereum Mainnet.
4. Network Polygon.
5. MetaMask signature prompt on Checkout.
6. Loader: "Confirm in wallet...".
7. Success message: "Signature captured.".

---

## Notes
- Network detection supports Ethereum Mainnet, Polygon, Sepolia, and Mumbai testnet.
- UI updates are instant thanks to MetaMask event listeners ('accountsChanged', 'chainChanged', 'disconnect').
- Code is modular for easy integration with other dApps.


---

## **Author**
Victor Manuel Suarez Torres - victormst@gmail.com.