import test from 'node:test';
import assert from 'node:assert/strict';
import { validateApplication } from '../src/lib/application-model.ts';

const valid = {
  application:'Team → Sponsor', sponsorCompany:['sponsor-1'], university:'Example University', teamName:'Example Racing',
  teamType:'Formula SAE', applicantName:'Student Name', applicantEmail:'student@example.edu', sponsorshipTypes:['Manufacturing'],
  requestedSupport:'Machine two uprights.', whyFit:'The sponsor offers machining.', projectDescription:'Electric race car.', sponsorOffer:'Project updates.',
};

test('application validation enforces server-owned status and strips unknown fields', () => {
  const result = validateApplication({...valid, applicationStatus:'Approved', deliveryStatus:'Sent', recipientEmail:'private@example.com'});
  assert.equal(result.applicationStatus, 'Submitted');
  assert.equal(result.deliveryStatus, 'Not Sent');
  assert.equal(result.recipientEmail, undefined);
});

test('application validation rejects malformed applicant emails', () => {
  assert.throws(() => validateApplication({...valid, applicantEmail:'not-an-email'}), /valid applicant email/);
});
