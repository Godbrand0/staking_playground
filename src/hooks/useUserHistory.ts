import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useBlockNumber } from "wagmi";
import { parseAbiItem, formatEther, type AbiEvent, type WatchEventOnLogsParameter } from "viem";
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

        const all: HistoryItem[] = [];

        for (const e of eventDefs) {
          const logs = await publicClient.getLogs({
            address: STAKING_CONTRACT_ADDRESS,
            event: e.event,
            fromBlock,
            toBlock,
          });

          // 🔑 filter manually by user (don’t rely on args structure always being present)
          const userLogs = logs.filter((log) => {
            // log.args can be an array or an object
            if (Array.isArray(log.args)) return false;
            if (
              typeof log.args === "object" &&
              log.args !== null &&
              "user" in log.args &&
              typeof (log.args as Record<string, unknown>).user === "string"
            ) {
              return ((log.args as Record<string, unknown>).user as string).toLowerCase() === address.toLowerCase();
            }
            return false;
          });

          all.push(
            ...userLogs.map((log) => ({
              type: e.type,
              amount: formatEther(
                typeof log.args === "object" && log.args !== null && "amount" in log.args
                  ? (log.args as Record<string, unknown>).amount as bigint
                  : 0n
              ),
              txHash: log.transactionHash,
              timestamp: Number(
                typeof log.args === "object" && log.args !== null && "timestamp" in log.args
                  ? (log.args as Record<string, unknown>).timestamp
                  : 0
              ),
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
        (logs: WatchEventOnLogsParameter<AbiEvent>) => {
          const userLogs = logs.filter((log) => {
            if (Array.isArray(log.args)) return false;
            if (
              typeof log.args === "object" &&
              log.args !== null &&
              "user" in log.args &&
              typeof (log.args as Record<string, unknown>).user === "string"
            ) {
              return ((log.args as Record<string, unknown>).user as string).toLowerCase() === address.toLowerCase();
            }
            return false;
          });

          setHistory((prev) => {
            const newItems = userLogs.map((log) => ({
              type,
              amount: formatEther(
                typeof log.args === "object" && log.args !== null && "amount" in log.args
                  ? (log.args as Record<string, unknown>).amount as bigint
                  : 0n
              ),
              txHash: log.transactionHash || "",
              timestamp: Number(
                typeof log.args === "object" && log.args !== null && "timestamp" in log.args
                  ? (log.args as Record<string, unknown>).timestamp
                  : 0
              ),
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