const required = ['application', 'sponsorCompany', 'university', 'teamName', 'teamType', 'applicantName', 'applicantEmail', 'sponsorshipTypes', 'requestedSupport', 'whyFit', 'projectDescription', 'sponsorOffer'] as const;
const allowed = new Set([
  ...required, 'sponsorshipProgram', 'applicantRole', 'teamWebsite', 'teamSocial', 'teamSize', 'competition',
  'requestedValue', 'needBy', 'deckUrl', 'notes', 'applicationStatus', 'submittedDate', 'deliveryStatus',
]);

export type ApplicationDraft = Record<string, string | number | string[]>;

export function validateApplication(input: unknown): ApplicationDraft {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid application payload.');
  const source = input as Record<string, unknown>;
  const clean: ApplicationDraft = {};
  for (const [key, value] of Object.entries(source)) {
    if (!allowed.has(key)) continue;
    if (typeof value === 'string') clean[key] = value.trim().slice(0, 5000);
    else if (typeof value === 'number' && Number.isFinite(value)) clean[key] = value;
    else if (Array.isArray(value) && value.every(item => typeof item === 'string')) clean[key] = value.slice(0, 20).map(item => item.trim().slice(0, 200));
  }
  for (const field of required) {
    const value = clean[field];
    if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) throw new Error(`Missing required field: ${field}.`);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(clean.applicantEmail))) throw new Error('Enter a valid applicant email.');
  clean.applicationStatus = 'Submitted';
  clean.deliveryStatus = 'Not Sent';
  clean.submittedDate = new Date().toISOString();
  return clean;
}
