import React from "react";

export default function Header({ address, onBurger }) {
  return (
    <div className="header">
      <button className="burger-btn" onClick={onBurger}>
        ☰
      </button>
    </div>
  );
}
