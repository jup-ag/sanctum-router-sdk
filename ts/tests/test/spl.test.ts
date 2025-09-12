import { describe, expect, it } from "vitest";
import {
  depositSolFixturesTest,
  depositStakeFixturesTest,
  expectRouterErr,
  localRpc,
  PICOSOL_MINT,
  prefundSwapViaStakeFixturesTest,
  prefundWithdrawStakeFixturesTest,
  routerForSwaps,
  withdrawSolFixturesTest,
} from "../utils";
import {
  quotePrefundWithdrawStake,
  quoteWithdrawSol,
} from "@sanctumso/sanctum-router";

const PICOSOL_TOKEN_ACC_NAME = "signer-picosol-token";

describe("SPL Test", async () => {
  // DepositSol
  it("spl-picosol-deposit-sol", async () => {
    await depositSolFixturesTest(1000000n, {
      inp: "signer-wsol-token",
      out: PICOSOL_TOKEN_ACC_NAME,
    });
  });

  // WithdrawSol
  it("spl-picosol-withdraw-sol", async () => {
    await withdrawSolFixturesTest(1000000n, {
      inp: PICOSOL_TOKEN_ACC_NAME,
      out: "signer-wsol-token",
    });
  });

  it("spl-picosol-withdraw-sol-fails-withdrawal-too-large", async () => {
    const rpc = localRpc();
    const router = await routerForSwaps(rpc, [
      { swap: "withdrawSol", inp: PICOSOL_MINT },
    ]);
    expectRouterErr(
      () =>
        quoteWithdrawSol(router, {
          // a very large amount
          amt: 1_000_000_000_000_000_000n,
          inp: PICOSOL_MINT,
        }),
      "SizeTooLargeErr:SplStakePoolError::SolWithdrawalTooLarge"
    );
  });

  // DepositStake
  it("spl-picosol-deposit-stake", async () => {
    await depositStakeFixturesTest({
      inp: "picosol-deposit-stake",
      out: PICOSOL_TOKEN_ACC_NAME,
    });
  });

  // PrefundWithdrawStake
  it("spl-picosol-prefund-withdraw-stake-small", async () => {
    await prefundWithdrawStakeFixturesTest(
      1_000_000_000n,
      PICOSOL_TOKEN_ACC_NAME
    );
  });

  it("spl-picosol-prefund-withdraw-stake-large", async () => {
    await prefundWithdrawStakeFixturesTest(
      750_000_000_000n,
      PICOSOL_TOKEN_ACC_NAME
    );
  });

  it("spl-picosol-quote-prefund-withdraw-stake-fails-when-amt-too-much", async () => {
    const rpc = localRpc();
    const router = await routerForSwaps(rpc, [
      { swap: "prefundWithdrawStake", inp: PICOSOL_MINT },
    ]);
    const quoteFn = () =>
      quotePrefundWithdrawStake(router, {
        // picsol validator list fixtures:
        // - vsi_active_lamports=210_425__790_541_328
        // - mint_supply=108_350__525_083_404
        // - total_lamports=128_350__525_083_404
        // - stake_withdrawal_fee=0
        // (yes i know the numbers dont add up, see test fixtures README)
        amt: 177_636_552_503_991n,
        inp: PICOSOL_MINT,
      });
    expect(quoteFn).toThrowError(/StakeLamportsNotEqualToMinimum/);
  });

  // PrefundSwapViaStake

  it("spl-picosol-prefund-swap-via-stake-into-reserve-small", async () => {
    await prefundSwapViaStakeFixturesTest(1_000_000_000n, {
      inp: PICOSOL_TOKEN_ACC_NAME,
      out: "signer-wsol-token",
    });
  });

  it("spl-picosol-prefund-swap-via-stake-into-reserve-large", async () => {
    await prefundSwapViaStakeFixturesTest(750_000_000_000n, {
      inp: PICOSOL_TOKEN_ACC_NAME,
      out: "signer-wsol-token",
    });
  });

  it("spl-picosol-prefund-swap-via-stake-into-reserve-use-bridge-vote", async () => {
    await prefundSwapViaStakeFixturesTest(
      1_000_000_000n,
      {
        inp: PICOSOL_TOKEN_ACC_NAME,
        out: "signer-wsol-token",
      },
      { useBridgeVote: true }
    );
  });

  it("spl-picosol-prefund-swap-via-stake-into-marinade-small", async () => {
    await prefundSwapViaStakeFixturesTest(1_000_000_000n, {
      inp: PICOSOL_TOKEN_ACC_NAME,
      out: "signer-msol-token",
    });
  });

  it("spl-picosol-prefund-swap-via-stake-into-marinade-large", async () => {
    await prefundSwapViaStakeFixturesTest(750_000_000_000n, {
      inp: PICOSOL_TOKEN_ACC_NAME,
      out: "signer-msol-token",
    });
  });

  it("spl-picosol-prefund-swap-via-stake-into-marinade-use-bridge-vote", async () => {
    await prefundSwapViaStakeFixturesTest(
      1_000_000_000n,
      {
        inp: PICOSOL_TOKEN_ACC_NAME,
        out: "signer-msol-token",
      },
      { useBridgeVote: true }
    );
  });

  it("spl-picosol-prefund-swap-via-stake-into-spl-bsol-small", async () => {
    await prefundSwapViaStakeFixturesTest(1_000_000_000n, {
      inp: PICOSOL_TOKEN_ACC_NAME,
      out: "signer-bsol-token",
    });
  });

  it("spl-picosol-prefund-swap-via-stake-into-spl-bsol-large", async () => {
    await prefundSwapViaStakeFixturesTest(750_000_000_000n, {
      inp: PICOSOL_TOKEN_ACC_NAME,
      out: "signer-bsol-token",
    });
  });

  it("spl-picosol-prefund-swap-via-stake-into-spl-bsol-use-bridge-vote", async () => {
    await prefundSwapViaStakeFixturesTest(
      1_000_000_000n,
      {
        inp: PICOSOL_TOKEN_ACC_NAME,
        out: "signer-bsol-token",
      },
      { useBridgeVote: true }
    );
  });
});
