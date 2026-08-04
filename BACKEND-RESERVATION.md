# Backend Integration Reservation

This repository currently ships a public-information front end and design preview only. Authentication, appointments, contact intake, subscriptions, document uploads, application tracking, payments, live wait times, announcements, translations, and content-management APIs are intentionally not connected.

## Security boundary

- No API keys, private tokens, payment credentials, signing secrets, database credentials, or storage credentials may be committed to this repository or exposed through browser JavaScript.
- All future secrets must remain in an approved server-side secret manager and be accessed only by authenticated server workloads.
- The browser may receive a public API base URL after approval, but never a privileged credential.
- Sensitive services must fail closed when runtime configuration is absent.
- Preview forms must never claim that data was sent, stored, paid, uploaded, tracked, or accepted.

## Reserved service contracts

| Service | Proposed public route | Required production controls |
|---|---|---|
| Appointments | `/appointments` | Rate limiting, consent, scheduling authority, confirmation workflow, audit log |
| Contact intake | `/contact` | Spam protection, routing rules, retention policy, secure transport, incident owner |
| Accounts | `/auth` | Approved identity provider, MFA, recovery, session controls, audit events |
| Documents | `/documents` | Malware scanning, encryption, access controls, retention/deletion schedule, download audit |
| Application status | `/applications/{reference}` | Identity verification, authorization, privacy-safe errors, immutable status history |
| Payments | `/payments` | Approved processor, PCI-scoped architecture, fee authority, receipts, refunds, reconciliation |
| Newsletter | `/subscriptions` | Confirmed opt-in, unsubscribe, consent evidence, suppression list |
| Live content | `/announcements`, `/content`, `/office-load` | Editorial approval, expiry dates, source attribution, cache/fallback behavior |

## Activation gates

No reserved service should be enabled until the Embassy has approved:

1. Service owner and accountable decision-maker.
2. Data classification and privacy impact assessment.
3. Retention, deletion, access-control, breach-response, and audit requirements.
4. Hosting environment, domain, certificates, monitoring, backups, and recovery objectives.
5. Threat model, security testing, accessibility testing, and operational support plan.
6. English/French content, consular policy, fees, hours, and official contact details.
7. Production acceptance tests and a documented rollback procedure.

## Front-end activation rule

The current client checks for an approved runtime API base before attempting live requests. Until that configuration exists, the website must continue to show guidance-only or unavailable states and must not collect sensitive information.
