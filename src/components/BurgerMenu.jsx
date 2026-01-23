import React from "react";
import "../styles/menu.css";
import { formatAddress } from "../utils/formatAddress";

export default function BurgerMenu({ open,
  onClose,
  address,
  onAbout,
  onDisconnect }) {
  if (!open) return null;

  function shortAddress(address) {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  return (
    <>
     <div className="side-menu">
     onClick={(e) => e.stopPropagation()}
  {/* TOP */}
  <div className="menu-header">
    <span className="wallet-address">
    {formatAddress(address)}
    </span>
  </div>

  {/* MIDDLE */}
  <div className="menu-content">
    <button className="menu-item" onClick={onAbout}>
      About
    </button>
  </div>

  {/* BOTTOM */}
  <div className="menu-footer">
    <button className="menu-item danger" onClick={onDisconnect}>
      Disconnect
    </button>
  </div>
</div>

    </>
  );
}



  