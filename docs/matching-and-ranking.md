# Matching and search

The first matching system should be deterministic and explainable.

## Hard eligibility first

Before ranking:
- remove clearly ineligible geography
- handle expired/current status
- respect explicit team-type eligibility where known

## Suggested V1 relevance weighting

```text
Team compatibility                30%
Requested support compatibility   25%
Geographic eligibility            15%
Program status                    10%
Freshness                         10%
Deadline relevance                 5%
Listing confidence                 5%
                                  100%
```

## Search expansion

Examples:
- machining -> CNC / manufacturing / fabrication
- circuit boards -> PCB / PCBA / electronics
- free CAD -> CAD / engineering software / licenses
- parts -> components / products / hardware / materials

## Ranking integrity

Do not secretly boost organic relevance because a sponsor pays. Paid placement must be explicitly labeled Sponsored.
