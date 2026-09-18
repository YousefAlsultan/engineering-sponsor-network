"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { datasource, q, useRecords, useRecordCreate } from "@/lib/datasource";
import { useTextSetting, useImageSetting } from "@/lib/editable-settings";
import { StudentCompanyStory } from "@/components/student-company-story";
import { Search, Rocket, ShieldCheck, ArrowUpRight, X, ChevronRight, Factory, Cpu, Code2, Layers3, Banknote, Gift, Wrench, PlaneTakeoff, Globe2, CalendarDays, Mail, CheckCircle2, Send, ChevronLeft, Info, PackageOpen, SlidersHorizontal, Sparkles, Building2, Users, CircleCheck, ExternalLink, Eye, Check, Image as ImageIcon, CarFront, Bot, Satellite } from "lucide-react";

const ds = datasource.define({ sponsors: "opportunities", applications: "applications" });

const sponsorFields = q.select({
  company: "Company Name",
  website: "Company Website",
  logo: "Company Logo / Thumbnail URL",
  program: "Sponsorship Program Name",
  types: "Sponsorship Type",
  teams: "Engineering Team Types",
  industry: "Company Industry",
  provides: "What They Provide",
  value: "Estimated Sponsorship Value",
  geography: "Geographic Eligibility",
  status: "Application Status",
  deadline: "Deadline",
  eligibility: "Eligibility / Requirements",
  expectations: "What the Sponsor May Expect",
  official: "Official Sponsorship URL",
  hasContactRoute: "Has Contact Route",
  alternative: "Alternative Contact URL",
  summary: "Public Summary",
  lastChecked: "Last Checked",
  lastVerified: "Last Verified",
  directoryStatus: "Directory Status",
  claimStatus: "Company Claim Status",
  sourceType: "Source Type",
  relationship: "Platform Relationship",
  verificationStatus: "Verification Status",
  publishOnWebsite: "Publish on Website",
  slug: "Slug",
});

const applicationFields = q.select({
  application: "Application",
  sponsorCompany: "Sponsor Company",
  sponsorshipProgram: "Sponsorship Program",
  university: "University",
  teamName: "Engineering Team Name",
  teamType: "Engineering Team Type",
  applicantName: "Applicant Name",
  applicantRole: "Applicant Role",
  applicantEmail: "Applicant Email",
  teamWebsite: "Team Website",
  teamSocial: "Team Social / Project URL",
  teamSize: "Number of Team Members",
  competition: "Competition / Project",
  sponsorshipTypes: "Sponsorship Type Requested",
  requestedValue: "Amount / Value Requested",
  requestedSupport: "Requested Support",
  whyFit: "Why This Sponsor Is a Good Fit",
  projectDescription: "Team / Project Description",
  sponsorOffer: "What the Team Can Offer Sponsor",
  needBy: "Need-By Date",
  deckUrl: "Sponsorship Deck URL",
  notes: "Additional Notes",
  applicationStatus: "Application Status",
  submittedDate: "Submitted Date",
  recipientEmail: "Recipient Email",
  deliveryStatus: "Email Delivery Status",
});

const SUPPORT = [
  ["Cash Sponsorship", Banknote], ["Complimentary Products", Gift], ["Manufacturing", Factory],
  ["Materials", Layers3], ["Electronics", Cpu], ["Software", Code2],
  ["Technical Services", Wrench], ["Travel Support", PlaneTakeoff],
];

const TEAM_CHOICES = ["Formula SAE","Baja SAE","Formula Student","Rocketry","Robotics","CubeSat / Satellite","UAV / Drone","Solar Car","Autonomous Vehicle","Concrete Canoe","Steel Bridge","Chem-E-Car","Human Powered Vehicle","Aerospace","Mechanical Engineering","Electrical / Electronics","Other Engineering Team"];
const SUPPORT_CHOICES = ["Cash Sponsorship","Complimentary Products","Components","Manufacturing","Materials","Electronics","Software","Technical Services","Travel Support","Event / Competition Support","Discount","Other In-Kind Support"];
const CARD_THEMES = [
  "from-[#dff3ff] via-[#edf8ff] to-[#c9e7ff]",
  "from-[#f4e8ff] via-[#faf4ff] to-[#e5d3ff]",
  "from-[#e5f8ef] via-[#f1fcf6] to-[#d2f0e1]",
  "from-[#fff0dd] via-[#fff7ec] to-[#ffe0b8]",
  "from-[#ffe6ed] via-[#fff1f5] to-[#ffd1dc]",
  "from-[#e8ebff] via-[#f3f4ff] to-[#d5dcff]",
  "from-[#edf0f3] via-[#fafafa] to-[#dde3e8]",
  "from-[#e4fbf8] via-[#f0fffd] to-[#c8f2ec]",
  "from-[#fff8d8] via-[#fffbea] to-[#ffefae]",
];

function label(v:any): string {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (Array.isArray(v)) return v.map(label).filter(Boolean).join(", ");
  return v.label || v.name || v.value || "";
}
function labels(v:any): string[] {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map(label).filter(Boolean);
  const s = label(v); return s ? [s] : [];
}
function safeUrl(v:any){ const s=label(v); return !s?"":/^https?:\/\//i.test(s)?s:`https://${s}`; }
function favicon(url:string){ return url ? `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(url)}` : ""; }
function fmtDate(v:any, fallback="Not published"){ if(!v) return fallback; const raw=typeof v==="string"?v:(v.start||v.date||v.value); if(!raw)return fallback; const d=new Date(raw); return Number.isNaN(d.getTime())?String(raw):d.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}); }
function initials(name:string){ return name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase() || "ES"; }

