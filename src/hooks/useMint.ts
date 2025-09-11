"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseAbi } from "viem";

export const TOKEN_ADDRESS = "0x7368b5c10e826f6EB58FfD846D3438B4112B8b7f";

export function useMint() {
  const { writeContract, data: hash, isPending } = useWriteContract();

  // Token implements a faucet-style function with no arguments
  const TOKEN_FAUCET_ABI = parseAbi([
    "function claimFaucet()",
  ]);

  const claimFaucet = () => {
    writeContract({
      address: TOKEN_ADDRESS,
      abi: TOKEN_FAUCET_ABI,
      functionName: "claimFaucet",
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  return { claimFaucet, isPending, isConfirming, isConfirmed, hash };
}
