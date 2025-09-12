import { describe, it } from "vitest";
import {
  BSOL_MINT,
  expectRouterErr,
  localRpc,
  prefundSwapViaStakeFixturesTest,
  prefundWithdrawStakeFixturesTest,
  routerForSwaps,
  STSOL_MINT,
} from "../utils";
import {
  quotePrefundSwapViaStake,
  quotePrefundWithdrawStake,
} from "@sanctumso/sanctum-router";

const STSOL_TOKEN_ACC_NAME = "signer-stsol-token";
const STSOL_EXCEED_WITHDRAW_LAMPORTS_IN_STSOL = 310_355_474_592n;

describe("Lido Test", async () => {
  // PrefundWithdrawStake
  it("lido-prefund-withraw-stake", async () => {
    await prefundWithdrawStakeFixturesTest(
      1_000_000_000n,
      STSOL_TOKEN_ACC_NAME
    );
  });

  it("lido-prefund-withraw-stake-fails-withdrawal-too-large", async () => {
    const rpc = localRpc();
    const router = await routerForSwaps(rpc, [
      { swap: "prefundWithdrawStake", inp: STSOL_MINT },
    ]);
    expectRouterErr(
      () =>
        quotePrefundWithdrawStake(router, {
          amt: STSOL_EXCEED_WITHDRAW_LAMPORTS_IN_STSOL,
          inp: STSOL_MINT,
        }),
      "SizeTooLargeErr:LidoError::InvalidAmount"
    );
  });

  it("lido-prefund-withdraw-stake-fails-withdrawal-too-small-for-prefund", async () => {
    const rpc = localRpc();
    const router = await routerForSwaps(rpc, [
      { swap: "prefundWithdrawStake", inp: STSOL_MINT },
    ]);
    expectRouterErr(
      () =>
        quotePrefundWithdrawStake(router, {
          amt: 1_000n,
          inp: STSOL_MINT,
        }),
      "SizeTooSmallErr:withdrawn stake too small"
    );
  });

  // PrefundSwapViaStake

  it("lido-prefund-swap-via-stake-into-reserve", async () => {
    await prefundSwapViaStakeFixturesTest(1_000_000_000n, {
      inp: STSOL_TOKEN_ACC_NAME,
      out: "signer-wsol-token",
    });
  });

  it("lido-prefund-swap-via-stake-into-reserve-use-bridge-vote", async () => {
    await prefundSwapViaStakeFixturesTest(
      1_000_000_000n,
      {
        inp: STSOL_TOKEN_ACC_NAME,
        out: "signer-wsol-token",
      },
      {
        useBridgeVote: true,
      }
    );
  });

  it("lido-prefund-swap-via-stake-into-marinade", async () => {
    await prefundSwapViaStakeFixturesTest(1_000_000_000n, {
      inp: STSOL_TOKEN_ACC_NAME,
      out: "signer-msol-token",
    });
  });

  it("lido-prefund-swap-via-stake-into-marinade-use-bridge-vote", async () => {
    await prefundSwapViaStakeFixturesTest(
      1_000_000_000n,
      {
        inp: STSOL_TOKEN_ACC_NAME,
        out: "signer-msol-token",
      },
      {
        useBridgeVote: true,
      }
    );
  });

  it("lido-prefund-swap-via-stake-into-spl-bsol", async () => {
    await prefundSwapViaStakeFixturesTest(1_000_000_000n, {
      inp: STSOL_TOKEN_ACC_NAME,
      out: "signer-bsol-token",
    });
  });

  it("lido-prefund-swap-via-stake-into-spl-bsol-use-bridge-vote", async () => {
    await prefundSwapViaStakeFixturesTest(
      1_000_000_000n,
      {
        inp: STSOL_TOKEN_ACC_NAME,
        out: "signer-bsol-token",
      },
      { useBridgeVote: true }
    );
  });

  it("lido-prefund-swap-via-stake-fails-withdrawal-too-large", async () => {
    const rpc = localRpc();
    const router = await routerForSwaps(rpc, [
      { swap: "prefundSwapViaStake", inp: STSOL_MINT, out: BSOL_MINT },
    ]);
    expectRouterErr(
      () =>
        quotePrefundSwapViaStake(router, {
          amt: STSOL_EXCEED_WITHDRAW_LAMPORTS_IN_STSOL,
          inp: STSOL_MINT,
          out: BSOL_MINT,
        }),
      "SizeTooLargeErr:LidoError::InvalidAmount"
    );
  });

  it("lido-prefund-swap-via-stake-fails-withdrawal-too-small-for-prefund", async () => {
    const rpc = localRpc();
    const router = await routerForSwaps(rpc, [
      { swap: "prefundSwapViaStake", inp: STSOL_MINT, out: BSOL_MINT },
    ]);
    expectRouterErr(
      () =>
        quotePrefundSwapViaStake(router, {
          amt: 1_000n,
          inp: STSOL_MINT,
          out: BSOL_MINT,
        }),
      "SizeTooSmallErr:withdrawn stake too small"
    );
  });
});
