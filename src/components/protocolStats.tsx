"use client";

import { useStakingEvents } from "@/hooks/useContractEvent";
import {
  useTotalStaked,
  useCurrentRewardRate,
  useInitialApr,
} from "../hooks/useStaking";
import { formatEther } from "viem";

export function ProtocolStats() {
  const { data: totalStaked } = useTotalStaked();
  const { data: currentRewardRate } = useCurrentRewardRate();
  const { data: initialApr } = useInitialApr();
  useStakingEvents();
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Protocol Statistics</h2>
        <p className="text-slate-600">Current staking pool metrics and performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="text-center space-y-2">
            <p className="text-blue-600 font-medium text-sm uppercase tracking-wide">Total Staked</p>
            <p className="text-3xl font-bold text-blue-900">
              {totalStaked ? formatEther(totalStaked) : "0.00"} STK
            </p>
            <p className="text-xs text-blue-600">Total value locked in the protocol</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
          <div className="text-center space-y-2">
            <p className="text-emerald-600 font-medium text-sm uppercase tracking-wide">Current APR</p>
            <p className="text-3xl font-bold text-emerald-900">
              {initialApr ? `${Number(initialApr) / 100}%` : "0%"}
            </p>
            <p className="text-xs text-emerald-600">Annual percentage rate for stakers</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
          <div className="text-center space-y-2">
            <p className="text-amber-600 font-medium text-sm uppercase tracking-wide">Reward Rate</p>
            <p className="text-3xl font-bold text-amber-900">
              {currentRewardRate ? formatEther(currentRewardRate) : "0.00"} STK
            </p>
            <p className="text-xs text-amber-600">Rewards distributed per block</p>
          </div>
        </div>
      </div>
    </div>
  );
}
