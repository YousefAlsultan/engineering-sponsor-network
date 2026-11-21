# Project checkpoint — November 21, 2026

## Working and verified

- Private website published at https://engineering-sponsor-network-yousef-preview.yousefalsultan.chatgpt.site/.
- All 27 source sponsor listings preserved; existing filters show 25 current listings by default.
- Rocket intro removed from the application shell. Pastel sponsor cards and topographic contour sidebar applied. Original card 01 image was not available for exact fidelity comparison.
- Supabase project SponSierra (vyqrnxmidsrlwvmvzrbo): real account verification, protected profile/settings pages, owner-only profile writes, and profile persistence verified.
- Direct one-time code verification and private profile reads passed. The account page has an existing-code path that does not request another email.
- Founder confirmed editing, saving and refreshing a profile. Database confirmed the update and activity record.
- Notion account sync deployed and verified against the existing Student Accounts data source. One account was synced with no errors, and the matching Notion record was independently confirmed.
- Automatic sync runs every 10 minutes through the Supabase Cron job sponsierra-notion-account-sync. Private invocation credentials are in Supabase Vault. The worker contains only the credential digest, not the secret.
- Temporary owner sign-in helper is disabled (JWT required, handler returns HTTP 410).

## Reminder once the software name is chosen

Revisit email setup: choose the final domain, connect a dedicated SMTP sender, configure the numeric-code template and exact Supabase redirect URLs, and test fresh signup/signin. The built-in sender is restricted to organization member addresses and has a small shared hourly limit. Do not treat owner testing as public email readiness. This is a project reminder, not a timed notification.

## Next focus

1. Mobile layout and profile/photo upload testing, including navigation and readability.
2. Test a second account and logout/signin; confirm there is no cross-account profile access.
3. Validate the core discovery experience with a small group of student engineering teams: useful sponsor matches, clear eligibility, working official links and saved sponsors.
4. Confirm the exact selected sponsor card reference and review the one sponsor URL flagged by the link checker.
5. Keep the site private until email setup and invite testing are ready. Do not expand to payments or public community posting yet.

## Security and backup scope

GitHub stores source code, public sponsor data and setup documentation. It must not store live student records, Notion tokens, SMTP credentials, session tokens, one-time codes, Vault secrets or database exports containing personal data. Those remain in their connected services.
