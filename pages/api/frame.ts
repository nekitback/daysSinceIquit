import { frames } from "frames.js/next";

export default frames(async () => ({
  image: (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#0A0A0A",
        color: "white",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        fontSize: 48,
      }}
    >
      <div>Days Since I Quit</div>
      <div style={{ fontSize: 26, marginTop: 20 }}>
        Onchain habit tracker on Base
      </div>
      <div style={{ fontSize: 20, marginTop: 12, opacity: 0.7 }}>
        Permanent streaks • Analytics • Ownership
      </div>
    </div>
  ),
  buttons: [
    {
      label: "Open Days Since I Quit",
      action: "link",
      target: "https://days-since-iquit.vercel.app",
    },
  ],
}));
