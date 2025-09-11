"use client";

import { useAccount } from "wagmi";
import {
  useUserDetails,
  usePendingRewards,
  useTimeUntilUnlock,
} from "../hooks/useStaking";
import { formatEther } from "viem";

import { useUserHistory } from "../hooks/useUserHistory";
import { useStakingEvents } from "../hooks/useContractEvent";

export function UserStats() {
  const { address } = useAccount();
  const { data: userDetails } = useUserDetails(address);
  const { data: pendingRewards } = usePendingRewards(address);
  const { data: timeUntilUnlock } = useTimeUntilUnlock(address);
  const history = useUserHistory()
  
  useStakingEvents()
  

  const formatTime = (seconds: bigint) => {
    const total = Number(seconds);
    if (!Number.isFinite(total) || total <= 0) return "Unlocked";

    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = Math.floor(total % 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m ${secs}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    return `${minutes}m ${secs}s`;
  };

  if (!address) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Your Staking Position</h2>
          <p className="text-slate-600">View your staking details and transaction history</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-8 border border-slate-200">
          <p className="text-slate-500 text-center">
            Connect your wallet to view your staking position
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Your Staking Position</h2>
        <p className="text-slate-600">Overview of your staking details and performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="text-center space-y-2">
            <p className="text-blue-600 font-medium text-sm uppercase tracking-wide">Staked Amount</p>
            <p className="text-3xl font-bold text-blue-900">
              {userDetails ? formatEther(userDetails.stakedAmount) : "0.00"} STK
            </p>
            <p className="text-xs text-blue-600">Currently staked tokens</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
          <div className="text-center space-y-2">
            <p className="text-emerald-600 font-medium text-sm uppercase tracking-wide">Pending Rewards</p>
            <p className="text-3xl font-bold text-emerald-900">
              {pendingRewards ? Number(formatEther(pendingRewards)).toFixed(6) : "0.00"} STK
            </p>
            <p className="text-xs text-emerald-600">Available to claim</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
          <div className="text-center space-y-2">
            <p className="text-amber-600 font-medium text-sm uppercase tracking-wide">Time Until Unlock</p>
            <p className="text-2xl font-bold text-amber-900">
              {timeUntilUnlock ? formatTime(timeUntilUnlock) : "N/A"}
            </p>
            <p className="text-xs text-amber-600">Remaining lock period</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-slate-900">Transaction History</h3>
          <p className="text-slate-600">Your staking activity and rewards</p>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Transaction</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {history.length > 0 ? (
                  history.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.type === 'stake' ? 'bg-blue-100 text-blue-800' :
                          item.type === 'withdraw' ? 'bg-emerald-100 text-emerald-800' :
                          item.type === 'rewards' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {item.amount} STK
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(item.timestamp * 1000).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a
                          href={`https://sepolia.etherscan.io/tx/${item.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline transition-colors"
                        >
                          View on Etherscan
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      <div className="space-y-2">
                        <p className="text-sm">No transaction history yet</p>
                        <p className="text-xs">Start staking to see your activity here</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

