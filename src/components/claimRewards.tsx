'use client';

import { useStakingContract, usePendingRewards } from '../hooks/useStaking';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { useStakingEvents } from '@/hooks/useContractEvent';

export function ClaimRewards() {
  const { address } = useAccount();
  const { claimRewards, isPending } = useStakingContract();
  const { data: pendingRewards } = usePendingRewards(address);
  useStakingEvents();

  const handleClaim = () => {
    claimRewards();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Claim Rewards</h2>
        <p className="text-slate-600">Claim your earned staking rewards</p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-8 border border-amber-200">
          <div className="text-center space-y-2">
            <p className="text-amber-600 font-medium text-sm uppercase tracking-wide">Pending Rewards</p>
            <p className="text-4xl font-bold text-amber-900">
              {pendingRewards ? formatEther(pendingRewards) : '0.00'} STK
            </p>
            <p className="text-xs text-amber-600">Available rewards ready to claim</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={handleClaim}
            disabled={isPending || !pendingRewards || pendingRewards === 0n}
            className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isPending ? 'Claiming...' : 'Claim Rewards'}
          </button>
          <p className="text-xs text-slate-500 text-center">
            Claim your earned rewards without withdrawing your staked tokens
          </p>
        </div>
      </div>
    </div>
  );
}