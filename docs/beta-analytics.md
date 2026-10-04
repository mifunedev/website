# Beta analytics

## Approved default

The operator approved disabling optional visitor analytics for beta.
The root layout no longer imports or mounts `GoogleAnalytics` or `InitialLoadActiveUsers`, regardless of runtime mode or GA identifier.
The unused analytics implementation modules remain in the repository.
The change preserves marketing content, fonts, metadata, SEO, theme, and page children.

## Verification boundary

This source-only change does not prove that a deployment has disabled analytics.
The operator must verify the deployed beta before treating optional analytics as disabled in production.
The change does not establish privacy compliance.

## Retained gates

[Console issue #281](https://github.com/mifunedev/agro-console/issues/281) retains production verification and the public legal review, assent, publication, and live-payment gates.
These gates remain open.

Necessary authentication, billing, contact, and hosting processing continues.
The operator must inventory this processing and assess consent requirements where applicable.
This change adds no public legal pages or footer links.
The operator must approve legal content before publication.

Later analytics reenablement requires a separate human-reviewed decision.