export default function Block(){
  const brand = useTextSetting({name:"brand",label:"Brand",initialValue:"Engineering Sponsor Network"});
  const headline = useTextSetting({name:"headline",label:"Headline",initialValue:"Connect your STEM team with industry support."});
  const subheadline = useTextSetting({name:"subheadline",label:"Subheadline",initialValue:"Discover companies that support university engineering teams with funding, products, manufacturing, materials, electronics, software, technical services, and more."});
  const engineerImage = useImageSetting({name:"engineerImage",label:"Engineer hero image",initialValue:{src:"https://images.pexels.com/photos/9242832/pexels-photo-9242832.jpeg?auto=compress&cs=tinysrgb&w=1600",alt:"Young engineers working together on a robotics project in a workshop"}});
  const circuitImage = useImageSetting({name:"circuitImage",label:"Electronics image",initialValue:{src:"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=86",alt:"Electronic circuit board"}});
  const teamImage = useImageSetting({name:"teamImage",label:"Engineering team image",initialValue:{src:"https://live.staticflickr.com/65535/53435315623_af6cf8e5c7_o.jpg",alt:"A Formula Student engineering project on display"}});

  const {data,status,error,hasNextPage,fetchNextPage,isFetchingNextPage} = useRecords({from:ds.sponsors,select:sponsorFields,count:100});
  const sponsorRecords = data?.pages.flatMap(p=>p.items) ?? [];
  const sponsors = sponsorRecords.filter((r:any)=>{
    const f=r.fields;
    const verified=label(f.verificationStatus)==="Verified Sponsor";
    const rawPublished=f.publishOnWebsite;
    const published=rawPublished===true || ["true","__yes__","1"].includes(String(rawPublished?.value ?? rawPublished ?? "").toLowerCase());
    return verified && published;
  });
  const [query,setQuery]=useState("");
  const [team,setTeam]=useState("All teams");
  const [type,setType]=useState("All sponsorships");
  const [industry,setIndustry]=useState("All industries");
  const [dateView,setDateView]=useState("Current");
  const [region,setRegion]=useState("U.S. eligible");
  const [applicationStatus,setApplicationStatus]=useState("All statuses");
  const [selected,setSelected]=useState<any>(null);
  const [applying,setApplying]=useState<any>(null);

  const partnerSponsors=sponsors.filter((r:any)=>label(r.fields.relationship)==="Partner");
  const teamOptions=useMemo(()=>Array.from(new Set(sponsors.flatMap((r:any)=>labels(r.fields.teams)))).sort(),[sponsors]);
  const typeOptions=useMemo(()=>Array.from(new Set(sponsors.flatMap((r:any)=>labels(r.fields.types)))).sort(),[sponsors]);
  const industryOptions=useMemo(()=>Array.from(new Set(sponsors.flatMap((r:any)=>labels(r.fields.industry)).filter(Boolean))).sort(),[sponsors]);
  const filtered=useMemo(()=>{
    const n=query.trim().toLowerCase();
    return sponsors.filter((r:any)=>{
      const f=r.fields; const t=labels(f.teams); const s=labels(f.types); const ind=label(f.industry); const geo=labels(f.geography); const ds=label(f.directoryStatus);
      const hay=[label(f.company),label(f.program),label(f.provides),label(f.summary),...t,...s,ind,label(f.sourceType)].join(" ").toLowerCase();
      const tm=team==="All teams" || t.includes("All Engineering Teams") || t.includes(team);
      const sm=type==="All sponsorships" || s.includes(type);
      const im=industry==="All industries" || labels(f.industry).includes(industry);
      const usEligible=geo.some((g:string)=>["United States","North America","Global"].includes(g));
      const deadlineRaw=typeof f.deadline==="string"?f.deadline:(f.deadline?.start||f.deadline?.date||f.deadline?.value);
      const expired=["Recently Expired","Expired Archive"].includes(ds)||label(f.status)==="Closed"|| (!!deadlineRaw && new Date(deadlineRaw).getTime()<new Date(new Date().toISOString().slice(0,10)).getTime());
      const dm=dateView==="All" || (dateView==="Expired" ? expired : !expired);
      const gm=region==="All regions" || (region==="U.S. eligible"?usEligible:geo.length===0||geo.includes("Unknown"));
      const am=applicationStatus==="All statuses"||label(f.status)===applicationStatus;
      return (!n || hay.includes(n)) && tm && sm && im && gm && dm && am;
    });
  },[sponsors,query,team,type,industry,dateView,region,applicationStatus]);

  const scrollDirectory=()=>document.getElementById("directory")?.scrollIntoView({behavior:"smooth",block:"start"});
  const clearFilters=()=>{setQuery("");setTeam("All teams");setType("All sponsorships");setIndustry("All industries");setDateView("Current");setRegion("U.S. eligible");setApplicationStatus("All statuses")};

  return <div className="min-h-screen bg-[#f5f5f7] text-[#111] selection:bg-blue-200">
    <style>{`
      html{scroll-behavior:smooth}
      .eng-grid{background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:36px 36px}
      .micro-grid{background-image:linear-gradient(rgba(15,23,42,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,.04) 1px,transparent 1px);background-size:28px 28px}
      .field{width:100%;min-height:50px;border-radius:16px;background:#f5f5f7;padding:12px 14px;font-size:13px;outline:none;border:1px solid transparent;transition:.18s}
      .field:focus{background:white;border-color:rgba(0,113,227,.35);box-shadow:0 0 0 4px rgba(0,113,227,.08)}
      .field::placeholder{color:rgba(0,0,0,.28)}
      .no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{scrollbar-width:none}
    `}</style>

    <nav className="sticky top-0 z-40 border-b border-black/[.055] bg-white/75 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-7 lg:px-8">
        <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-[12px] bg-black text-white shadow-lg"><span className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(60,150,255,.8),transparent_48%)]"/><Rocket className="relative h-4 w-4"/></span>
          <span className="text-sm font-semibold tracking-[-.025em]">{brand}</span>
        </button>
        <div className="hidden items-center gap-7 text-xs font-medium text-black/58 md:flex">
          <a href="#how" className="transition hover:text-black">How It Works</a>
          <button onClick={scrollDirectory} className="group inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#0071e3]">Explore Sponsors <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></button>
        </div>
      </div>
    </nav>

    <header className="relative overflow-hidden bg-[#05070b] text-white">
      <div className="eng-grid absolute inset-0 opacity-70"/><div className="absolute left-1/2 top-[-18rem] h-[44rem] w-[44rem] -translate-x-1/2 rounded-full bg-blue-600/22 blur-3xl"/><div className="absolute -right-32 bottom-[-12rem] h-[32rem] w-[32rem] rounded-full bg-violet-500/14 blur-3xl"/>
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-7 sm:py-16 lg:grid-cols-[1.03fr_.97fr] lg:px-8 lg:py-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.07] px-3 py-1.5 text-[11px] text-white/72 backdrop-blur-xl"><ShieldCheck className="h-3.5 w-3.5 text-blue-300"/> Built only for university engineering teams</div>
          <h1 className="mt-6 max-w-3xl text-[52px] font-semibold leading-[.95] tracking-[-.06em] sm:text-[72px] lg:text-[82px]">{headline}</h1>
          <p className="mt-7 max-w-2xl text-[18px] leading-8 text-white/58">{subheadline}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button onClick={scrollDirectory} className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black shadow-[0_15px_45px_rgba(255,255,255,.12)] transition hover:-translate-y-0.5 hover:bg-[#f7fbff]">Explore Directory <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5"/></button>
            <a href="#how" className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[.065] px-6 py-3.5 text-sm font-medium text-white/88 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/[.11]">See how it works <Eye className="h-4 w-4"/></a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[11px] text-white/45"><span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-400"/> Sources checked against sponsor programs</span><span className="inline-flex items-center gap-1.5"><SlidersHorizontal className="h-4 w-4 text-blue-300"/> Engineering-specific filters</span><span className="inline-flex items-center gap-1.5"><Send className="h-4 w-4 text-violet-300"/> Structured request preview for confirmed routes</span></div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="mb-3 flex justify-end"><div className="inline-flex items-baseline gap-2 rounded-full border border-white/12 bg-white/[.08] px-4 py-2 text-white backdrop-blur"><span className="text-lg font-semibold">{sponsors.length}</span><span className="text-[11px] font-medium text-white/58">sponsor programs</span></div></div>
          <div className="grid grid-cols-[1.15fr_.85fr] gap-3">
            <div className="relative row-span-2 min-h-[430px] overflow-hidden rounded-[34px] border border-white/10 shadow-[0_35px_100px_rgba(0,0,0,.5)]"><img src={engineerImage.src} alt={engineerImage.alt} className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"/><div className="absolute bottom-0 left-0 right-0 p-6"><p className="text-[11px] font-semibold uppercase tracking-[.15em] text-blue-200">ENGINEERING TEAMS</p><p className="mt-2 max-w-sm text-xl font-semibold leading-6">Build the car, rocket, robot, satellite — not another spreadsheet of sponsor links.</p></div></div>
            <div className="relative min-h-[208px] overflow-hidden rounded-[28px] border border-white/10"><img src={circuitImage.src} alt={circuitImage.alt} className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"/><div className="absolute bottom-4 left-4 right-4 text-sm font-semibold">Components + electronics</div></div>
            <div className="relative min-h-[208px] overflow-hidden rounded-[28px] border border-white/10"><img src={teamImage.src} alt={teamImage.alt} className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/><div className="absolute bottom-4 left-4 right-4 text-sm font-semibold">Teams + companies</div></div>
          </div>
        </div>
      </div>
    </header>

    <section className="border-b border-black/[.05] bg-white py-5"><div className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 sm:px-7 lg:px-8">{SUPPORT.map(([name,Icon]:any)=><button key={name} onClick={()=>{setType(name);setTimeout(scrollDirectory,50)}} className={`group flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition-all ${type===name?"bg-black text-white shadow-lg":"bg-[#f5f5f7] text-black/62 hover:-translate-y-0.5 hover:bg-black hover:text-white"}`}><Icon className="h-3.5 w-3.5"/>{name}</button>)}</div></section>

    <section className="micro-grid bg-[#f5f5f7]"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-7 lg:px-8"><div className="grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]"><div><p className="text-sm font-semibold text-[#0071e3]">Built around real engineering work</p><h2 className="mt-3 text-4xl font-semibold leading-[1.02] tracking-[-.05em] sm:text-5xl">Funding is one input.<br/>So are parts, machining, software and expertise.</h2><p className="mt-5 max-w-lg text-[15px] leading-7 text-black/50">The directory is designed around what technical teams actually need to build and compete.</p></div><div className="grid gap-3 sm:grid-cols-2">{SUPPORT.slice(0,6).map(([name,Icon]:any,i)=><button key={name} onClick={()=>{setType(name);setTimeout(scrollDirectory,50)}} className={`group rounded-[26px] border border-black/[.055] p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${i===0?"bg-black text-white":i===1?"bg-[#e9f4ff]":i===2?"bg-[#f2eaff]":"bg-white"}`}><div className="flex items-start justify-between"><span className={`grid h-10 w-10 place-items-center rounded-full ${i===0?"bg-white text-black":"bg-black text-white"}`}><Icon className="h-4 w-4"/></span><ArrowUpRight className="h-4 w-4 opacity-30 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"/></div><p className="mt-6 text-[16px] font-semibold">{name}</p></button>)}</div></div></div></section>

    <main id="directory" className="scroll-mt-16 bg-[#f5f5f7]">
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-7 lg:px-8">
        <div className="mb-9 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="text-sm font-semibold text-[#0071e3]">Sponsor discovery</p><h2 className="mt-2 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">Find companies ready to help.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-black/48">Showing confirmed U.S.-eligible programs by default. Choose All regions to explore the full directory; unknown regions need confirmation with the sponsor.</p></div><div title="Source checked: an official or credible source confirms this company offers the listed engineering-team sponsorship/support program." className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-700"><ShieldCheck className="h-4 w-4"/></div></div>

        <div className="mb-8 overflow-hidden rounded-[32px] border border-black/[.055] bg-[#0a0d12] p-5 text-white shadow-[0_22px_70px_rgba(0,0,0,.13)] sm:p-6">
          <div className="eng-grid absolute pointer-events-none"/>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.12em] text-blue-200"><Building2 className="h-3.5 w-3.5"/> Partner companies</div><h3 className="mt-3 text-2xl font-semibold tracking-[-.035em]">Companies working directly with the platform.</h3><p className="mt-2 max-w-2xl text-xs leading-5 text-white/55">This section is reserved for formal platform partners. Source-checked or company-confirmed listings are not automatically treated as partners.</p></div><span className="text-[11px] text-white/35">Prioritized placement</span></div>
          {partnerSponsors.length>0?<div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{partnerSponsors.map((r:any,i:number)=><SponsorCard key={`partner-${r.id}`} index={i} record={r} partner onOpen={()=>setSelected(r)}/>)}</div>:<div className="mt-6 rounded-[24px] border border-white/10 bg-white/[.055] p-5 text-sm text-white/55"><Sparkles className="mr-2 inline h-4 w-4 text-blue-300"/>No formal partner companies are marked yet. When a real partnership is established, that company can be added here without changing the directory design.</div>}
        </div>

        <GuidedMatch query={query} setQuery={setQuery} team={team} setTeam={setTeam} type={type} setType={setType} industry={industry} setIndustry={setIndustry} dateView={dateView} setDateView={setDateView} region={region} setRegion={setRegion} applicationStatus={applicationStatus} setApplicationStatus={setApplicationStatus} industryOptions={industryOptions} resultCount={filtered.length} onClear={clearFilters}/>

        <div className="mb-6 grid gap-3 rounded-[24px] border border-black/[.05] bg-white p-4 text-[11px] text-black/52 shadow-sm sm:grid-cols-3"><div className="flex items-start gap-2"><span title="Source checked" className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700"><ShieldCheck className="h-3.5 w-3.5"/></span><span><strong className="block text-black/75">Source checked</strong>Public evidence confirms the listed sponsor program.</span></div><div className="flex items-start gap-2"><span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-50 text-[#0071e3]"><Building2 className="h-3.5 w-3.5"/></span><span><strong className="block text-black/75">Company confirmed</strong>The company has claimed and passed platform review.</span></div><div className="flex items-start gap-2"><span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-50 text-amber-700"><CalendarDays className="h-3.5 w-3.5"/></span><span><strong className="block text-black/75">Expired</strong>Closed programs remain searchable in the Expired filter.</span></div></div>
        <div className="mb-5 flex items-center justify-between"><span className="text-sm font-medium text-black/50">{filtered.length} {filtered.length===1?"sponsor":"sponsors"}</span><span className="hidden text-[11px] text-black/32 sm:inline">Select a card to view the full program</span></div>
        {status==="error"?<div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-center"><Info className="mx-auto h-7 w-7 text-red-500"/><h3 className="mt-3 font-semibold text-red-900">The sponsor database could not load.</h3><p className="mt-2 text-sm text-red-700">{String(error?.message||"Please refresh the page.")}</p></div>:status==="pending"?<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map(i=><div key={i} className="h-[520px] animate-pulse rounded-[30px] bg-white"/>)}</div>:filtered.length===0?<div className="rounded-[30px] bg-white p-16 text-center shadow-sm"><Search className="mx-auto h-8 w-8 text-black/20"/><h3 className="mt-4 text-xl font-semibold">No sponsor matches yet.</h3><p className="mt-2 text-sm text-black/45">Try a broader search or clear one of your filters.</p></div>:<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((r:any,i:number)=><SponsorCard key={r.id} index={i} record={r} onOpen={()=>setSelected(r)}/>)}</div>}
        {hasNextPage&&<div className="mt-10 text-center"><button onClick={()=>fetchNextPage()} disabled={isFetchingNextPage} className="group inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#0071e3] disabled:opacity-50">{isFetchingNextPage?"Loading...":"Load more sponsors"}<ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5"/></button></div>}
      </section>
    </main>

    <StudentCompanyStory onExplore={scrollDirectory} />

    <section className="overflow-hidden bg-[#0a0d12] text-white"><div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 sm:px-7 lg:grid-cols-2 lg:px-8 lg:py-24"><div className="relative min-h-[360px] overflow-hidden rounded-[34px]"><img src="https://images.pexels.com/photos/19895721/pexels-photo-19895721.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="Students collaborating around laptops and tools in an engineering workshop" className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"/><div className="absolute bottom-0 p-6"><p className="text-xs font-semibold text-blue-200">THE TEAM SIDE</p><p className="mt-2 text-2xl font-semibold">One application flow, built for technical teams.</p></div></div><div><p className="text-sm font-semibold text-blue-300">From discovery to request</p><h2 className="mt-3 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">Less hunting.<br/>More engineering.</h2><p className="mt-5 max-w-lg text-sm leading-7 text-white/52">Open a sponsor profile, understand the fit, then submit a structured request without leaving the platform.</p><button onClick={scrollDirectory} className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5"><Building2 className="h-4 w-4"/> Browse sponsor companies <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5"/></button></div></div></section>

    <section id="how" className="bg-white"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-7 lg:px-8"><p className="text-sm font-semibold text-[#0071e3]">How it works</p><h2 className="mt-2 text-4xl font-semibold tracking-[-.05em]">Three steps from need to request.</h2><div className="mt-10 grid gap-4 md:grid-cols-3">{[["01","Tell us what your team needs.",SlidersHorizontal],["02","Discover relevant companies.",Building2],["03","Prepare a structured request.",Send]].map(([n,t,Icon]:any,i)=><div key={n} className={`group rounded-[28px] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${i===0?"bg-[#eaf4ff]":i===1?"bg-[#f2ecff]":"bg-[#eaf8f1]"}`}><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-black text-white"><Icon className="h-4.5 w-4.5"/></span><span className="font-mono text-xs text-black/25">{n}</span></div><h3 className="mt-8 text-lg font-semibold">{t}</h3></div>)}</div></div></section>

    <footer className="border-t border-black/[.06] bg-[#f5f5f7]"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs text-black/42 sm:flex-row sm:justify-between sm:px-7 lg:px-8"><strong className="text-black/70">{brand}</strong><span>Independent prototype. Listings are based on public company sources and do not imply partnership or endorsement.</span></div></footer>

    {selected&&<SponsorModal record={selected} onClose={()=>setSelected(null)} onApply={()=>{const s=selected;setSelected(null);setApplying(s)}}/>}
    {applying&&<ApplicationModal sponsor={applying} onClose={()=>setApplying(null)}/>} 
  </div>
}

function FilterStrip({labelText,value,allLabel,options,onChange}:{labelText:string;value:string;allLabel:string;options:string[];onChange:(v:string)=>void}){
  const list=[allLabel,...options.filter(x=>x!==allLabel)];
  return <div className="grid gap-2 lg:grid-cols-[84px_1fr] lg:items-center"><div className="text-[10px] font-semibold uppercase tracking-[.13em] text-black/30">{labelText}</div><div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">{list.map(x=><button key={x} onClick={()=>onChange(x)} className={`shrink-0 rounded-full px-3.5 py-2 text-[11px] font-semibold transition-all ${value===x?"bg-black text-white shadow-md":"bg-[#f5f5f7] text-black/52 hover:bg-[#e9e9ec] hover:text-black"}`}>{x}</button>)}</div></div>
}

function SponsorLogo({name,website,logo}:{name:string;website:any;logo:any}){
  const [failed,setFailed]=useState(false); const src=safeUrl(logo)||favicon(safeUrl(website));
  return <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-[19px] bg-white shadow-xl ring-1 ring-black/[.06]">{src&&!failed?<img src={src} onError={()=>setFailed(true)} className="h-[60%] w-[60%] object-contain" alt={`${name} logo`}/>:<span className="font-bold text-black/65">{initials(name)}</span>}</div>
}
function SponsorCard({record,onOpen,index,partner=false}:{record:any;onOpen:()=>void;index:number;partner?:boolean}){
  const f=record.fields,name=label(f.company)||"Sponsor",types=labels(f.types),teams=labels(f.teams),theme=CARD_THEMES[index%CARD_THEMES.length];
  return <article onClick={onOpen} className={`group relative flex h-[560px] cursor-pointer flex-col overflow-hidden rounded-[30px] bg-gradient-to-br ${theme} shadow-[0_5px_24px_rgba(0,0,0,.08)] ring-1 ring-black/[.07] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.012] hover:shadow-[0_26px_75px_rgba(0,0,0,.17)] hover:ring-black/[.14]`}>
    <div className="micro-grid pointer-events-none absolute inset-0 opacity-75"/><div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/65 blur-3xl transition-transform duration-500 group-hover:scale-125"/>
    <div className="relative h-[148px] shrink-0 border-b border-black/[.055] p-5"><div className="absolute left-5 top-5"><SponsorLogo name={name} website={f.website} logo={f.logo}/></div><div className="absolute right-4 top-4 flex max-w-[52%] flex-col items-end gap-2">{partner&&<span className="rounded-full bg-black px-3 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-white shadow-lg">Partner</span>}<span className="max-w-full truncate rounded-full border border-black/[.05] bg-white/65 px-3 py-1 text-[10px] font-semibold text-black/60 shadow-sm backdrop-blur">{label(f.industry)||"Engineering"}</span></div><div className="absolute bottom-4 left-5 right-5 flex h-[29px] items-start gap-1.5 overflow-hidden">{types.slice(0,3).map(t=><span key={t} className="shrink-0 rounded-full border border-black/[.06] bg-white/68 px-2.5 py-1 text-[10px] font-semibold text-black/68 backdrop-blur">{t}</span>)}</div><div className="absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/[.04] group-hover:opacity-100"><span className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[11px] font-semibold text-white shadow-xl"><Eye className="h-3.5 w-3.5"/> Preview sponsorship</span></div></div>
    <div className="relative grid min-h-0 flex-1 grid-rows-[68px_44px_38px_50px_42px_48px] gap-3 bg-white/28 p-5 backdrop-blur-[2px] sm:p-6">
      <div className="flex min-h-0 items-start justify-between gap-4 overflow-hidden"><div className="min-w-0"><h3 className="flex items-start gap-1.5 line-clamp-2 text-[19px] font-semibold leading-6 tracking-[-.025em] text-[#101114] transition-colors group-hover:text-[#0071e3]"><span>{name}</span><span title="Source checked: public evidence confirms this sponsor program." className="mt-0.5 shrink-0 text-emerald-700"><ShieldCheck className="h-4 w-4"/></span>{label(f.claimStatus)==="Company Verified"&&<span title="Company confirmed by the platform" className="mt-0.5 shrink-0 text-[#0071e3]"><Building2 className="h-4 w-4"/></span>}</h3><p className="mt-1 line-clamp-1 text-xs font-medium text-black/48">{label(f.program)||"Engineering team sponsorship"}</p></div><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-black/[.05] bg-white/65 text-black/50 shadow-sm transition-all group-hover:rotate-[-5deg] group-hover:bg-[#0071e3] group-hover:text-white"><ArrowUpRight className="h-4 w-4"/></span></div>
      <p className="line-clamp-2 overflow-hidden text-sm leading-[22px] text-black/62">{label(f.provides)||label(f.summary)||"View the sponsor profile for support details."}</p>
      <div className="flex min-w-0 items-start overflow-hidden">{label(f.value)?<div className="inline-flex max-w-full items-center gap-1.5 truncate rounded-xl border border-emerald-900/5 bg-white/55 px-3 py-2 text-[11px] font-semibold text-emerald-900"><PackageOpen className="h-3.5 w-3.5 shrink-0"/><span className="truncate">{label(f.value)}</span></div>:<span className="text-[11px] text-black/30">Support value varies by program</span>}</div>
      <div className="flex flex-wrap content-start gap-1.5 overflow-hidden">{teams.slice(0,3).map(t=><span key={t} className="rounded-full border border-black/[.045] bg-white/55 px-2.5 py-1 text-[10px] text-black/60">{t}</span>)}{teams.length>3&&<span className="rounded-full border border-black/[.045] bg-white/55 px-2.5 py-1 text-[10px] text-black/48">+{teams.length-3}</span>}</div>
      <div className="flex min-w-0 items-center justify-between gap-3 border-t border-black/[.07] pt-2 text-[11px] text-black/48"><span className="inline-flex min-w-0 items-center gap-1"><Globe2 className="h-3.5 w-3.5 shrink-0"/><span className="truncate">{labels(f.geography)[0]||"Eligibility varies"}</span></span><span className="inline-flex shrink-0 items-center gap-1"><CalendarDays className="h-3.5 w-3.5"/>{fmtDate(f.deadline)}</span></div>
      <button aria-label={`View sponsorship from ${name}`} className="group/btn flex h-[48px] w-full items-center justify-center gap-2 self-end rounded-[16px] bg-black px-4 text-xs font-semibold text-white shadow-lg transition-all hover:bg-[#0071e3] active:scale-[.985]">View Sponsorship <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5"/></button>
    </div>
  </article>
}
function Overlay({children,onClose}:{children:React.ReactNode;onClose:()=>void}){
  return <Dialog open onOpenChange={open=>{if(!open)onClose()}}><DialogContent showClose={false} overlayClassName="bg-black/58 backdrop-blur-md" className="max-h-[94vh] w-[calc(100%-24px)] max-w-3xl overflow-y-auto rounded-[32px] border-0 bg-white p-0 shadow-[0_40px_120px_rgba(0,0,0,.38)]"><DialogTitle className="sr-only">Sponsor information</DialogTitle>{children}</DialogContent></Dialog>;
}

function GuidedMatch({query,setQuery,team,setTeam,type,setType,industry,setIndustry,dateView,setDateView,region,setRegion,applicationStatus,setApplicationStatus,industryOptions,resultCount,onClear}:any){
  const [step,setStep]=useState(1); const [advanced,setAdvanced]=useState(false);
  const teams=[["Formula SAE",CarFront,"Race car"],["Robotics",Bot,"Robot"],["Rocketry",Rocket,"Rocket"],["CubeSat / Satellite",Satellite,"Satellite"],["All teams",Users,"Any project"]] as const;
  const supports=[["All sponsorships",Sparkles],...SUPPORT.slice(0,7)] as any[];
  const chooseTeam=(value:string)=>{setTeam(value);setStep(2)};
  const chooseSupport=(value:string)=>{setType(value);setStep(3)};
  const chooseRegion=(value:string)=>{setRegion(value);setStep(4)};
  const reset=()=>{onClear();setStep(1);setAdvanced(false)};
  return <div className="mb-8 overflow-hidden rounded-[32px] border border-black/[.055] bg-white shadow-[0_18px_60px_rgba(0,0,0,.07)]">
    <div className="relative overflow-hidden bg-[#09111e] p-5 text-white sm:p-7"><div className="eng-grid absolute inset-0 opacity-35"/><div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl"/><div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.12em] text-blue-200"><Sparkles className="h-3.5 w-3.5"/> Guided sponsor match</div><h3 className="mt-3 text-2xl font-semibold tracking-[-.035em] sm:text-3xl">Build your sponsor match.</h3><p className="mt-2 max-w-xl text-xs leading-5 text-white/52">Answer three quick questions and the directory narrows as you go.</p></div><div className="min-w-[170px]"><div className="flex gap-1.5">{[1,2,3].map(n=><span key={n} className={`h-1.5 flex-1 rounded-full transition ${n<step?"bg-blue-400":n===step?"bg-white":"bg-white/15"}`}/>)}</div><div className="mt-2 text-right text-[10px] font-medium uppercase tracking-[.12em] text-white/38">{step<4?`Question ${step} of 3`:"Match ready"}</div></div></div></div>
    <div className="p-4 sm:p-6">
      <label className="flex min-h-14 items-center rounded-[20px] bg-[#f5f5f7] px-4 transition focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10"><Search className="mr-3 h-4 w-4 text-black/32"/><input aria-label="Search sponsors" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Or search by company, program, or support..." className="w-full bg-transparent text-sm outline-none placeholder:text-black/30"/>{query&&<button onClick={()=>setQuery("")} aria-label="Clear search" className="grid h-8 w-8 place-items-center rounded-full bg-white text-black/45 shadow-sm transition hover:bg-black hover:text-white"><X className="h-4 w-4"/></button>}</label>
      <div className="mt-5 min-h-[150px]">
        {step===1&&<div><div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.13em] text-[#0071e3]">Start with your project</p><h4 className="mt-1 text-xl font-semibold tracking-[-.03em]">What are you building?</h4></div><span className="text-xs text-black/35">Choose one</span></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">{teams.map(([value,Icon,labelText])=><button key={value} onClick={()=>chooseTeam(value)} className={`group rounded-[18px] p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${team===value?"bg-black text-white":"bg-[#f5f5f7] text-black/68"}`}><Icon className="h-5 w-5"/><span className="mt-5 block text-sm font-semibold">{labelText}</span></button>)}</div></div>}
        {step===2&&<div><div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.13em] text-[#0071e3]">Your project · {team}</p><h4 className="mt-1 text-xl font-semibold tracking-[-.03em]">What support do you need?</h4></div><button onClick={()=>setStep(1)} className="text-xs font-semibold text-black/42 hover:text-black">Back</button></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{supports.map(([value,Icon]:any)=><button key={value} onClick={()=>chooseSupport(value)} className={`group rounded-[18px] p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${type===value?"bg-[#0071e3] text-white":"bg-[#f5f5f7] text-black/68"}`}><Icon className="h-5 w-5"/><span className="mt-5 block text-sm font-semibold">{value}</span></button>)}</div></div>}
        {step===3&&<div><div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.13em] text-[#0071e3]">{team} · {type}</p><h4 className="mt-1 text-xl font-semibold tracking-[-.03em]">Where can your team apply?</h4></div><button onClick={()=>setStep(2)} className="text-xs font-semibold text-black/42 hover:text-black">Back</button></div><div className="mt-4 grid gap-2 sm:grid-cols-3">{[["U.S. eligible","Confirmed for U.S. teams"],["All regions","Show the full directory"],["Eligibility unknown","Programs to confirm directly"]].map(([value,description])=><button key={value} onClick={()=>chooseRegion(value)} className={`rounded-[18px] p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${region===value?"bg-black text-white":"bg-[#f5f5f7] text-black/68"}`}><Globe2 className="h-5 w-5"/><span className="mt-5 block text-sm font-semibold">{value}</span><span className={`mt-1 block text-[11px] ${region===value?"text-white/48":"text-black/38"}`}>{description}</span></button>)}</div></div>}
        {step===4&&<div className="rounded-[24px] bg-[#eef6ff] p-5 sm:flex sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 text-sm font-semibold text-[#0069d2]"><CircleCheck className="h-5 w-5"/> Your sponsor match is ready</div><div className="mt-3 flex flex-wrap gap-2">{[team,type,region].map(value=><span key={value} className="rounded-full bg-white px-3 py-2 text-[11px] font-semibold text-black/62 shadow-sm">{value}</span>)}</div></div><div className="mt-5 text-left sm:mt-0 sm:text-right"><div className="text-3xl font-semibold tracking-[-.04em]">{resultCount}</div><div className="text-xs text-black/42">matching sponsors</div><button onClick={()=>setStep(1)} className="mt-3 text-xs font-semibold text-[#0071e3] hover:underline">Adjust answers</button></div></div>}
      </div>
      <div className="mt-5 border-t border-black/[.06] pt-4"><div className="flex flex-wrap items-center justify-between gap-3"><button onClick={()=>setAdvanced(v=>!v)} aria-expanded={advanced} className="inline-flex items-center gap-2 rounded-full bg-[#f5f5f7] px-4 py-2.5 text-xs font-semibold text-black/58 transition hover:bg-black hover:text-white"><SlidersHorizontal className="h-3.5 w-3.5"/> Advanced filters <ChevronRight className={`h-3.5 w-3.5 transition ${advanced?"rotate-90":""}`}/></button><button onClick={reset} className="inline-flex items-center gap-1.5 text-xs font-semibold text-black/42 hover:text-black"><X className="h-3.5 w-3.5"/> Reset match</button></div>{advanced&&<div className="mt-4 space-y-3 rounded-[22px] bg-[#f8f8fa] p-4"><FilterStrip labelText="Industry" value={industry} allLabel="All industries" options={industryOptions} onChange={setIndustry}/><FilterStrip labelText="Status" value={applicationStatus} allLabel="All statuses" options={["Open","Ongoing","Seasonal","Closed","Unknown"]} onChange={setApplicationStatus}/><FilterStrip labelText="Dates" value={dateView} allLabel="Current" options={["Expired","All"]} onChange={setDateView}/></div>}</div>
    </div>
  </div>
}
function SponsorModal({record,onClose,onApply}:{record:any;onClose:()=>void;onApply:()=>void}){const f=record.fields,name=label(f.company)||"Sponsor",official=safeUrl(f.official)||safeUrl(f.alternative)||safeUrl(f.website),hasContact=!!f.hasContactRoute;return <Overlay onClose={onClose}><div className="relative overflow-hidden bg-[#080b10] px-7 py-9 text-white"><div className="eng-grid absolute inset-0 opacity-70"/><div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl"/><button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/10 transition hover:bg-white hover:text-black"><X className="h-4 w-4"/></button><div className="relative flex items-center gap-4"><SponsorLogo name={name} website={f.website} logo={f.logo}/><div><div className="flex flex-wrap gap-1.5">{labels(f.types).slice(0,3).map(t=><span key={t} className="rounded-full border border-white/12 bg-white/[.08] px-2.5 py-1 text-[10px]">{t}</span>)}</div><h2 className="mt-2 text-3xl font-semibold tracking-[-.04em]">{name}</h2><p className="mt-1 text-xs text-white/50">{label(f.program)}</p></div></div></div><div className="space-y-7 p-7"><div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-black/35">What they provide</p><p className="mt-2 text-[15px] leading-7 text-black/70">{label(f.provides)||label(f.summary)||"Check the official program for current details."}</p></div><div className="grid gap-3 sm:grid-cols-3"><InfoCard icon={CheckCircle2} k="Application" v={label(f.status)||"Unknown"}/><InfoCard icon={CalendarDays} k="Deadline" v={fmtDate(f.deadline)}/><InfoCard icon={Globe2} k="Region" v={labels(f.geography).join(", ")||"Check program"}/></div><div className="flex flex-wrap items-center gap-3 rounded-2xl border border-black/[.05] bg-white p-4 text-[11px] text-black/50"><span title="Source checked: public evidence confirms this program." className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-600"/> Source checked</span>{label(f.claimStatus)==="Company Verified"&&<span className="inline-flex items-center gap-1.5"><Building2 className="h-4 w-4 text-[#0071e3]"/> Company confirmed</span>}<span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-black/35"/> {f.lastChecked?"Last checked":"Last verified"} {fmtDate(f.lastChecked||f.lastVerified,"Not recorded")}</span></div>{label(f.eligibility)&&<div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-black/35">Eligibility / requirements</p><p className="mt-2 text-sm leading-6 text-black/62">{label(f.eligibility)}</p></div>}{label(f.expectations)&&<div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-black/35">What the sponsor may expect</p><p className="mt-2 text-sm leading-6 text-black/62">{label(f.expectations)}</p></div>}<div className="rounded-2xl bg-[#eef6ff] p-4 text-xs leading-5 text-[#28537f]"><ShieldCheck className="mr-2 inline h-4 w-4"/>Information is based on public company sources and may change. Verify details before entering an agreement.</div><div className="grid gap-2 sm:grid-cols-[1fr_auto]">{hasContact?<button onClick={onApply} className="group inline-flex items-center justify-center gap-2 rounded-[17px] bg-[#0071e3] px-6 py-4 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(0,113,227,.28)] transition hover:-translate-y-0.5 hover:bg-[#0077ed]">Apply for Sponsorship <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5"/></button>:official?<button onClick={()=>window.open(official,"_blank","noopener,noreferrer")} className="group inline-flex items-center justify-center gap-2 rounded-[17px] bg-black px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0071e3]">View Official Program <ExternalLink className="h-4 w-4"/></button>:<div className="rounded-[17px] bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">Application route not available yet</div>}{hasContact&&official&&<button onClick={()=>window.open(official,"_blank","noopener,noreferrer")} className="inline-flex items-center justify-center gap-2 rounded-[17px] bg-[#f5f5f7] px-5 py-4 text-xs font-semibold text-black/60 transition hover:bg-black hover:text-white">Official source <ExternalLink className="h-3.5 w-3.5"/></button>}</div><div className="text-center text-[11px] text-black/35">{hasContact?<><Mail className="mr-1 inline h-3.5 w-3.5"/>Public contact email listed — sponsor acceptance is not guaranteed</>:<><Info className="mr-1 inline h-3.5 w-3.5"/>No confirmed sponsorship contact route — use the official program page</>}</div></div></Overlay>}
function InfoCard({icon:Icon,k,v}:{icon:any;k:string;v:string}){return <div className="rounded-2xl bg-[#f5f5f7] p-4"><div className="flex items-center gap-2 text-[11px] text-black/38"><Icon className="h-4 w-4"/>{k}</div><div className="mt-2 text-sm font-semibold text-black/72">{v}</div></div>}

function ApplicationModal({sponsor,onClose}:{sponsor:any;onClose:()=>void}){
  const f=sponsor.fields,company=label(f.company)||"Sponsor",program=label(f.program),contact=!!f.hasContactRoute;
  const create=useRecordCreate({from:ds.applications,fields:applicationFields});
  const [step,setStep]=useState(1); const [done,setDone]=useState(false); const [savedDestination,setSavedDestination]=useState("the application database"); const [submissionError,setSubmissionError]=useState("");
  const initialSupport=labels(f.types).filter(x=>SUPPORT_CHOICES.includes(x)).slice(0,1);
  const [form,setForm]=useState<any>({university:"",teamName:"",teamType:"",teamSize:"",competition:"",applicantName:"",applicantRole:"",applicantEmail:"",teamWebsite:"",teamSocial:"",sponsorshipTypes:initialSupport,requestedValue:"",requestedSupport:"",needBy:"",projectDescription:"",whyFit:"",sponsorOffer:"",deckUrl:"",notes:""});
  const set=(k:string,v:any)=>setForm((o:any)=>({...o,[k]:v}));
  const toggle=(x:string)=>set("sponsorshipTypes",form.sponsorshipTypes.includes(x)?[]:[x]);
  const valid=step===1?!!(form.university&&form.teamName&&form.teamType):step===2?!!(form.applicantName&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.applicantEmail)):step===3?!!(form.sponsorshipTypes.length&&form.requestedSupport.trim()):step===4?!!(form.projectDescription.trim()&&form.whyFit.trim()&&form.sponsorOffer.trim()):true;
  const submit=async()=>{
    if(!create.enabled||create.status==="pending")return;
    setSubmissionError("");
    try{
      const payload:any={application:`${form.teamName} → ${company}`,sponsorCompany:company,university:form.university,teamName:form.teamName,teamType:form.teamType,applicantName:form.applicantName,applicantEmail:form.applicantEmail,sponsorshipTypes:form.sponsorshipTypes,requestedSupport:form.requestedSupport,whyFit:form.whyFit,projectDescription:form.projectDescription,sponsorOffer:form.sponsorOffer,applicationStatus:"Submitted",submittedDate:new Date().toISOString().slice(0,10),deliveryStatus:"Not Sent"};
      if(program) payload.sponsorshipProgram=program;
      if(form.applicantRole) payload.applicantRole=form.applicantRole;
      if(form.teamWebsite) payload.teamWebsite=form.teamWebsite;
      if(form.teamSocial) payload.teamSocial=form.teamSocial;
      if(form.teamSize) payload.teamSize=Number(form.teamSize);
      if(form.competition) payload.competition=form.competition;
      if(form.requestedValue) payload.requestedValue=form.requestedValue;
      if(form.needBy) payload.needBy=form.needBy;
      if(form.deckUrl) payload.deckUrl=form.deckUrl;
      if(form.notes) payload.notes=form.notes;
      // Recipient addresses must be resolved only on the server.
      const result=await create.mutateAsync(payload);
      setSavedDestination(result.destination==="Notion"?"your Notion Sponsorship Applications database":"the local application file");
      setDone(true);
    }catch(e:any){setSubmissionError(e?.message||"The application could not be saved. Please try again.")}
  };
  if(done)return <Overlay onClose={onClose}><div className="p-10 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Check className="h-7 w-7"/></div><h2 className="mt-6 text-2xl font-semibold tracking-[-.03em]">Application saved successfully.</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/50">Your request for {company} is saved in {savedDestination}. Automatic email delivery is not enabled, so it has not been sent to the sponsor.</p><div className="mx-auto mt-6 max-w-md rounded-[20px] bg-[#f5f5f7] p-4 text-left text-xs text-black/50"><div className="flex justify-between gap-4"><span>Saved in</span><strong className="text-right text-black/75">{savedDestination}</strong></div><div className="mt-2 flex justify-between gap-4"><span>Sponsor</span><strong className="text-black/75">{company}</strong></div><div className="mt-2 flex justify-between gap-4"><span>Team</span><strong className="text-black/75">{form.teamName}</strong></div><div className="mt-2 flex justify-between gap-4"><span>Status</span><strong className="text-black/75">Saved · Not sent to sponsor</strong></div></div><button onClick={onClose} aria-label="Close" className="mt-7 inline-flex items-center gap-2 rounded-[16px] bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0071e3]">Done <Check className="h-4 w-4"/></button></div></Overlay>;
  return <Overlay onClose={onClose}><div className="sticky top-0 z-10 border-b border-black/[.06] bg-white/92 px-7 py-5 backdrop-blur-2xl"><div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#0071e3]">Apply for sponsorship</p><h2 className="mt-1 text-xl font-semibold tracking-[-.025em]" style={{color:"#111827"}}>{company}</h2></div><button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full bg-[#f5f5f7] transition hover:bg-black hover:text-white"><X className="h-4 w-4"/></button></div><div className="mt-4 grid grid-cols-5 gap-1.5">{[1,2,3,4,5].map(n=><div key={n} className={`h-1.5 rounded-full transition ${n<=step?"bg-[#0071e3]":"bg-black/[.07]"}`}/>)}</div><div className="mt-2 flex justify-between text-[10px] text-black/30"><span>Team</span><span>Applicant</span><span>Request</span><span>Fit</span><span>Review</span></div></div><div className="p-7">
    {step===1&&<Section title="Your team" subtitle="Tell the sponsor who is building the project."><Field l="University *"><input className="field" placeholder="University name" value={form.university} onChange={e=>set("university",e.target.value)}/></Field><div className="grid gap-4 sm:grid-cols-2"><Field l="Engineering team name *"><input className="field" placeholder="Team name" value={form.teamName} onChange={e=>set("teamName",e.target.value)}/></Field><Field l="Team type *"><select className="field" value={form.teamType} onChange={e=>set("teamType",e.target.value)}><option value="">Select team type</option>{TEAM_CHOICES.map(x=><option key={x}>{x}</option>)}</select></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field l="Number of team members"><input className="field" type="number" min="1" placeholder="35" value={form.teamSize} onChange={e=>set("teamSize",e.target.value)}/></Field><Field l="Competition / project"><input className="field" placeholder="Formula SAE EV 2027" value={form.competition} onChange={e=>set("competition",e.target.value)}/></Field></div></Section>}
    {step===2&&<Section title="Applicant" subtitle="Give the sponsor a real person to reply to."><div className="grid gap-4 sm:grid-cols-2"><Field l="Applicant name *"><input className="field" placeholder="Full name" value={form.applicantName} onChange={e=>set("applicantName",e.target.value)}/></Field><Field l="Role"><input className="field" placeholder="Sponsorship lead, team captain..." value={form.applicantRole} onChange={e=>set("applicantRole",e.target.value)}/></Field></div><Field l="Applicant email *"><input className="field" type="email" placeholder="name@university.edu" value={form.applicantEmail} onChange={e=>set("applicantEmail",e.target.value)}/></Field><div className="grid gap-4 sm:grid-cols-2"><Field l="Team website"><input className="field" placeholder="https://..." value={form.teamWebsite} onChange={e=>set("teamWebsite",e.target.value)}/></Field><Field l="Team social / project URL"><input className="field" placeholder="https://..." value={form.teamSocial} onChange={e=>set("teamSocial",e.target.value)}/></Field></div></Section>}
    {step===3&&<Section title="What you need" subtitle="Make the ask concrete and easy to understand."><Field l="Sponsorship type requested *"><div className="flex flex-wrap gap-2">{SUPPORT_CHOICES.map(x=><button type="button" key={x} onClick={()=>toggle(x)} className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold transition ${form.sponsorshipTypes.includes(x)?"bg-black text-white shadow-md":"bg-[#f5f5f7] text-black/58 hover:bg-[#e8e8eb]"}`}>{form.sponsorshipTypes.includes(x)&&<Check className="h-3 w-3"/>}{x}</button>)}</div></Field><div className="grid gap-4 sm:grid-cols-2"><Field l="Amount / value requested"><input className="field" value={form.requestedValue} onChange={e=>set("requestedValue",e.target.value)} placeholder="$2,500 or 20 sensors"/></Field><Field l="Need-by date"><input className="field" type="date" value={form.needBy} onChange={e=>set("needBy",e.target.value)}/></Field></div><Field l="Requested support *"><textarea className="field min-h-28 resize-y" placeholder="What exactly are you asking this company to provide?" value={form.requestedSupport} onChange={e=>set("requestedSupport",e.target.value)}/></Field></Section>}
    {step===4&&<Section title="Why your team" subtitle="Show why the partnership makes sense."><Field l="Team / project description *"><textarea className="field min-h-24 resize-y" placeholder="What are you building and why does it matter?" value={form.projectDescription} onChange={e=>set("projectDescription",e.target.value)}/></Field><Field l={`Why ${company} is a good fit *`}><textarea className="field min-h-24 resize-y" placeholder="Connect your technical need to what this sponsor provides." value={form.whyFit} onChange={e=>set("whyFit",e.target.value)}/></Field><Field l="What your team can offer the sponsor *"><textarea className="field min-h-24 resize-y" placeholder="Logo placement, project updates, event visibility, technical feedback, recruiting exposure..." value={form.sponsorOffer} onChange={e=>set("sponsorOffer",e.target.value)}/></Field><div className="grid gap-4 sm:grid-cols-2"><Field l="Sponsorship deck URL"><input className="field" placeholder="https://..." value={form.deckUrl} onChange={e=>set("deckUrl",e.target.value)}/></Field><Field l="Additional notes"><input className="field" placeholder="Optional" value={form.notes} onChange={e=>set("notes",e.target.value)}/></Field></div></Section>}
    {step===5&&<Section title="Review your request" subtitle="Check the essentials before submitting."><ReviewRow k="Sponsor" v={company}/><ReviewRow k="Program" v={program||"Engineering team sponsorship"}/><ReviewRow k="University" v={form.university}/><ReviewRow k="Team" v={`${form.teamName} · ${form.teamType}`}/><ReviewRow k="Applicant" v={`${form.applicantName} · ${form.applicantEmail}`}/><ReviewRow k="Request" v={form.sponsorshipTypes.join(", ")}/><ReviewRow k="Value" v={form.requestedValue||"Not specified"}/><ReviewRow k="Support" v={form.requestedSupport}/><div className="rounded-2xl bg-[#eef6ff] p-4 text-xs leading-5 text-[#28537f]"><ShieldCheck className="mr-2 inline h-4 w-4"/>This saves your request in the platform only. Automatic email delivery is not enabled. Use the official program to apply directly. Sponsorship is not guaranteed.</div>{!contact&&<div className="rounded-2xl bg-amber-50 p-4 text-xs leading-5 text-amber-800"><Info className="mr-2 inline h-4 w-4"/>We do not currently have a verified sponsorship email for {company}. Your application will still be saved, but it will not be marked delivered.</div>}</Section>}
    {(create.error||submissionError)&&<div className="mt-5 rounded-2xl bg-red-50 p-4 text-xs leading-5 text-red-700">We could not save the application. {submissionError||String(create.error?.message||"")}</div>}
    {!create.enabled&&<div className="mt-5 rounded-2xl bg-amber-50 p-4 text-xs leading-5 text-amber-800">Application submission is currently unavailable for this visitor.</div>}
    <div className="mt-8 flex items-center justify-between border-t border-black/[.06] pt-5">{step>1?<button onClick={()=>setStep(step-1)} className="inline-flex items-center gap-1.5 rounded-[15px] bg-[#f5f5f7] px-4 py-3 text-xs font-semibold text-black/62 transition hover:bg-black hover:text-white"><ChevronLeft className="h-3.5 w-3.5"/>Back</button>:<button onClick={onClose} aria-label="Close" className="rounded-[15px] bg-[#f5f5f7] px-4 py-3 text-xs font-semibold text-black/62 transition hover:bg-black hover:text-white">Cancel</button>}{step<5?<button disabled={!valid} onClick={()=>setStep(step+1)} className="group inline-flex items-center gap-2 rounded-[15px] bg-black px-5 py-3 text-xs font-semibold text-white shadow-lg transition hover:bg-[#0071e3] disabled:cursor-not-allowed disabled:opacity-30">Continue <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"/></button>:<button disabled={!create.enabled||create.status==="pending"} onClick={submit} className="group inline-flex items-center gap-2 rounded-[15px] bg-[#0071e3] px-5 py-3 text-xs font-semibold text-white shadow-[0_10px_28px_rgba(0,113,227,.25)] transition hover:-translate-y-0.5 hover:bg-[#0077ed] disabled:cursor-not-allowed disabled:opacity-40">{create.status==="pending"?"Saving...":"Save Sponsorship Request"}<Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"/></button>}</div>
  </div></Overlay>
}
function Section({title,subtitle,children}:{title:string;subtitle:string;children:any}){return <div><h3 className="text-2xl font-semibold tracking-[-.035em]" style={{color:"#111827"}}>{title}</h3><p className="mt-2 text-sm" style={{color:"#5f6672"}}>{subtitle}</p><div className="mt-6 space-y-4">{children}</div></div>}
function Field({l,children}:{l:string;children:any}){return <label className="block"><span className="mb-2 block text-xs font-semibold text-black/60">{l}</span>{children}</label>}
function ReviewRow({k,v}:{k:string;v:string}){return <div className="flex flex-col gap-1 border-b border-black/[.06] py-3 sm:flex-row sm:justify-between sm:gap-6"><span className="text-xs font-medium text-black/35">{k}</span><span className="max-w-md text-sm font-medium text-black/72 sm:text-right">{v}</span></div>}

