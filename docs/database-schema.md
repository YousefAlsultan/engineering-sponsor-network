# Database schema

The current Softr application uses Notion as its data source.

## STEM Sponsor Database

Core sponsor/program fields:

- Company Name
- Company Website
- Company Logo / Thumbnail URL
- Sponsorship Program Name
- Sponsorship Type
- Engineering Team Types
- Company Industry
- What They Provide
- Estimated Sponsorship Value
- Geographic Eligibility
- Application Status
- Deadline
- Eligibility / Requirements
- What the Sponsor May Expect
- Official Sponsorship URL
- Sponsor Contact Email
- Alternative Contact URL
- Public Summary
- Verification Status
- Last Verified
- Last Checked
- Source
- Source Type
- Directory Status
- Company Claim Status
- Listing Confidence Score
- Moderation Status
- Platform Relationship
- Publish on Website
- Slug
- Discovery Date

### Directory Status
- Active
- Upcoming
- Recently Expired
- Expired Archive
- Unknown

### Company Claim Status
- Unclaimed
- Pending Company Verification
- Company Verified
- Rejected

### Moderation Status
- Candidate
- Needs Review
- Approved
- Rejected

### Platform Relationship
- Independent Listing
- Partner

## Sponsorship Applications

Core application fields:

- Application
- Application ID
- Sponsor Company
- Sponsorship Program
- University
- Engineering Team Name
- Engineering Team Type
- Applicant Name
- Applicant Role
- Applicant Email
- Team Website
- Team Social / Project URL
- Number of Team Members
- Competition / Project
- Sponsorship Type Requested
- Amount / Value Requested
- Requested Support
- Why This Sponsor Is a Good Fit
- Team / Project Description
- What the Team Can Offer Sponsor
- Need-By Date
- Sponsorship Deck URL
- Additional Notes
- Application Status
- Submitted Date
- Recipient Email
- Email Delivery Status

### Application Status
- Draft
- Submitted
- Email Sent
- Delivery Failed
- Response Received
- Approved
- Rejected
- Closed

### Email Delivery Status
- Not Sent
- Sent
- Failed

## Compatibility rule

Do not silently rename current fields. Softr bindings depend on these names.
