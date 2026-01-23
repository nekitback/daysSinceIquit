import React from "react";
import { useAccount, useConnect } from "wagmi";

export default function ConnectScreen() {
  const { isConnected, address } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();

  if (isConnected) {
    return (
      <div className="screen center">
        <h2>Connected</h2>
        <p>{address}</p>
      </div>
    );
  }

  return (
    <div className="screen center">
      <h1>Days since I quit</h1>

      <button
        onClick={() => connect({ connector: connectors[0] })}
        disabled={isPending}
      >
        {isPending ? "Connecting..." : "Connect Wallet"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 12 }}>
          {error.message}
        </p>
      )}
    </div>
  );
}
