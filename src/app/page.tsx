'use client';

import { WalletConnect } from '../components/walletConnect';
import { StakeForm } from '../components/stakeForm';
import { WithdrawForm } from '../components/withdrawnForm';
import { ClaimRewards } from '../components/claimRewards';
import { EmergencyWithdraw } from '../components/emergencyWithdraw';
import { UserStats } from '../components/userStats';
import { ProtocolStats } from '../components/protocolStats';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
            Staking Pool
          </h1>
          <p className="text-center text-gray-600">
            Stake your tokens and earn rewards on STK
          </p>
        </div>

        <WalletConnect />

        <div className="space-y-8">
          <ProtocolStats />
          <UserStats />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StakeForm />
            <WithdrawForm />
            <ClaimRewards />
          </div>
          
          <div className="max-w-md mx-auto">
            <EmergencyWithdraw />
          </div>
        </div>
      </div>
    </div>
  );
}