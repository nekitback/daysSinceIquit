import { useConnect } from "wagmi";

export default function ConnectButton() {
  const { connect, connectors, isPending } = useConnect();

  return (
    <button
      disabled={isPending}
      onClick={() => connect({ connector: connectors[0] })}
    >
      {isPending ? "Connecting..." : "Connect wallet"}
    </button>
  );
}
