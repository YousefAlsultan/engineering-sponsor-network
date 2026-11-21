import Link from 'next/link';
import { ArrowRight, BadgeCheck, Compass, GraduationCap, HeartHandshake, Rocket, ShieldCheck, Sparkles } from 'lucide-react';

export default function AboutPage(){
  return <div className="ss-info-page">
    <section className="ss-info-hero" data-ss-reveal><span className="ss-eyebrow">WHY SPONSIERRA EXISTS</span><h1>Engineering the connection<br/><em>between ideas and support.</em></h1><p>SponSierra helps university engineering teams find company sponsorship programs worth exploring—without digging through hundreds of unrelated pages.</p><Link href="/sponsors" className="ss-button ss-button-red">Explore opportunities <ArrowRight size={17}/></Link><div className="ss-info-orbit" aria-hidden="true"/></section>
    <section className="ss-info-section" data-ss-reveal><span className="ss-eyebrow">HOW IT WORKS</span><h2>More building. Less searching.</h2><div className="ss-info-cards">
      <div><Compass size={27}/><strong>01. Discover</strong><p>Browse engineering-specific programs and filter by the support your team actually needs.</p></div>
      <div><Sparkles size={27}/><strong>02. Find your fit</strong><p>Answer six questions to get a transparent, estimated sponsor compatibility shortlist.</p></div>
      <div><Rocket size={27}/><strong>03. Take action</strong><p>Check eligibility and application instructions directly with each company's official program.</p></div>
    </div></section>
    <section className="ss-info-trust" data-ss-reveal><div><span className="ss-eyebrow">TRUST BY DESIGN</span><h2>Good opportunities.<br/>Clear expectations.</h2><p>We believe student teams deserve useful information without misleading badges or hidden rankings.</p></div><div className="ss-info-principles">
      <div><BadgeCheck size={21}/><span><strong>Source checked, not partner claimed</strong><small>We check public sources. A check does not mean a company has partnered with SponSierra.</small></span></div>
      <div><ShieldCheck size={21}/><span><strong>Official application routes</strong><small>We link to official programs; this preview does not send applications on a team's behalf.</small></span></div>
      <div><HeartHandshake size={21}/><span><strong>Fair discovery</strong><small>Paid placement will not secretly change organic sponsor matches.</small></span></div>
    </div></section>
    <section className="ss-info-end" data-ss-reveal><GraduationCap size={30}/><h2>Built with student engineers in mind.</h2><p>SponSierra is an independent project. It is not affiliated with The Ohio State University or the companies listed in the directory.</p><Link href="/match">Find your sponsor fit <ArrowRight size={16}/></Link></section>
  </div>
}
