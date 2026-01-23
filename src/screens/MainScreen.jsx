import React, { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import BurgerMenu from "../components/BurgerMenu";

export default function MainScreen() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="main-screen">
      {/* BURGER */}
      <button
        className="burger"
        onClick={() => setMenuOpen(true)}
      >
        ☰
      </button>

      {/* SIDE MENU */}
      <BurgerMenu
  open={menuOpen}
  onClose={() => setMenuOpen(false)}
  address={address}
  onAbout={() => {
    alert("About");
    setMenuOpen(false);
  }}
  onDisconnect={() => {
    disconnect();
    setMenuOpen(false);
  }}
/>


      {/* MAIN CONTENT */}
      <div className="content">
        {/* твой основной UI */}
      </div>
    </div>
  );
}



