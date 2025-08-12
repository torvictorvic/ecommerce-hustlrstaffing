import { useState } from "react";
import { useWallet } from "./wprovider";

export function useTx() {
const { account } = useWallet();
  const ethereum = typeof window !== "undefined" ? window.ethereum : undefined;

  // Types: idle | prompt | pending | success | error
  const [stage, setStage] = useState("idle"); 
  const [message, setMessage] = useState("");

  const signMessage = async (text) => {
    if (!ethereum || !account) throw new Error("First: Connect your wallet!");
    try {
      setStage("prompt"); setMessage("Confirm in wallet =>");
      const sig = await ethereum.request({
        method: "personal_sign",
        params: [text, account]
      });
      setStage("success"); setMessage("Signature captured.");
      return sig;
    } catch (e) {
      setStage("error"); setMessage(e?.message || "User rejected.");
      throw e;
    }
  };

  return { stage, message, signMessage, reset: () => { setStage("idle"); setMessage(""); } };
}
