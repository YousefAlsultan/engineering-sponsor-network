import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicSponsors, type SponsorRecord } from '../src/lib/sponsor-model.ts';
import data from '../data/sponsors.public.json' with { type: 'json' };

test('only published, verified records cross the server boundary', () => {
  const make = (published: boolean, verification: string): SponsorRecord => ({id: 'test', fields: {'Publish on Website': published, 'Verification Status': verification}});
  assert.equal(publicSponsors([make(true, 'Verified Sponsor'), make(false, 'Verified Sponsor'), make(true, 'Needs Review')]).length, 1);
});
test('contact addresses and private notes never cross the public boundary', () => {
  const [record] = publicSponsors([{id:'test', fields: {'Publish on Website':true, 'Verification Status':'Verified Sponsor', 'Sponsor Contact Email':'private@example.test', 'Moderation Notes':'private', 'Company Name':'Public company'}}]);
  assert.equal(record.fields['Company Name'], 'Public company');
  assert.equal(JSON.stringify(record).includes('private'), false);
});
test('export contains no email addresses or private source URLs and retains all published programs', () => {
  assert.equal(publicSponsors(data as SponsorRecord[]).length, 27);
  assert.doesNotMatch(JSON.stringify(data), /[\w.+-]+@[\w.-]+\.[a-z]{2,}|app\.notion\.com|notion\.so/i);
});

test('listings never claim an application is open past its recorded deadline', () => {
  const today = new Date().toISOString().slice(0, 10);
  for (const record of data) {
    const deadline = record.fields.Deadline;
    if (record.fields['Application Status'] === 'Open' && typeof deadline === 'string') {
      assert.ok(deadline >= today, `${record.fields['Company Name']} has an expired deadline but is marked Open`);
    }
  }
});
