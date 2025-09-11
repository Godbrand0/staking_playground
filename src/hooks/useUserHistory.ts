import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useBlockNumber } from "wagmi";
import { parseAbiItem, formatEther, type AbiEvent } from "viem";
import { STAKING_CONTRACT_ADDRESS } from "../config/contract";

type HistoryItem = {
  type: "stake" | "withdraw" | "rewards" | "emergency";
  amount: string;
  txHash: string;
  timestamp: number;
};

// Pre-parse ABI strings and assert as AbiEvent so TS narrows correctly for getLogs/watchEvent.
const STAKED_EVENT = parseAbiItem(
  "event Staked(address indexed user,uint256 amount,uint256 timestamp,uint256 newTotalStaked,uint256 currentRewardRate)"
) as AbiEvent;

const WITHDRAWN_EVENT = parseAbiItem(
  "event Withdrawn(address indexed user,uint256 amount,uint256 timestamp,uint256 newTotalStaked,uint256 currentRewardRate,uint256 rewardsAccrued)"
) as AbiEvent;

const REWARDS_EVENT = parseAbiItem(
  "event RewardsClaimed(address indexed user,uint256 amount,uint256 timestamp,uint256 newPendingRewards,uint256 totalStaked)"
) as AbiEvent;

const EMERGENCY_EVENT = parseAbiItem(
  "event EmergencyWithdrawn(address indexed user,uint256 amount,uint256 penalty,uint256 timestamp,uint256 newTotalStaked)"
) as AbiEvent;

export function useUserHistory() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const block = useBlockNumber();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (!address || !publicClient || !block.data) return;

    const unwatchers: Array<() => void> = [];

    const fetchPastLogs = async () => {
      try {
        // 🔑 safer range: last 50k blocks or from deployment
        const fromBlock = block.data > 50000n ? block.data - 50000n : 0n;
        const toBlock = block.data;

        const eventDefs: Array<{ type: HistoryItem["type"]; event: AbiEvent }> = [
          { type: "stake", event: STAKED_EVENT },
          { type: "withdraw", event: WITHDRAWN_EVENT },
          { type: "rewards", event: REWARDS_EVENT },
          { type: "emergency", event: EMERGENCY_EVENT },
        ];

        let all: HistoryItem[] = [];

        for (const e of eventDefs) {
          const logs = await publicClient.getLogs({
            address: STAKING_CONTRACT_ADDRESS,
            event: e.event,
            fromBlock,
            toBlock,
          });

          // 🔑 filter manually by user (don’t rely on args structure always being present)
          const userLogs = logs.filter(
            (log: any) => log.args?.user?.toLowerCase?.() === address.toLowerCase()
          );

          all.push(
            ...userLogs.map((log: any) => ({
              type: e.type,
              amount: formatEther(log.args.amount as bigint),
              txHash: log.transactionHash,
              timestamp: Number(log.args.timestamp),
            }))
          );
        }

        setHistory(all.sort((a, b) => b.timestamp - a.timestamp));
      } catch (err) {
        console.error("fetchPastLogs error:", err);
      }
    };

    const watchNewLogs = () => {
      const addToHistory =
        (type: HistoryItem["type"]) =>
        (logs: any[]) => {
          setHistory((prev) => {
            const newItems = logs
              .filter((log: any) => log.args?.user?.toLowerCase?.() === address.toLowerCase())
              .map((log: any) => ({
                type,
                amount: formatEther(log.args.amount as bigint),
                txHash: log.transactionHash,
                timestamp: Number(log.args.timestamp),
              }));
            return [...newItems, ...prev].sort((a, b) => b.timestamp - a.timestamp);
          });
        };

      unwatchers.push(
        publicClient.watchEvent({
          address: STAKING_CONTRACT_ADDRESS,
          event: STAKED_EVENT,
          onLogs: addToHistory("stake"),
        })
      );

      unwatchers.push(
        publicClient.watchEvent({
          address: STAKING_CONTRACT_ADDRESS,
          event: WITHDRAWN_EVENT,
          onLogs: addToHistory("withdraw"),
        })
      );

      unwatchers.push(
        publicClient.watchEvent({
          address: STAKING_CONTRACT_ADDRESS,
          event: REWARDS_EVENT,
          onLogs: addToHistory("rewards"),
        })
      );

      unwatchers.push(
        publicClient.watchEvent({
          address: STAKING_CONTRACT_ADDRESS,
          event: EMERGENCY_EVENT,
          onLogs: addToHistory("emergency"),
        })
      );
    };

    fetchPastLogs();
    watchNewLogs();

    return () => {
      unwatchers.forEach((u) => u());
    };
  }, [address, publicClient, block.data]);

  return history;
}