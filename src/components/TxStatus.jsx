import React from "react";

export default function TxStatus({ stage, message }) {
  if (stage === "idle") return null;
  const isLoading = stage === "prompt" || stage === "pending";
  return (
    <div className="alert text-center" role="alert" style={{ position: "fixed", bottom: 16, right: 16, zIndex: 1050 }}>
      {isLoading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
      <strong>{message}</strong>
    </div>
  );
}
