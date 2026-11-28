import assert from "node:assert/strict";
import test from "node:test";

import { MirrorError } from "./oh-source.mjs";
import { STEPS, prebuild } from "./prebuild.mjs";

function recorder(statuses = {}) {
  const calls = [];
  const run = (step, env) => {
    calls.push({ step, ref: env.AGRO_SCRIPTS_REF });
    return statuses[step] ?? 0;
  };
  return { calls, run };
}

test("resolves the release tag once and pins it for every step in order", async () => {
  let resolved = 0;
  const { calls, run } = recorder();
  const result = await prebuild({
    resolve: async () => {
      resolved += 1;
      return "v1.2.3";
    },
    run,
    env: {},
  });
  assert.equal(resolved, 1);
  assert.deepEqual(result, { failed: null, status: 0 });
  assert.deepEqual(calls, STEPS.map((step) => ({ step, ref: "v1.2.3" })));
});

test("stops at the first failing step", async () => {
  const { calls, run } = recorder({ "sync-agro-docs.mjs": 3 });
  const result = await prebuild({ resolve: async () => "v1.2.3", run, env: {} });
  assert.deepEqual(result, { failed: "sync-agro-docs.mjs", status: 3 });
  assert.deepEqual(calls.map((call) => call.step), STEPS.slice(0, 2));
});

test("a resolve failure that the handler tolerates runs the steps unpinned", async () => {
  const { calls, run } = recorder();
  const errors = [];
  await prebuild({
    resolve: async () => {
      throw new MirrorError("offline", { transient: true });
    },
    run,
    env: {},
    onResolveError: (err) => errors.push(err.message),
  });
  assert.deepEqual(errors, ["offline"]);
  assert.deepEqual(calls, STEPS.map((step) => ({ step, ref: undefined })));
});
