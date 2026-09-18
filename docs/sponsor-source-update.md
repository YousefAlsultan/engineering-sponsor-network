# Sponsor source update — September 18, 2026

The public directory now contains 27 published, verified programs. Three official programs were added:

- [PTC Education Collegiate Team Sponsorship](https://www.ptc.com/en/education/free-software/collegiate-teams): free Creo Premium, Mathcad Prime, training and community resources for eligible collegiate engineering teams.
- [Analog Devices Anveshan Fellowship 2026–27](https://www.analog.com/en/lp/001/anveshan.html): an India-based engineering fellowship for teams of three to five students with a faculty advisor. The July 15, 2026 proposal deadline has passed, so it appears only in the expired archive.
- [Würth Elektronik University Support](https://www.we-online.com/en/support/university): components, technical support and workshops for university engineering associations across racing, aerospace, robotics and other project categories.

`pnpm check:sponsors` now checks every official program URL without changing data. `pnpm check:sponsors -- --write` stamps `Last Checked` for reachable sources. The first full run reached 26 of 27 sources. Mouser returned HTTP 403 to the automated checker and remains flagged for manual review; this does not prove its program is unavailable.

Every new record remains an independent listing. None is marked as a platform partner or company-confirmed listing.
