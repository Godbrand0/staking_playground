"use client";

import { useState } from "react";
import { useStakingContract } from "../hooks/useStaking";

export function EmergencyWithdraw() {
  const [showConfirm, setShowConfirm] = useState(false);
  const { emergencyWithdraw, isPending } = useStakingContract();

  const handleEmergencyWithdraw = () => {
    emergencyWithdraw();
    setShowConfirm(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Emergency Withdraw</h2>
        <p className="text-slate-600">Emergency withdrawal with penalties</p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
            </div>
            <div>
              <h3 className="text-red-800 font-semibold mb-2">Warning</h3>
              <p className="text-red-700 text-sm leading-relaxed">
                Emergency withdraw will forfeit all pending rewards and may incur penalties. 
                This action cannot be undone. Only use this in emergency situations.
              </p>
            </div>
          </div>
        </div>
        
        {!showConfirm ? (
          <div className="space-y-2">
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors font-medium"
            >
              Emergency Withdraw
            </button>
            <p className="text-xs text-slate-500 text-center">
              Click to confirm emergency withdrawal (forfeits all rewards)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-red-600 font-medium text-lg mb-2">
                Are you absolutely sure?
              </p>
              <p className="text-sm text-slate-600">
                This will withdraw all your tokens but forfeit all pending rewards
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <button
                  onClick={handleEmergencyWithdraw}
                  disabled={isPending}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-colors font-medium"
                >
                  {isPending ? "Processing..." : "Confirm Withdraw"}
                </button>
                <p className="text-xs text-slate-500 text-center">
                  Proceed with emergency withdrawal
                </p>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isPending}
                  className="w-full bg-slate-300 text-slate-700 py-3 px-4 rounded-lg hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <p className="text-xs text-slate-500 text-center">
                  Go back and keep your rewards
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
