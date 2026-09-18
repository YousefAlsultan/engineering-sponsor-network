export type PublicValue = string | string[] | boolean | number | null;
export type SponsorRecord = { id: string; fields: Record<string, PublicValue> };

// Allowlist intentionally excludes email, moderation notes, and internal record IDs.
export const publicFields = [
  'Company Name', 'Company Website', 'Company Logo / Thumbnail URL', 'Sponsorship Program Name',
  'Sponsorship Type', 'Engineering Team Types', 'Company Industry', 'What They Provide',
  'Estimated Sponsorship Value', 'Geographic Eligibility', 'Application Status', 'Deadline',
  'Eligibility / Requirements', 'What the Sponsor May Expect', 'Official Sponsorship URL',
  'Alternative Contact URL', 'Public Summary', 'Last Checked', 'Last Verified', 'Directory Status',
  'Company Claim Status', 'Source Type', 'Platform Relationship', 'Verification Status',
  'Publish on Website', 'Slug', 'Source', 'Has Contact Route',
] as const;

export function publicSponsors(records: SponsorRecord[]): SponsorRecord[] {
  return records.filter(({fields: f}) => f['Publish on Website'] === true && f['Verification Status'] === 'Verified Sponsor')
    .map(record => ({ id: record.id, fields: Object.fromEntries(publicFields.map(key => [key, record.fields[key] ?? null])) }));
}
