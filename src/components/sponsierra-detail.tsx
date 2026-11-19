'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, CheckCircle2, Clipboard, ExternalLink, Globe2, Layers3, ShieldCheck, Sparkles } from 'lucide-react';
import type { SponsorRecord } from '@/lib/sponsor-model';
import { asList, asText, isArchived, officialUrl, sponsorInitials } from '@/lib/sponsor-view';

export default function SponsorDetail({record}:{record:SponsorRecord}) {
  const f=record.fields;
  const company=asText(f['Company Name']);
  const support=asList(f['Sponsorship Type']);
  const teams=asList(f['Engineering Team Types']);
  const geo=asList(f['Geographic Eligibility']);
  const archived=isArchived(record);
  const official=officialUrl(record);
  const [draft,setDraft]=useState(false);
  const [name,setName]=useState('');
  const [university,setUniversity]=useState('');
  const [project,setProject]=useState('');
  const [request,setRequest]=useState('');
  const [copied,setCopied]=useState(false);
  const proposal=`SPONSIERRA SPONSORSHIP PROPOSAL DRAFT\nSponsor: ${company}\nUniversity: ${university}\nTeam: ${name}\nProject: ${project}\nRequested support: ${request}\n\nDraft only — not submitted. Review official sponsor requirements before applying.\nOfficial source: ${official}`;
  return <div className="ss-detail">
    <Link href="/sponsors" className="ss-back-link"><ArrowLeft size={16}/> All sponsors</Link>
    <div className="ss-detail-cover"><div className="ss-detail-orbit ss-detail-orbit-one"/><div className="ss-detail-orbit ss-detail-orbit-two"/><div className="ss-detail-cover-content"><span className="ss-eyebrow ss-eyebrow-light">THE SPONSOR JOURNAL / FIELD NOTES</span><span className="ss-detail-cover-index">SPONSIERRA / {record.id.toUpperCase()}</span><h1>Bringing bold engineering<br/>ideas into reach<span>.</span></h1><p>Discover the organizations making the next generation of innovation possible.</p></div></div>
    <div className="ss-detail-header"><div className="ss-detail-logo">{sponsorInitials(record)}</div><div className="ss-detail-title"><span className="ss-eyebrow">FEATURED SPONSORSHIP PROGRAM</span><h2>{company}</h2><p>{asText(f['Sponsorship Program Name'])}</p></div><div className="ss-detail-source"><ShieldCheck size={20}/><span><strong>Official source checked</strong><small>{f['Last Checked']?`Last checked ${asText(f['Last Checked'])}`:'Date not recorded'}</small></span></div></div>
    <div className="ss-detail-layout"><div className="ss-detail-story">
      <section className="ss-detail-section"><span className="ss-eyebrow">01 / THE OPPORTUNITY</span><h3>What this program makes possible.</h3><p className="ss-detail-lead">{asText(f['Public Summary'])}</p><p>{asText(f['What They Provide'])}</p></section>
      <section className="ss-detail-section"><span className="ss-eyebrow">02 / ENGINEERING SUPPORT</span><h3>Resources on offer.</h3><div className="ss-detail-resource-grid">{support.map(v=><div key={v}><Layers3 size={21}/><strong>{v}</strong><span>Program-supported resource</span></div>)}</div>{f['Estimated Sponsorship Value']&&<p className="ss-detail-note"><strong>Published support value:</strong> {asText(f['Estimated Sponsorship Value'])}</p>}</section>
      <section className="ss-detail-section"><span className="ss-eyebrow">03 / WHO CAN APPLY</span><h3>Built for teams like yours.</h3><div className="ss-detail-chips">{teams.map(t=><span key={t}>{t}</span>)}</div><p>{asText(f['Eligibility / Requirements'])||'Specific requirements may vary. Read the official program page before submitting an application.'}</p></section>
      <section className="ss-detail-section"><span className="ss-eyebrow">04 / APPLICATION NOTES</span><h3>Make your approach count.</h3><p>{asText(f['What the Sponsor May Expect'])||'Explain your engineering objectives, technical milestones, what support you need, and how the company can contribute to a measurable outcome.'}</p><div className="ss-detail-caveat"><ShieldCheck size={19}/><span>SponSierra independently checks public program sources. This badge does not mean the company has claimed or partnered with the platform.</span></div></section>
      {draft&&<section className="ss-detail-section ss-proposal" id="proposal"><span className="ss-eyebrow">PROPOSAL WORKBENCH</span><h3>Prepare your request.</h3><p>Draft an introduction to {company}. Nothing is sent or saved to a server.</p><div className="ss-proposal-fields"><label>University<input value={university} onChange={e=>setUniversity(e.target.value)} placeholder="Your university" /></label><label>Engineering team<input value={name} onChange={e=>setName(e.target.value)} placeholder="Team name" /></label><label>Project<textarea value={project} onChange={e=>setProject(e.target.value)} placeholder="Describe your mission and project..." rows={3}/></label><label>Support needed<textarea value={request} onChange={e=>setRequest(e.target.value)} placeholder="What resources would help you?" rows={3}/></label></div><button className="ss-button ss-button-red" onClick={async()=>{try{await navigator.clipboard.writeText(proposal);setCopied(true)}catch{setCopied(false)}}}><Clipboard size={16}/>{copied?'Copied draft':'Copy proposal draft'}</button><p className="ss-proposal-disclaimer">Draft only. Copying this does not apply to or contact {company}. Use the official company application process.</p></section>}
    </div>
    <aside className="ss-detail-aside"><div className="ss-detail-apply"><span className="ss-eyebrow">APPLICATION SNAPSHOT</span><h3>{archived?'This round has closed.':'Ready to explore?'}</h3><p>{archived?'Keep this listing for reference and check the official source for future rounds.':'Check the official program for the current application instructions and terms.'}</p><div className="ss-detail-stat"><CalendarDays size={18}/><span>Application status</span><strong>{archived?'Closed / archived':asText(f['Application Status'])||'Check source'}</strong></div><div className="ss-detail-stat"><Globe2 size={18}/><span>Geography</span><strong>{geo.join(', ')||'Check source'}</strong></div>{f.Deadline&&<div className="ss-detail-stat"><CalendarDays size={18}/><span>Recorded deadline</span><strong>{asText(f.Deadline)}</strong></div>}
      {official&&<a className="ss-button ss-button-red" href={official} target="_blank" rel="noopener noreferrer">View official program <ExternalLink size={16}/></a>}<button className="ss-button ss-button-outline" onClick={()=>setDraft(v=>!v)}>{draft?'Close proposal builder':'Prepare a proposal draft'} <ArrowUpRight size={16}/></button><small><CheckCircle2 size={14}/> No application is submitted on this preview.</small>
    </div><div className="ss-detail-sidequote"><Sparkles size={21}/><blockquote>“The right partnership can turn a technical ambition into a real-world achievement.”</blockquote><span>THE SPONSIERRA MISSION</span></div></aside>
    </div>
    <div className="ss-detail-end"><span>KEEP EXPLORING</span><h2>Your next opportunity is out there.</h2><Link href="/sponsors">Explore more sponsorships <ArrowRight size={18}/></Link></div>
  </div>;
}
