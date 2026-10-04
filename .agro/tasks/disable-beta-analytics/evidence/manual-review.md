# Manual review: optional beta analytics

## Prerequisites

Run these commands in the website task worktree inside the sandbox. Node.js and npm must be available. Install dependencies with `npm ci` before lint and build.

## A. Optional tracking removal

Run `node --test scripts/beta-analytics.test.mjs`.

Observed integrated result: 5 tests passed; 0 tests failed. Exit status: 0.

Run `grep -nE 'GoogleAnalytics|InitialLoadActiveUsers' src/app/layout.tsx`.

Observed integrated result: no output. Exit status: 1. The root layout has neither tracking reference.

The review expects this negative result. Necessary processing and unused implementation modules remain outside the removal scope.

## B. Existing validation

Run `npm run lint`.

Observed integrated result: `No ESLint warnings or errors`. Exit status: 0.

Run `npm run build`.

Observed integrated result: build completed. Exit status: 0.

The advisor recorded integrated validation in `verification.txt` before accepting this change.

## Cleanup

These commands create no service, account, node, or external resource. The build can regenerate `public/sw.js`; do not include that generated change in the implementation commit.

## Evidence limits

This source review does not prove production deployment, absence of every tracker, privacy compliance, or legal approval. Issue #281 retains those gates.
