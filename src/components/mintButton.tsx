"use client";

import React from "react";
import { useMint } from "../hooks/useMint";

// If you have a shadcn/ui Button, update the import below accordingly.
// For now, use a simple button element with Tailwind classes.

export default function MintButton() {
  const { claimFaucet, isPending, isConfirming, isConfirmed } = useMint();

  const handleMint = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      claimFaucet();
      console.log("Mint transaction sent");
    } catch (error) {
      console.error("Mint failed", error);
    }
  };

  return (
    <div className="">
      <button
        onClick={handleMint}
        disabled={isPending || isConfirming}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer shadow-lg px-4 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending
          ? "Sending Mint..."
          : isConfirming
          ? "Confirming..."
          : isConfirmed
          ? "Minted"
          : "Mint Tokens"}
      </button>
    </div>
  );
}
