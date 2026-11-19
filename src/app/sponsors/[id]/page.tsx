import { notFound } from 'next/navigation';
import SponsorDetail from '@/components/sponsierra-detail';
import { getPublicSponsors } from '@/lib/server/sponsors';

export async function generateStaticParams() {
  return (await getPublicSponsors()).map(record=>({id:record.id}));
}
export default async function Page({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  const record=(await getPublicSponsors()).find(s=>s.id===id);
  if (!record) notFound();
  return <SponsorDetail record={record}/>;
}
