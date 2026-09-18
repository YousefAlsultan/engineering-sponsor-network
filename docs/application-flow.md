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

Never say an application was delivered when:
- no approved recipient email exists
- delivery failed
- only an external official program page exists

## Moderator workflow

Moderators can inspect application details and delivery/application status through the admin application dashboard.

## Schema note

The latest Notion schema exposes Engineering Team Type and Sponsorship Type Requested as multi-select properties. A standalone implementation should preserve the actual data type.
