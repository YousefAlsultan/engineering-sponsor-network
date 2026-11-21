# Current status

See [the November 21 checkpoint](project-checkpoint-2026-11-21.md). Account persistence and Notion syncing are now verified. The setup notes below describe the original milestone and include steps that have since been completed.

# SponSierra — Student Accounts (Milestone 2.1)

Supabase project **SponSierra** has been created in `us-east-2` (Ohio), with the account schema, row-level security policies, profile-media bucket, and activity queue applied. The website is configured with the public Supabase URL and publishable key. **Public registration is not launched yet:** the site is still owner-private, email sender/template setup needs testing, and Notion activity sync still needs service-side integration secrets.

## Complete the Supabase connection

1. ✅ Project created: `vyqrnxmidsrlwvmvzrbo`. Do not share database passwords or secret keys.
2. ✅ Schema and policies installed on the new project. The SQL file in this repo is the baseline schema, not an instruction to rerun the same `create policy` statements.
3. In Authentication, enable email OTP and **show `{{ .Token }}` in the email template**, so students receive a code rather than only a link.
4. Configure custom SMTP (such as Resend or another provider). Supabase's default sender does **not** deliver to arbitrary university/club addresses.
5. ✅ The public URL and publishable key are configured in Sites and compiled as a safe fallback in the frontend. No service role key is present client-side.
6. Rebuild and redeploy this site, still owner-only while testing. Test two separate accounts, the email verification flow, profile updates, media uploads and logout.
7. Review the Sites audience before inviting students: the Sites owner-only access gate currently blocks public visitors even if Supabase sign-in works. Do not change audience unintentionally.

## Access rules

- Any valid email can register; confirmation proves access to the mailbox, **not** that the user is an OSU student or member of an organization.
- The student-verification table is not student-writable. Verify university/team membership in a separate admin process.
- Each student's profile is private by default. Public visibility controls and public profile URLs should be approved before enabling them.
- Only active paid members with an unexpired paid term can insert posts. Client-side buttons must not grant permission by themselves.
- Student-uploaded `student-profile-media` bucket objects are publicly viewable **by direct URL**. Do not upload confidential photos.
- All admin, database, and Notion credentials belong server-side only.

## Notion account mirror (after account launch)

This repo includes `supabase/functions/notion-account-sync/index.ts`, a server-only worker that reads a private queue of account events and creates/updates records in the **existing** Notion `SponSierra — Student Accounts` table. It sends names, emails, verified email status, account IDs, organization, access tier, joined, last active, post counts and a short event label. No passwords, photos, or raw activity history.

1. Create a Notion integration with edit permission on the already-created tracker database.
2. Set Edge Function secrets `NOTION_INTEGRATION_TOKEN`, `NOTION_STUDENT_DATA_SOURCE_ID=41d60d63-f628-81c6-a4f2-000b5315c8f8`, `NOTION_SYNC_SECRET`, and `DATABASE_SERVICE_KEY` (a Supabase secret key, **never** the public browser key).
3. Deploy the `notion-account-sync` Edge Function. Its endpoint requires a private `x-cron-secret` header matching `NOTION_SYNC_SECRET`.
4. Add a server-side scheduled invocation (for example, every 10 minutes via Supabase Cron and Vault). Do not call this function from browser code. Test with a non-real account before enabling the schedule.
5. Confirm Notion receives only the intended metadata, correct user identity, and no duplicate rows.

## Not yet implemented

- Live payments and Stripe webhooks, paid member posting UI, and public student search/profile visibility.
- A founder admin screen to approve OSU affiliation or team membership.
- Custom SMTP setup, email-code template verification, actual Notion connection, and automated sync schedule. The Supabase schema is already deployed.
