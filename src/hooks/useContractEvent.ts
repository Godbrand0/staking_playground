// hooks/useStakingEvents.ts
import { useEffect } from "react";
import { usePublicClient } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { STAKING_CONTRACT_ADDRESS } from "../config/contract";
import { parseAbiItem } from "viem";

export function useStakingEvents() {
  const publicClient = usePublicClient();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!publicClient) return;

    const unwatchers: Array<() => void> = [];

    try {
      // Staked
      unwatchers.push(
        publicClient.watchEvent({
          address: STAKING_CONTRACT_ADDRESS,
          event: parseAbiItem(
            "event Staked(address indexed user,uint256 amount,uint256 timestamp,uint256 newTotalStaked,uint256 currentRewardRate)"),
          onLogs: (logs) => {
            console.log("Staked event:", logs);
            queryClient.invalidateQueries();
          },
          onError: (err) => console.error("watchEvent Staked error:", err),
        })
      );

      // Withdrawn
      unwatchers.push(
        publicClient.watchEvent({
          address: STAKING_CONTRACT_ADDRESS,
          event: parseAbiItem(
            "event Withdrawn(address indexed user,uint256 amount,uint256 timestamp,uint256 newTotalStaked,uint256 currentRewardRate,uint256 rewardsAccrued)"),
          onLogs: (logs) => {
            console.log("Withdrawn event:", logs);
            queryClient.invalidateQueries();
          },
          onError: (err) => console.error("watchEvent Withdrawn error:", err),
        })
      );

      // RewardsClaimed
      unwatchers.push(
        publicClient.watchEvent({
          address: STAKING_CONTRACT_ADDRESS,
          event: parseAbiItem(
            "event RewardsClaimed(address indexed user,uint256 amount,uint256 timestamp,uint256 newPendingRewards,uint256 totalStaked)"),
          onLogs: (logs) => {
            console.log("RewardsClaimed event:", logs);
            queryClient.invalidateQueries();
          },
          onError: (err) =>
            console.error("watchEvent RewardsClaimed error:", err),
        })
      );

      // EmergencyWithdrawn
      unwatchers.push(
        publicClient.watchEvent({
          address: STAKING_CONTRACT_ADDRESS,
          event: parseAbiItem(
            "event EmergencyWithdrawn(address indexed user,uint256 amount,uint256 penalty,uint256 timestamp,uint256 newTotalStaked)"),
          onLogs: (logs) => {
            console.log("EmergencyWithdrawn event:", logs);
            queryClient.invalidateQueries();
          },
          onError: (err) =>
            console.error("watchEvent EmergencyWithdrawn error:", err),
        })
      );

      // RewardRateUpdated
      unwatchers.push(
        publicClient.watchEvent({
          address: STAKING_CONTRACT_ADDRESS,
          event: parseAbiItem(
            "event RewardRateUpdated(uint256 oldRate, uint256 newRate)"
          ),
          onLogs: (logs) => {
            console.log("RewardRateUpdated event:", logs);
            queryClient.invalidateQueries();
          },
          onError: (err) =>
            console.error("watchEvent RewardRateUpdated error:", err),
        })
      );
    } catch (error) {
      console.error("useStakingEvents watchEvent setup error:", error);
    }

    // cleanup watchers
    return () => {
      for (const unwatch of unwatchers) {
        try {
          unwatch?.();
        } catch (err) {
          console.error("watchEvent cleanup error:", err);
        }
      }
    };
  }, [publicClient, queryClient]);
}
