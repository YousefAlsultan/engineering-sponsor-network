# Application flow

## Public decision

```text
Sponsor card
  -> sponsor details
  -> approved sponsor contact route?
       -> yes: Apply for Sponsorship
       -> no: View Official Program
```

## Current form structure

The current experience is multi-step rather than one very long form. It covers the team, applicant, request, sponsor fit, and review.

## Save vs delivery

Saving an application and emailing a sponsor are separate states.

When `NOTION_API_KEY` and `NOTION_DATA_SOURCE_ID` are configured, validated applications are saved directly to the Notion **Sponsorship Applications** database. Each submission becomes a readable database row with the team, applicant, request, sponsor fit, status, and dates in separate columns.

Without a Notion integration key, local development falls back to `.local/applications.jsonl`. That file is ignored by Git and must never be committed. Production rejects submissions unless Notion is configured or `APPLICATION_STORAGE_ENABLED=true` with a private durable writable volume. Automatic email delivery remains disabled.

The server owns `Application Status`, `Submitted Date`, and `Email Delivery Status`; browser payloads cannot mark a request approved or delivered. Recipient addresses are never accepted from the public client.

Never say an application was delivered when:
- no approved recipient email exists
- delivery failed
- only an external official program page exists

## Moderator workflow

Moderators can inspect application details and delivery/application status through the admin application dashboard.

## Schema note

The latest Notion schema exposes Engineering Team Type and Sponsorship Type Requested as multi-select properties. A standalone implementation should preserve the actual data type.
