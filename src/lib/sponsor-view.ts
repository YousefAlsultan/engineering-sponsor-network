import type { PublicValue, SponsorRecord } from './sponsor-model';

export function asText(value: PublicValue | undefined): string {
  if (value == null) return '';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

export function asList(value: PublicValue | undefined): string[] {
  if (Array.isArray(value)) return value.map(String);
  return value == null || value === '' ? [] : [String(value)];
}

export function isArchived(record: SponsorRecord): boolean {
  const fields = record.fields;
  const status = asText(fields['Directory Status']);
  const deadline = asText(fields.Deadline);
  return ['Expired Archive', 'Recently Expired'].includes(status)
    || fields['Application Status'] === 'Closed'
    || (!!deadline && deadline < new Date().toISOString().slice(0, 10) && status !== 'Upcoming');
}

export function sponsorUrl(record: SponsorRecord) {
  return `/sponsors/${record.id}`;
}

export function officialUrl(record: SponsorRecord): string {
  const url = asText(record.fields['Official Sponsorship URL']);
  return /^https:\/\//i.test(url) ? url : '';
}

export function sponsorInitials(record: SponsorRecord) {
  return asText(record.fields['Company Name']).split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase();
}

export type MatchAnswers = {
  team: string;
  support: string;
  region: string;
  stage: string;
  timeframe: string;
  priority: string;
};

// A transparent, deterministic first-version relevance estimate.
// It is not an acceptance probability, endorsement, or AI prediction.
export function scoreSponsor(record: SponsorRecord, answers: MatchAnswers) {
  const f = record.fields;
  const teams = asList(f['Engineering Team Types']);
  const supports = asList(f['Sponsorship Type']);
  const geos = asList(f['Geographic Eligibility']);
  const archive = isArchived(record);
  const reasons: string[] = [];
  let score = 0;
  if (teams.includes(answers.team)) { score += 35; reasons.push(`Supports ${answers.team}`); }
  else if (teams.includes('All Engineering Teams')) { score += 28; reasons.push('Supports engineering teams'); }
  if (supports.includes(answers.support)) { score += 35; reasons.push(`Offers ${answers.support.toLowerCase()}`); }
  if (geos.includes('Global') || geos.includes(answers.region)
      || (answers.region === 'United States' && geos.includes('North America'))
      || (answers.region === 'Canada' && geos.includes('North America'))) {
    score += 20; reasons.push('Geographic eligibility aligns');
  } else if (!geos.length || geos.includes('Unknown')) {
    score += 8; reasons.push('Location needs confirmation');
  }
  if (!archive) { score += 10; reasons.push('Current or upcoming program'); }
  return {score: Math.min(score, 100), reasons, archived: archive};
}
