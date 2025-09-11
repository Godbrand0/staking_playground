"use client";

import { useState } from "react";
import { useStakingContract } from "../hooks/useStaking";
import { useTokenApproval } from "../hooks/useApproval";
import { STAKING_CONTRACT_ADDRESS } from "../config/contract";

export function StakeForm() {
  const [amount, setAmount] = useState("");

  const {
    stake,
    isPending: isStaking,
    isConfirming: isStakingConfirming,
  } = useStakingContract();

  const {
    approve,
    isPending: isApproving,
    isConfirming: isApprovalConfirming,
    isConfirmed: isApprovalConfirmed,
  } = useTokenApproval();


  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    approve(STAKING_CONTRACT_ADDRESS, amount);
  };
   const handleStake = (e: React.FormEvent) => {
    e.preventDefault();
   if (isApprovalConfirmed && amount) {
      stake(amount);
      setAmount(""); // reset after staking
    }
  };

  const isBusy =
    isApproving || isApprovalConfirming || isStaking || isStakingConfirming;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Stake Tokens</h2>
        <p className="text-slate-600">Lock your tokens to start earning rewards</p>
      </div>
      
      <form onSubmit={handleStake} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="stake-amount"
            className="block text-sm font-medium text-slate-700"
          >
            Amount to Stake (STK)
          </label>
          <input
            id="stake-amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="0.0"
            disabled={isBusy}
          />
          <p className="text-xs text-slate-500">
            Enter the amount of tokens you want to stake. You will need to approve first, then stake.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleApprove}
              disabled={isBusy || !amount || isApprovalConfirmed}
              className="w-full bg-slate-600 text-white py-3 px-4 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isApproving
                ? "Approving..."
                : isApprovalConfirming
                ? "Waiting for Approval..."
                : "Approve Tokens"}
            </button>
            <p className="text-xs text-slate-500 text-center">
              Step 1: Allow the contract to spend your tokens
            </p>
          </div>
          
          <div className="space-y-2">
            <button
              type="submit"
              disabled={isBusy || !isApprovalConfirmed || isStakingConfirming}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isStaking
                ? "Staking..."
                : isStakingConfirming
                ? "Confirm Staking..."
                : "Stake Tokens"}
            </button>
            <p className="text-xs text-slate-500 text-center">
              Step 2: Lock your tokens to start earning rewards
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
