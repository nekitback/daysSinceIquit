import React from "react";
import { useAccount } from "wagmi";
import ConnectScreen from "../screens/ConnectScreen";
import MainScreen from "../screens/MainScreen";

export default function App() {
  const { isConnected } = useAccount();
  return isConnected ? <MainScreen /> : <ConnectScreen />;
}

