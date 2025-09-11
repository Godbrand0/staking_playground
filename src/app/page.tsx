"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { WalletConnect } from "../components/walletConnect";
import { StakeForm } from "../components/stakeForm";
import { WithdrawForm } from "../components/withdrawnForm";
import { ClaimRewards } from "../components/claimRewards";
import { EmergencyWithdraw } from "../components/emergencyWithdraw";
import { UserStats } from "../components/userStats";
import { ProtocolStats } from "../components/protocolStats";
import { Menu, X } from "lucide-react"; // icons
import { useStakingEvents } from "../hooks/useContractEvent";

export default function Home() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("protocol");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useStakingEvents();

  const menuItems = [
    { key: "protocol", label: "Protocol Stats", component: <ProtocolStats /> },
    { key: "user", label: "User Stats", component: <UserStats /> },
    { key: "stake", label: "Stake Tokens", component: <StakeForm /> },
    { key: "withdraw", label: "Withdraw", component: <WithdrawForm /> },
    { key: "claim", label: "Claim Rewards", component: <ClaimRewards /> },
    {
      key: "emergency",
      label: "Emergency Withdraw",
      component: <EmergencyWithdraw />,
    },
  ];

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-slate-900">
              Welcome to Staking Pool
            </h1>
            <p className="text-lg text-slate-600">
              Stake your tokens and earn rewards on{" "}
              <span className="font-semibold text-blue-600">STK</span>
            </p>
            <p className="text-sm text-slate-500">
              Connect your wallet to start staking and earning rewards
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <ProtocolStats/>
          </div>
          
          <div className="flex justify-center">
            <WalletConnect />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 transform ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out bg-white shadow-xl w-72 z-40 border border-slate-200 h-screen lg:translate-x-0 lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] lg:flex-shrink-0 lg:rounded-xl overflow-y-auto`}
          >
            <div className="p-6 border-b border-slate-200">
              <h1 className="text-2xl font-bold text-slate-900">Staking Pool</h1>
              <p className="text-sm text-slate-500 mt-1">Manage your staking position</p>
            </div>
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key);
                    setSidebarOpen(false); // close on mobile
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    activeTab === item.key
                      ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 space-y-6">
            {/* Top bar for mobile */}
            <div className="flex items-center justify-between p-4 bg-white shadow-lg rounded-xl border border-slate-200 lg:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <WalletConnect />
            </div>

            {/* Desktop wallet connect */}
            <div className="hidden lg:flex justify-end">
              <WalletConnect />
            </div>

            {/* Content area */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
              {menuItems.find((item) => item.key === activeTab)?.component}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
