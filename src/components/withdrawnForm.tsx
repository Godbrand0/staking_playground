"use client";

import { useState } from "react";
import { useStakingContract } from "../hooks/useStaking";

export function WithdrawForm() {
  const [amount, setAmount] = useState("");
  const { withdraw, isPending } = useStakingContract();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount) {
      withdraw(amount);
      setAmount("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Withdraw Tokens</h2>
        <p className="text-slate-600">Unlock your staked tokens and any pending rewards</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="withdraw-amount"
            className="block text-sm font-medium text-slate-700"
          >
            Amount to Withdraw (STK)
          </label>
          <input
            id="withdraw-amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="0.0"
            disabled={isPending}
          />
          <p className="text-xs text-slate-500">
            Enter the amount of staked tokens you want to withdraw. You will receive both the principal and any pending rewards.
          </p>
        </div>
        
        <div className="space-y-2">
          <button
            type="submit"
            disabled={isPending || !amount}
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isPending ? "Withdrawing..." : "Withdraw Tokens"}
          </button>
          <p className="text-xs text-slate-500 text-center">
            Withdraw your staked tokens and claim all pending rewards
          </p>
        </div>
      </form>
    </div>
  );
}
