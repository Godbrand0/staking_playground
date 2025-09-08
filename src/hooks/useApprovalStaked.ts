import { useTokenApproval, TOKEN_ADDRESS } from "./useApproval";
import { useStakingContract } from "./useStaking";
import { STAKING_CONTRACT_ADDRESS } from "../config/contract";

export function useApproveAndStake() {
  const {
    approve,
    isPending: isApproving,
    isConfirming,
    isConfirmed,
  } = useTokenApproval();
  const { stake, isPending: isStaking } = useStakingContract();

  const approveAndStake = async (amount: string) => {
    // 1. Approve staking contract
    approve(STAKING_CONTRACT_ADDRESS, amount);

    // 2. Wait until approval confirms
    const checkApproval = new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (isConfirmed) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });

    await checkApproval;

    // 3. Stake tokens
    stake(amount);
  };

  return {
    approveAndStake,
    isApproving,
    isStaking,
    isConfirming,
  };
}
