import React from "react";
import { useConnect } from "wagmi";
import "../styles/connect.css";

export default function ConnectScreen() {
  const { connect, connectors, error, isPending } = useConnect();

  return (
    <div className="connect-screen">
      <div className="connect-title">Days Since I Quit</div>

      <button
        className="connect-button"
        onClick={() => connect({ connector: connectors[0] })}
        disabled={isPending}
      >
        Connect Wallet
      </button>

      {error && <div className="connect-error">{error.message}</div>}
    </div>
  );
}

