import 'server-only';
import snapshot from '../../../data/sponsors.public.json';
import { publicSponsors, type SponsorRecord } from '../sponsor-model';

// Read-only public export: no credentials are needed for the visual-mirror milestone.
// Replace the source here with a server-side integration when live sync is configured.
export async function getPublicSponsors(): Promise<SponsorRecord[]> {
  return publicSponsors(snapshot as SponsorRecord[]);
}
