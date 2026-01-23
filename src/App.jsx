import React from "react";
import { useAccount } from "wagmi";
import ConnectScreen from "./screens/ConnectScreen";

export default function App() {
  const { isConnected } = useAccount();

  return <ConnectScreen isConnected={isConnected} />;
}
