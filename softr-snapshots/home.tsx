import { useMemo, useState } from "react";
import { datasource, q, useRecords, useRecordCreate } from "@/lib/datasource";
import {
  Search, ArrowUpRight, ShieldCheck, SlidersHorizontal, X, ChevronRight,
  CalendarDays, Rocket, CheckCircle2, Banknote, Gift, Factory, Layers3,
  Cpu, Code2, Wrench, PlaneTakeoff, CarFront, Bot, Satellite, Plane,
  CircuitBoard, Sparkles, Gauge, Globe2, Mail, Building2, Users, Trophy,
  BadgeCheck, ExternalLink, ChevronLeft, Send, Check, Info, Menu, PackageOpen
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ds = datasource.define({ sponsors: "opportunities", applications: "applications" });

const sponsorSelect = q.select({
  company: "Company Name",
  website: "Company Website",
  logo: "Company Logo / Thumbnail URL",
  program: "Sponsorship Program Name",
  types: "Sponsorship Type",
  teams: "Engineering Team Types",
  industries: "Company Industry",
  provides: "What They Provide",
  value: "Estimated Sponsorship Value",
  geography: "Geographic Eligibility",
  appStatus: "Application Status",
  deadline: "Deadline",
  eligibility: "Eligibility / Requirements",
  expectations: "What the Sponsor May Expect",
  officialUrl: "Official Sponsorship URL",
  contactEmail: "Sponsor Contact Email",
  alternativeUrl: "Alternative Contact URL",
  summary: "Public Summary",
  verification: "Verification Status",
  lastVerified: "Last Verified",
  source: "Source",
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

const SUPPORT_CATEGORIES = [
  { label: "Cash Sponsorship", icon: Banknote, blurb: "Funding for builds, travel and competition costs." },
  { label: "Complimentary Products", icon: Gift, blurb: "Parts, tools and products supplied in-kind." },
  { label: "Manufacturing", icon: Factory, blurb: "CNC, sheet metal, fabrication and 3D printing." },
  { label: "Materials", icon: Layers3, blurb: "Metals, composites, filament and engineering materials." },
  { label: "Electronics", icon: Cpu, blurb: "PCBs, sensors, electrical parts and components." },
  { label: "Software", icon: Code2, blurb: "CAD, CAE, simulation and engineering software." },
  { label: "Technical Services", icon: Wrench, blurb: "Engineering expertise, testing and technical support." },
  { label: "Travel Support", icon: PlaneTakeoff, blurb: "Support tied to travel, events and competitions." },
];

const TEAM_CATEGORIES = [
  { label: "Formula SAE", icon: CarFront },
  { label: "Baja SAE", icon: Gauge },
  { label: "Rocketry", icon: Rocket },
  { label: "Robotics", icon: Bot },
  { label: "CubeSat / Satellite", icon: Satellite },
  { label: "UAV / Drone", icon: Plane },
  { label: "Solar Car", icon: Sparkles },
  { label: "Electrical / Electronics", icon: CircuitBoard },
];

function toLabel(value: any): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return value.label || value.name || value.value || "";
  return "";
}

function toLabels(value: any): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value.map(toLabel).filter(Boolean);
  const single = toLabel(value);
  if (!single) return [];
  if (single.includes(",")) return single.split(",").map((s) => s.trim()).filter(Boolean);
  return [single];
}

function formatDate(value: any, fallback = "Rolling") {
  if (!value) return fallback;
  const raw = typeof value === "string" ? value : value.start || value.date || value.value;
  if (!raw) return fallback;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return String(raw);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function safeUrl(value: any) {
  const text = toLabel(value);
  if (!text) return "";
  return /^https?:\/\//i.test(text) ? text : `https://${text}`;
}

function faviconUrl(url: string) {
  if (!url) return "";
  return `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(url)}`;
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((x) => x[0]).join("").toUpperCase() || "ES";
}

function sponsorGradient(types: string[], industry: string) {
  const key = [...types, industry].join(" ").toLowerCase();
  if (key.includes("cash")) return "linear-gradient(145deg,#06291c 0%,#0a7b55 54%,#65e6b8 100%)";
  if (key.includes("manufact")) return "linear-gradient(145deg,#2a1305 0%,#a7470c 55%,#ffae5d 100%)";
  if (key.includes("electronic") || key.includes("component")) return "linear-gradient(145deg,#031f2b 0%,#006f8f 55%,#5ed8f2 100%)";
  if (key.includes("software")) return "linear-gradient(145deg,#1b1032 0%,#55309e 55%,#b9a0ff 100%)";
  if (key.includes("material")) return "linear-gradient(145deg,#28120f 0%,#8e382c 55%,#f39b87 100%)";
  return "linear-gradient(145deg,#071426 0%,#173c68 56%,#74a7ea 100%)";
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Block() {
  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } = useRecords({
    from: ds.sponsors,
    select: sponsorSelect,
    count: 100,
  });

  const records = data?.pages.flatMap((page) => page.items) ?? [];
  const sponsors = useMemo(() => records.filter((record: any) => {
    const verified = toLabels(record.fields.verification).some((v) => v === "Verified Sponsor");
    return verified;
  }), [records]);

  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("All teams");
  const [type, setType] = useState("All sponsorships");
  const [industry, setIndustry] = useState("All industries");
  const [geography, setGeography] = useState("All locations");
  const [applicationStatus, setApplicationStatus] = useState("All statuses");
  const [selected, setSelected] = useState<any>(null);
  const [applying, setApplying] = useState<any>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const teamOptions = useMemo(() => Array.from(new Set(sponsors.flatMap((r: any) => toLabels(r.fields.teams)))).sort(), [sponsors]);
  const typeOptions = useMemo(() => Array.from(new Set(sponsors.flatMap((r: any) => toLabels(r.fields.types)))).sort(), [sponsors]);
  const industryOptions = useMemo(() => Array.from(new Set(sponsors.flatMap((r: any) => toLabels(r.fields.industries)))).sort(), [sponsors]);
  const geographyOptions = useMemo(() => Array.from(new Set(sponsors.flatMap((r: any) => toLabels(r.fields.geography)))).sort(), [sponsors]);
  const statusOptions = useMemo(() => Array.from(new Set(sponsors.flatMap((r: any) => toLabels(r.fields.appStatus)))).sort(), [sponsors]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return sponsors.filter((r: any) => {
      const f = r.fields;
      const name = toLabel(f.company);
      const summary = toLabel(f.summary);
      const provides = toLabel(f.provides);
      const program = toLabel(f.program);
      const teams = toLabels(f.teams);
      const types = toLabels(f.types);
      const industries = toLabels(f.industries);
      const geographies = toLabels(f.geography);
      const statuses = toLabels(f.appStatus);
      const searchable = [name, summary, provides, program, ...teams, ...types, ...industries].join(" ").toLowerCase();
      const teamMatch = team === "All teams" || teams.includes("All Engineering Teams") || teams.includes(team);
      const typeMatch = type === "All sponsorships" || types.includes(type);
      const industryMatch = industry === "All industries" || industries.includes(industry);
      const geographyMatch = geography === "All locations" || geographies.includes("Global") || geographies.includes(geography);
      const statusMatch = applicationStatus === "All statuses" || statuses.includes(applicationStatus);
      return (!needle || searchable.includes(needle)) && teamMatch && typeMatch && industryMatch && geographyMatch && statusMatch;
    });
  }, [sponsors, query, team, type, industry, geography, applicationStatus]);

  const activeFilterCount = [team !== "All teams", type !== "All sponsorships", industry !== "All industries", geography !== "All locations", applicationStatus !== "All statuses"].filter(Boolean).length;
  const scrollToSponsors = () => document.getElementById("sponsor-directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const chooseType = (label: string) => { setType(label); setTimeout(scrollToSponsors, 50); };
  const chooseTeam = (label: string) => { setTeam(label); setTimeout(scrollToSponsors, 50); };
  const clearFilters = () => { setTeam("All teams"); setType("All sponsorships"); setIndustry("All industries"); setGeography("All locations"); setApplicationStatus("All statuses"); setQuery(""); };

  return (
    <div className="w-full min-h-screen bg-[#f3f4f6] text-[#151515] selection:bg-[#8ec5ff]/60">
      <style>{`
        #home-header3,[data-hrid="home-header3"],[data-block-id="2c339a9d-8236-4f38-847d-aa6b84832714"],#grid1,[data-hrid="grid1"],[data-block-id="6caa23a9-7812-45e4-8fbd-d1d161e8c460"]{display:none!important}
        body{background:#f3f4f6!important} html{scroll-behavior:smooth}
        .eng-grid{background-image:linear-gradient(rgba(255,255,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.055) 1px,transparent 1px);background-size:38px 38px}
        .micro-grid{background-image:linear-gradient(rgba(15,23,42,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,.045) 1px,transparent 1px);background-size:26px 26px}
      `}</style>

      <nav className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/82 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/72">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-7 lg:px-8">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2.5 text-left">
            <div className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-[10px] bg-[#0a0a0a] shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(53,149,255,.8),transparent_45%)]" />
              <Rocket className="relative h-4 w-4 text-white" strokeWidth={2.1} />
            </div>
            <span className="text-[14px] font-semibold tracking-[-0.025em] sm:text-[15px]">Engineering Sponsor Network</span>
          </button>
          <div className="hidden items-center gap-8 text-[12px] font-medium text-black/65 md:flex">
            <button onClick={scrollToSponsors} className="transition hover:text-black">Find Sponsors</button>
            <a href="#team-types" className="transition hover:text-black">Teams</a>
            <a href="#how-it-works" className="transition hover:text-black">How It Works</a>
            <button onClick={scrollToSponsors} className="rounded-full bg-black px-4 py-2 text-white transition hover:bg-black/80">Explore {sponsors.length || 24} sponsors</button>
          </div>
          <button onClick={() => setMenuOpen((v) => !v)} className="grid h-9 w-9 place-items-center rounded-full bg-black text-white md:hidden"><Menu className="h-4 w-4" /></button>
        </div>
        {menuOpen && <div className="border-t border-black/[0.06] bg-white px-5 py-4 md:hidden"><div className="flex flex-col gap-1 text-sm font-medium"><button onClick={() => {scrollToSponsors();setMenuOpen(false)}} className="rounded-xl px-3 py-3 text-left hover:bg-black/5">Find Sponsors</button><a href="#team-types" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 hover:bg-black/5">Teams</a><a href="#how-it-works" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 hover:bg-black/5">How It Works</a></div></div>}
      </nav>

      <header className="relative overflow-hidden bg-[#05080d] text-white">
        <div className="eng-grid absolute inset-0 opacity-80" />
        <div className="absolute left-1/2 top-[-22rem] h-[50rem] w-[50rem] -translate-x-1/2 rounded-full bg-[#176bff]/20 blur-3xl" />
        <div className="absolute -right-36 bottom-[-15rem] h-[34rem] w-[34rem] rounded-full bg-[#8b5cf6]/16 blur-3xl" />
        <div className="absolute -left-40 bottom-[-18rem] h-[32rem] w-[32rem] rounded-full bg-[#00b8a9]/12 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-7 sm:pb-28 sm:pt-24 lg:px-8 lg:pb-32 lg:pt-28">
          <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_.92fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-3 py-1.5 text-[11px] font-medium text-white/75 backdrop-blur-xl"><ShieldCheck className="h-3.5 w-3.5 text-[#69b8ff]" /> Built only for university engineering teams</div>
              <h1 className="max-w-4xl text-[50px] font-semibold leading-[.96] tracking-[-0.058em] sm:text-[68px] lg:text-[84px]">Find sponsors.<br /><span className="bg-gradient-to-r from-[#8bc7ff] via-white to-[#b5a5ff] bg-clip-text text-transparent">Build bigger.</span></h1>
              <p className="mt-7 max-w-2xl text-[17px] leading-7 text-white/62 sm:text-[20px] sm:leading-8">Discover companies that support university engineering teams with funding, products, manufacturing, materials, electronics, software, technical services, and more.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button onClick={scrollToSponsors} className="group inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-6 py-3.5 text-[15px] font-semibold text-black shadow-[0_15px_45px_rgba(255,255,255,.12)] transition hover:bg-white/90 active:scale-[.99]">Find Sponsors <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></button>
                <a href="#how-it-works" className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.06] px-6 py-3.5 text-[15px] font-medium text-white/85 backdrop-blur transition hover:bg-white/[0.1]">How It Works</a>
              </div>
              <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-white/46"><span className="inline-flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-emerald-400" /> Verified sponsor programs</span><span className="inline-flex items-center gap-1.5"><Search className="h-4 w-4 text-blue-300" /> Engineering-specific filters</span><span className="inline-flex items-center gap-1.5"><Send className="h-4 w-4 text-violet-300" /> Apply inside the platform</span></div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute -inset-8 rounded-full bg-[#176bff]/10 blur-3xl" />
              <div className="relative rotate-[1.5deg] rounded-[32px] border border-white/12 bg-white/[0.075] p-3 shadow-[0_35px_100px_rgba(0,0,0,.55)] backdrop-blur-2xl">
                <div className="rounded-[24px] border border-white/10 bg-[#0d121a] p-5 sm:p-6">
                  <div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-emerald-400" /><span className="text-xs font-medium text-white/65">Sponsor match</span></div><span className="font-mono text-[10px] text-white/30">ENG-01</span></div>
                  <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.045] p-4"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-black"><Factory className="h-5 w-5" /></div><div><p className="text-sm font-semibold">Need custom manufacturing?</p><p className="mt-0.5 text-xs text-white/42">Formula SAE · Rocketry · Robotics</p></div></div></div>
                  <div className="my-4 flex items-center gap-3"><div className="h-px flex-1 bg-white/10" /><Sparkles className="h-4 w-4 text-blue-300" /><div className="h-px flex-1 bg-white/10" /></div>
                  <div className="grid gap-2 sm:grid-cols-2"><MiniMatch icon={Factory} label="Manufacturing" /><MiniMatch icon={Cpu} label="Electronics" /><MiniMatch icon={Code2} label="Software" /><MiniMatch icon={Banknote} label="Cash support" /></div>
                  <div className="mt-5 rounded-2xl bg-white p-4 text-black"><div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-black/35">Next step</p><p className="mt-1 text-sm font-semibold">Apply without leaving the platform</p></div><ArrowUpRight className="h-5 w-5" /></div></div>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-3 rotate-[-3deg] rounded-2xl border border-white/10 bg-white/95 px-4 py-3 text-black shadow-2xl sm:-left-8"><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-black/35">Directory</p><p className="mt-0.5 text-lg font-semibold">{sponsors.length || 24} verified sponsors</p></div>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-white py-5 shadow-[0_1px_0_rgba(0,0,0,.05)]">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:px-7 lg:px-8">
          {SUPPORT_CATEGORIES.map(({label,icon:Icon}) => <button key={label} onClick={() => chooseType(label)} className="flex shrink-0 items-center gap-2 rounded-full bg-[#f3f4f6] px-4 py-2.5 text-xs font-semibold text-black/65 transition hover:bg-black hover:text-white"><Icon className="h-3.5 w-3.5" />{label}</button>)}
        </div>
      </section>

      <section className="micro-grid bg-[#f3f4f6]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-7 lg:px-8 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
            <div><p className="text-sm font-semibold text-[#0066cc]">Support that fits the build</p><h2 className="mt-3 text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-5xl">From funding to fabrication.</h2><p className="mt-5 max-w-md text-[16px] leading-7 text-black/52">Sponsorship is more than a logo on a car. Engineering teams need real inputs: parts, manufacturing, software, technical expertise, materials and cash.</p></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {SUPPORT_CATEGORIES.map(({label,icon:Icon,blurb},index) => <button key={label} onClick={() => chooseType(label)} className={`group min-h-[154px] rounded-[26px] border border-black/[0.055] p-5 text-left shadow-[0_2px_10px_rgba(0,0,0,.035)] transition duration-300 hover:-translate-y-1 hover:shadow-xl ${index===0?"bg-black text-white":index===3?"bg-[#e8f2ff]":"bg-white"}`}><div className="flex items-start justify-between"><div className={`grid h-10 w-10 place-items-center rounded-full ${index===0?"bg-white text-black":"bg-black text-white"}`}><Icon className="h-4.5 w-4.5" /></div><ArrowUpRight className={`h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 ${index===0?"text-white/45":"text-black/25"}`} /></div><h3 className="mt-5 text-[17px] font-semibold tracking-[-.02em]">{label}</h3><p className={`mt-1.5 text-xs leading-5 ${index===0?"text-white/50":"text-black/45"}`}>{blurb}</p></button>)}
            </div>
          </div>
        </div>
      </section>

      <section id="team-types" className="overflow-hidden bg-[#0b0e13] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-7 lg:px-8 lg:py-28">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><p className="text-sm font-semibold text-[#75baff]">Built for teams that build.</p><h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Your discipline changes.<br />The sponsor hunt shouldn't.</h2></div><p className="max-w-md text-sm leading-6 text-white/48">Filter sponsors around the kind of engineering your team actually does.</p></div>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{TEAM_CATEGORIES.map(({label,icon:Icon},i) => <button key={label} onClick={() => chooseTeam(label)} className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.055] p-5 text-left backdrop-blur transition hover:bg-white/[0.095]"><div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl" /><div className="relative flex items-center justify-between"><div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.08]"><Icon className="h-5 w-5 text-white/85" /></div><span className="font-mono text-[10px] text-white/22">0{i+1}</span></div><p className="relative mt-8 text-[17px] font-semibold tracking-[-.02em]">{label}</p><p className="relative mt-1 text-xs text-white/35">Find matching sponsors <ChevronRight className="ml-0.5 inline h-3 w-3" /></p></button>)}</div>
        </div>
      </section>

      <main id="sponsor-directory" className="scroll-mt-16 bg-[#f3f4f6]">
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-7 sm:py-20 lg:px-8 lg:py-24">
          <div className="mb-9 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="text-sm font-semibold text-[#0066cc]">Sponsor discovery</p><h2 className="mt-2 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Find companies ready to help.</h2><p className="mt-3 max-w-2xl text-[15px] leading-6 text-black/50">Search by engineering team, sponsorship type, industry, location or application status.</p></div><div className="flex items-center gap-2 text-xs text-black/45"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Only verified sponsor programs are shown</div></div>

          <div className="sticky top-[68px] z-30 mb-8 rounded-[26px] border border-black/[0.06] bg-white/88 p-3 shadow-[0_12px_40px_rgba(0,0,0,.065)] backdrop-blur-2xl sm:p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="relative flex min-h-12 flex-1 items-center rounded-2xl bg-[#f3f4f6] px-4 ring-1 ring-black/[0.025] transition focus-within:bg-white focus-within:ring-[#0066cc]/30"><Search className="mr-3 h-4 w-4 text-black/40" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search companies, sponsorships, or support..." className="w-full bg-transparent text-[14px] outline-none placeholder:text-black/35" />{query && <button onClick={() => setQuery("")} className="rounded-full p-1 text-black/35 hover:bg-black/5 hover:text-black"><X className="h-4 w-4" /></button>}</label>
              <button onClick={() => setFiltersOpen((v) => !v)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-black px-5 text-sm font-medium text-white transition hover:bg-black/80 lg:hidden"><SlidersHorizontal className="h-4 w-4" /> Filters {activeFilterCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[10px] text-black">{activeFilterCount}</span>}</button>
              <div className="hidden gap-2 lg:flex"><FilterSelect value={team} onChange={setTeam} options={teamOptions} allLabel="All teams" /><FilterSelect value={type} onChange={setType} options={typeOptions} allLabel="All sponsorships" /><FilterSelect value={industry} onChange={setIndustry} options={industryOptions} allLabel="All industries" /></div>
            </div>
            {(filtersOpen || geography !== "All locations" || applicationStatus !== "All statuses") && <div className="mt-3 grid gap-2 border-t border-black/[0.06] pt-3 sm:grid-cols-2 lg:grid-cols-5"><div className="lg:hidden"><FilterSelect value={team} onChange={setTeam} options={teamOptions} allLabel="All teams" /></div><div className="lg:hidden"><FilterSelect value={type} onChange={setType} options={typeOptions} allLabel="All sponsorships" /></div><div className="lg:hidden"><FilterSelect value={industry} onChange={setIndustry} options={industryOptions} allLabel="All industries" /></div><FilterSelect value={geography} onChange={setGeography} options={geographyOptions} allLabel="All locations" /><FilterSelect value={applicationStatus} onChange={setApplicationStatus} options={statusOptions} allLabel="All statuses" /></div>}
            {!filtersOpen && <div className="mt-3 hidden gap-2 border-t border-black/[0.06] pt-3 lg:flex"><FilterSelect value={geography} onChange={setGeography} options={geographyOptions} allLabel="All locations" /><FilterSelect value={applicationStatus} onChange={setApplicationStatus} options={statusOptions} allLabel="All statuses" /></div>}
          </div>

          <div className="mb-5 flex items-center justify-between"><div className="text-sm font-medium text-black/55">{filtered.length} {filtered.length === 1 ? "sponsor" : "sponsors"}</div>{(activeFilterCount > 0 || query) && <button onClick={clearFilters} className="text-sm font-medium text-[#0066cc] hover:underline">Clear filters</button>}</div>

          {status === "pending" ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></div> : filtered.length === 0 ? <div className="rounded-[28px] bg-white px-6 py-20 text-center shadow-sm ring-1 ring-black/[0.04]"><Search className="mx-auto h-8 w-8 text-black/25" /><h3 className="mt-4 text-xl font-semibold">No sponsor matches yet.</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/50">Try a broader search or clear one of your filters.</p></div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((record: any) => <SponsorCard key={record.id} record={record} onOpen={() => setSelected(record)} />)}</div>}
          {hasNextPage && <div className="mt-10 flex justify-center"><button disabled={isFetchingNextPage} onClick={() => fetchNextPage()} className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-50">{isFetchingNextPage ? "Loading..." : "Load more sponsors"}</button></div>}
        </section>
      </main>

      <section id="how-it-works" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-7 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div><p className="text-sm font-semibold text-[#0066cc]">How it works</p><h2 className="mt-3 text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-5xl">Three steps from need to request.</h2><p className="mt-5 max-w-md text-[15px] leading-7 text-black/50">The MVP stays intentionally simple: discover a relevant sponsor, understand what they offer, then submit one clear request.</p></div>
            <div className="space-y-3"><ProcessRow number="01" icon={SlidersHorizontal} title="Tell us what your team needs." text="Filter by team type, sponsorship category, industry and geography." /><ProcessRow number="02" icon={Building2} title="Discover relevant companies." text="Open a sponsor profile with support, eligibility, value and expectations." /><ProcessRow number="03" icon={Send} title="Apply through the platform." text="Complete a focused application without being pushed into a generic opportunity portal." /></div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#07101d] text-white"><div className="eng-grid absolute inset-0 opacity-60" /><div className="relative mx-auto max-w-7xl px-5 py-20 text-center sm:px-7 lg:px-8 lg:py-24"><div className="mx-auto grid h-14 w-14 place-items-center rounded-[20px] border border-white/12 bg-white/[0.07]"><Rocket className="h-6 w-6" /></div><h2 className="mx-auto mt-7 max-w-3xl text-4xl font-semibold tracking-[-.05em] sm:text-5xl">Spend less time hunting.<br />More time engineering.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/48">Search verified sponsor programs built around university engineering teams.</p><button onClick={scrollToSponsors} className="mt-8 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90">Find Sponsors</button></div></section>

      <footer className="border-t border-black/[0.06] bg-[#f3f4f6]"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-9 text-xs text-black/42 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-8"><div><div className="font-semibold text-black/70">Engineering Sponsor Network</div><div className="mt-1">Temporary brand · Independent sponsorship discovery/application prototype</div></div><div className="max-w-md sm:text-right">Listings are based on public company sources and may change. A listing does not imply a partnership or endorsement.</div></div></footer>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}><SponsorDialog record={selected} onApply={() => { const target = selected; setSelected(null); setTimeout(() => setApplying(target), 100); }} /></Dialog>
      <Dialog open={!!applying} onOpenChange={(open) => !open && setApplying(null)}>{applying && <ApplicationDialog sponsor={applying} onClose={() => setApplying(null)} />}</Dialog>
    </div>
  );
}

function MiniMatch({ icon: Icon, label }: { icon: any; label: string }) { return <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-3"><Icon className="h-4 w-4 text-blue-300" /><span className="text-xs font-medium text-white/62">{label}</span></div>; }

function FilterSelect({ value, onChange, options, allLabel }: { value: string; onChange: (value: string) => void; options: string[]; allLabel: string }) {
  return <select value={value} onChange={(e) => onChange(e.target.value)} className="min-h-12 w-full rounded-2xl border-0 bg-[#f3f4f6] px-4 pr-9 text-xs font-semibold text-black/65 outline-none ring-1 ring-black/[0.025] transition hover:bg-black/[0.055] focus:ring-[#0066cc]/30 lg:w-auto"><option>{allLabel}</option>{options.filter((o) => o !== allLabel).map((o) => <option key={o}>{o}</option>)}</select>;
}

function SponsorLogo({ name, website, logo, className = "h-12 w-12" }: { name: string; website: string; logo: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const src = safeUrl(logo) || faviconUrl(safeUrl(website));
  return <div className={`grid place-items-center overflow-hidden rounded-[18px] bg-white shadow-xl ring-1 ring-black/[0.06] ${className}`}>{src && !failed ? <img src={src} alt="" onError={() => setFailed(true)} className="h-[58%] w-[58%] object-contain" /> : <span className="text-sm font-bold tracking-[-.04em] text-black/70">{initials(name)}</span>}</div>;
}

function SponsorCard({ record, onOpen }: { record: any; onOpen: () => void }) {
  const f = record.fields; const name = toLabel(f.company) || "Sponsor"; const program = toLabel(f.program); const industries = toLabels(f.industries); const types = toLabels(f.types); const teams = toLabels(f.teams); const value = toLabel(f.value); const geo = toLabels(f.geography); const appStatus = toLabel(f.appStatus);
  return <article onClick={onOpen} className="group cursor-pointer overflow-hidden rounded-[28px] bg-white shadow-[0_2px_12px_rgba(0,0,0,.04)] ring-1 ring-black/[0.045] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,.11)]">
    <div className="relative aspect-[16/8.7] overflow-hidden" style={{background:sponsorGradient(types,industries[0]||"")}}><div className="eng-grid absolute inset-0 opacity-30" /><div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(255,255,255,.25),transparent_34%)]" /><div className="absolute left-5 top-5"><SponsorLogo name={name} website={f.website} logo={f.logo} className="h-[70px] w-[70px]" /></div>{appStatus && <span className="absolute right-4 top-4 rounded-full border border-white/18 bg-black/24 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-xl">{appStatus}</span>}<div className="absolute bottom-4 left-5 right-5"><div className="flex flex-wrap gap-1.5">{types.slice(0,3).map((t)=><span key={t} className="rounded-full border border-white/15 bg-black/25 px-2.5 py-1 text-[10px] font-semibold text-white/90 backdrop-blur">{t}</span>)}</div></div></div>
    <div className="p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><h3 className="text-[19px] font-semibold leading-6 tracking-[-.025em] text-black transition group-hover:text-[#0066cc]">{name}</h3><p className="mt-1 truncate text-xs font-medium text-black/42">{program || "Engineering team sponsorship"}</p></div><div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f3f4f6] text-black/55 transition group-hover:bg-black group-hover:text-white"><ArrowUpRight className="h-4 w-4" /></div></div>
      <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-black/54">{toLabel(f.provides) || toLabel(f.summary)}</p>
      {value && <div className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-800"><PackageOpen className="h-3.5 w-3.5" />{value}</div>}
      <div className="mt-4 flex flex-wrap gap-1.5">{teams.slice(0,3).map((t)=><span key={t} className="rounded-full bg-[#f3f4f6] px-2.5 py-1 text-[10px] font-medium text-black/55">{t}</span>)}{teams.length>3&&<span className="rounded-full bg-[#f3f4f6] px-2.5 py-1 text-[10px] font-medium text-black/55">+{teams.length-3}</span>}</div>
      <div className="mt-5 flex items-center justify-between border-t border-black/[0.06] pt-4 text-[11px] text-black/42"><span className="inline-flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5" />{geo[0]||"Eligibility varies"}</span><span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(f.deadline)}</span></div>
      <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full bg-black px-4 py-3 text-xs font-semibold text-white transition group-hover:bg-[#0066cc]">View Sponsorship <ChevronRight className="h-3.5 w-3.5" /></button>
    </div>
  </article>;
}

function SponsorDialog({ record, onApply }: { record: any; onApply: () => void }) {
  if (!record) return null; const f=record.fields; const name=toLabel(f.company)||"Sponsor"; const program=toLabel(f.program); const types=toLabels(f.types); const teams=toLabels(f.teams); const industries=toLabels(f.industries); const geo=toLabels(f.geography); const official=safeUrl(f.officialUrl)||safeUrl(f.alternativeUrl)||safeUrl(f.website); const contact=toLabel(f.contactEmail);
  return <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto rounded-[30px] border-0 bg-white p-0 shadow-2xl sm:rounded-[34px]">
    <div className="relative overflow-hidden px-6 pb-8 pt-10 sm:px-9" style={{background:sponsorGradient(types,industries[0]||"")}}><div className="eng-grid absolute inset-0 opacity-25" /><div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,.24),transparent_38%)]" /><div className="relative flex items-center gap-5"><SponsorLogo name={name} website={f.website} logo={f.logo} className="h-16 w-16" /><div className="min-w-0 text-white"><div className="mb-2 flex flex-wrap gap-2">{types.slice(0,3).map((t)=><span key={t} className="rounded-full border border-white/18 bg-black/20 px-2.5 py-1 text-[10px] font-semibold backdrop-blur">{t}</span>)}</div><DialogHeader><DialogTitle className="text-left text-2xl font-semibold leading-tight tracking-[-.035em] text-white sm:text-3xl">{name}</DialogTitle></DialogHeader><p className="mt-1 text-xs text-white/55">{program}</p></div></div></div>
    <div className="space-y-7 px-6 pb-8 pt-7 sm:px-9 sm:pb-10">
      <div><SectionLabel>What they provide</SectionLabel><p className="mt-2 text-[15px] leading-7 text-black/70">{toLabel(f.provides)||toLabel(f.summary)||"See the official sponsor program for current support details."}</p>{toLabel(f.value)&&<div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800"><PackageOpen className="h-4 w-4" />{toLabel(f.value)}</div>}</div>
      <div className="grid gap-3 sm:grid-cols-3"><InfoCard label="Application" value={toLabel(f.appStatus)||"Unknown"} icon={<CheckCircle2 className="h-4 w-4" />} /><InfoCard label="Deadline" value={formatDate(f.deadline)} icon={<CalendarDays className="h-4 w-4" />} /><InfoCard label="Region" value={geo.join(", ")||"Check program"} icon={<Globe2 className="h-4 w-4" />} /></div>
      <div><SectionLabel>Eligible engineering teams</SectionLabel><div className="mt-3 flex flex-wrap gap-2">{teams.map((t)=><span key={t} className="rounded-full bg-[#f3f4f6] px-3 py-1.5 text-xs font-medium text-black/65">{t}</span>)}</div></div>
      {toLabel(f.eligibility)&&<div><SectionLabel>Eligibility / requirements</SectionLabel><p className="mt-2 text-sm leading-6 text-black/62">{toLabel(f.eligibility)}</p></div>}
      {toLabel(f.expectations)&&<div><SectionLabel>What the sponsor may expect</SectionLabel><p className="mt-2 text-sm leading-6 text-black/62">{toLabel(f.expectations)}</p></div>}
      <div className="rounded-2xl bg-[#f1f7ff] px-4 py-3.5 text-xs leading-5 text-[#28537f]"><div className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4" /> Verified sponsor program</div><p className="mt-1 text-[#28537f]/75">Information is collected from public company sources and may change. Verify program details before entering an agreement. Listing does not imply partnership or endorsement.</p></div>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]"><button onClick={onApply} className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#0066cc] px-6 py-3.5 text-[14px] font-semibold text-white shadow-[0_10px_30px_rgba(0,102,204,.22)] transition hover:bg-[#0071e3] active:scale-[.99]">Apply for Sponsorship <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></button>{official&&<button onClick={()=>window.open(official,"_blank","noopener,noreferrer")} className="flex items-center justify-center gap-2 rounded-full bg-[#f3f4f6] px-5 py-3.5 text-xs font-semibold text-black/60 hover:bg-black/10">Official source <ExternalLink className="h-3.5 w-3.5" /></button>}</div>
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-black/35">{contact?<><Mail className="h-3.5 w-3.5" /> Verified contact route available</>:<><Info className="h-3.5 w-3.5" /> No verified sponsor email currently stored; applications will not be falsely marked delivered</>}</div>
    </div>
  </DialogContent>;
}

function ApplicationDialog({ sponsor, onClose }: { sponsor: any; onClose: () => void }) {
  const f=sponsor.fields; const company=toLabel(f.company)||"Sponsor"; const program=toLabel(f.program); const contactEmail=toLabel(f.contactEmail); const official=safeUrl(f.officialUrl)||safeUrl(f.alternativeUrl)||safeUrl(f.website); const sponsorTypes=toLabels(f.types);
  const [step,setStep]=useState(1); const [submitted,setSubmitted]=useState(false); const [result,setResult]=useState<"email"|"no-email"|null>(null);
  const [form,setForm]=useState({university:"",teamName:"",teamType:"",teamSize:"",competition:"",teamWebsite:"",teamSocial:"",applicantName:"",applicantRole:"",applicantEmail:"",sponsorshipTypes:sponsorTypes[0]?[sponsorTypes[0]]:[],requestedValue:"",requestedSupport:"",needBy:"",projectDescription:"",whyFit:"",sponsorOffer:"",deckUrl:"",notes:""});
  const createApplication=useRecordCreate({from:ds.applications,fields:applicationFields});
  const set=(key:string,value:any)=>setForm((old:any)=>({...old,[key]:value}));
  const teamChoices=["Formula SAE","Baja SAE","Formula Student","Rocketry","Robotics","CubeSat / Satellite","UAV / Drone","Solar Car","Autonomous Vehicle","Concrete Canoe","Steel Bridge","Chem-E-Car","Human Powered Vehicle","Aerospace","Mechanical Engineering","Electrical / Electronics","Other Engineering Team"];
  const supportChoices=["Cash Sponsorship","Complimentary Products","Components","Manufacturing","Materials","Electronics","Software","Technical Services","Travel Support","Event / Competition Support","Discount","Other In-Kind Support"];
  const stepValid=step===1?!!(form.university&&form.teamName&&form.teamType):step===2?!!(form.applicantName&&form.applicantEmail):step===3?!!(form.sponsorshipTypes.length&&form.requestedSupport):step===4?!!(form.projectDescription&&form.whyFit&&form.sponsorOffer):true;
  const toggleSupport=(label:string)=>set("sponsorshipTypes",form.sponsorshipTypes.includes(label)?form.sponsorshipTypes.filter((x:string)=>x!==label):[...form.sponsorshipTypes,label]);
  const submit=async()=>{if(!createApplication.enabled)return;try{await createApplication.mutateAsync({application:`${form.teamName} → ${company}`,sponsorCompany:[sponsor.id],sponsorshipProgram:program,university:form.university,teamName:form.teamName,teamType:[form.teamType],applicantName:form.applicantName,applicantRole:form.applicantRole,applicantEmail:form.applicantEmail,teamWebsite:form.teamWebsite,teamSocial:form.teamSocial,teamSize:form.teamSize?Number(form.teamSize):undefined,competition:form.competition,sponsorshipTypes:form.sponsorshipTypes,requestedValue:form.requestedValue,requestedSupport:form.requestedSupport,whyFit:form.whyFit,projectDescription:form.projectDescription,sponsorOffer:form.sponsorOffer,needBy:form.needBy||undefined,deckUrl:form.deckUrl,notes:form.notes,applicationStatus:"Submitted",submittedDate:todayISO(),recipientEmail:contactEmail||"",deliveryStatus:"Not Sent"});setSubmitted(true);setResult(contactEmail?"email":"no-email");}catch(e){/* error is rendered from hook */}};

  if(submitted)return <DialogContent className="max-w-xl rounded-[30px] border-0 bg-white p-0 shadow-2xl"><div className="px-7 py-10 text-center sm:px-10"><div className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${result==="email"?"bg-blue-50 text-[#0066cc]":"bg-amber-50 text-amber-700"}`}>{result==="email"?<Send className="h-7 w-7" />:<Info className="h-7 w-7" />}</div><h2 className="mt-6 text-2xl font-semibold tracking-[-.035em]">{result==="email"?"Application saved for delivery.":"Application saved."}</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/52">{result==="email"?`Your sponsorship request for ${company} is saved. Email delivery will be handled by the platform workflow; it is not marked sent until delivery succeeds.`:`We don't currently have a verified sponsorship email for ${company}. Your application is saved, but it was not emailed.`}</p><div className="mt-6 rounded-2xl bg-[#f3f4f6] p-4 text-left text-xs text-black/55"><div className="flex justify-between gap-4"><span>Sponsor</span><strong className="text-right text-black/75">{company}</strong></div><div className="mt-2 flex justify-between gap-4"><span>Team</span><strong className="text-right text-black/75">{form.teamName}</strong></div><div className="mt-2 flex justify-between gap-4"><span>Email delivery</span><strong className="text-right text-black/75">Not sent yet</strong></div></div>{result==="no-email"&&official&&<button onClick={()=>window.open(official,"_blank","noopener,noreferrer")} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#f3f4f6] px-5 py-3 text-xs font-semibold text-black/65">Open official sponsor page <ExternalLink className="h-3.5 w-3.5" /></button>}<button onClick={onClose} className="mt-5 w-full rounded-full bg-black px-5 py-3.5 text-sm font-semibold text-white">Done</button></div></DialogContent>;

  return <DialogContent className="max-h-[94vh] max-w-3xl overflow-y-auto rounded-[30px] border-0 bg-white p-0 shadow-2xl sm:rounded-[34px]">
    <div className="sticky top-0 z-10 border-b border-black/[0.06] bg-white/94 px-6 py-5 backdrop-blur-xl sm:px-8"><div className="flex items-center justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#0066cc]">Apply for sponsorship</p><DialogHeader><DialogTitle className="mt-1 text-left text-xl font-semibold tracking-[-.025em]">{company}</DialogTitle></DialogHeader></div><span className="text-xs font-medium text-black/35">Step {step} of 5</span></div><div className="mt-4 grid grid-cols-5 gap-1.5">{[1,2,3,4,5].map((n)=><div key={n} className={`h-1.5 rounded-full ${n<=step?"bg-[#0066cc]":"bg-black/[0.07]"}`} />)}</div></div>
    <div className="px-6 py-7 sm:px-8 sm:py-8">
      {step===1&&<FormSection eyebrow="Step 1" title="Your team" subtitle="Tell the sponsor who is building the project."><Field label="University *"><input value={form.university} onChange={(e)=>set("university",e.target.value)} className="field" placeholder="University name" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Engineering team name *"><input value={form.teamName} onChange={(e)=>set("teamName",e.target.value)} className="field" placeholder="e.g. Buckeye Space Launch Initiative" /></Field><Field label="Engineering team type *"><select value={form.teamType} onChange={(e)=>set("teamType",e.target.value)} className="field"><option value="">Select team type</option>{teamChoices.map(x=><option key={x}>{x}</option>)}</select></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Number of team members"><input type="number" min="1" value={form.teamSize} onChange={(e)=>set("teamSize",e.target.value)} className="field" placeholder="35" /></Field><Field label="Competition / project"><input value={form.competition} onChange={(e)=>set("competition",e.target.value)} className="field" placeholder="Formula SAE EV 2027" /></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Team website"><input value={form.teamWebsite} onChange={(e)=>set("teamWebsite",e.target.value)} className="field" placeholder="https://..." /></Field><Field label="Team social / project URL"><input value={form.teamSocial} onChange={(e)=>set("teamSocial",e.target.value)} className="field" placeholder="https://..." /></Field></div></FormSection>}
      {step===2&&<FormSection eyebrow="Step 2" title="Applicant" subtitle="Give the sponsor a real person to reply to."><div className="grid gap-4 sm:grid-cols-2"><Field label="Applicant name *"><input value={form.applicantName} onChange={(e)=>set("applicantName",e.target.value)} className="field" placeholder="Full name" /></Field><Field label="Role"><input value={form.applicantRole} onChange={(e)=>set("applicantRole",e.target.value)} className="field" placeholder="Team lead, sponsorship lead..." /></Field></div><Field label="Applicant email *"><input type="email" value={form.applicantEmail} onChange={(e)=>set("applicantEmail",e.target.value)} className="field" placeholder="name@university.edu" /></Field><div className="rounded-2xl bg-blue-50 p-4 text-xs leading-5 text-blue-800"><Mail className="mr-2 inline h-4 w-4" />This email is included with the request so the sponsor can contact your team.</div></FormSection>}
      {step===3&&<FormSection eyebrow="Step 3" title="What you need" subtitle="Be specific. Strong sponsorship requests are easy to understand."><Field label="Sponsorship type requested *"><div className="flex flex-wrap gap-2">{supportChoices.map(x=><button type="button" key={x} onClick={()=>toggleSupport(x)} className={`rounded-full px-3 py-2 text-xs font-semibold transition ${form.sponsorshipTypes.includes(x)?"bg-black text-white":"bg-[#f3f4f6] text-black/58 hover:bg-black/10"}`}>{form.sponsorshipTypes.includes(x)&&<Check className="mr-1 inline h-3 w-3" />}{x}</button>)}</div></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Amount / value requested"><input value={form.requestedValue} onChange={(e)=>set("requestedValue",e.target.value)} className="field" placeholder="$2,500, 20 sensors, $500 machining..." /></Field><Field label="Need-by date"><input type="date" value={form.needBy} onChange={(e)=>set("needBy",e.target.value)} className="field" /></Field></div><Field label="Requested support *"><textarea value={form.requestedSupport} onChange={(e)=>set("requestedSupport",e.target.value)} className="field min-h-28 resize-y" placeholder="What exactly are you asking the company to provide?" /></Field></FormSection>}
      {step===4&&<FormSection eyebrow="Step 4" title="Why your team" subtitle="Show the sponsor why this partnership makes sense."><Field label="Team / project description *"><textarea value={form.projectDescription} onChange={(e)=>set("projectDescription",e.target.value)} className="field min-h-24 resize-y" placeholder="What are you building, why does it matter, and what stage are you at?" /></Field><Field label={`Why ${company} is a good fit *`}><textarea value={form.whyFit} onChange={(e)=>set("whyFit",e.target.value)} className="field min-h-24 resize-y" placeholder="Connect your technical needs to what this sponsor provides." /></Field><Field label="What your team can offer the sponsor *"><textarea value={form.sponsorOffer} onChange={(e)=>set("sponsorOffer",e.target.value)} className="field min-h-24 resize-y" placeholder="Logo placement, project updates, event visibility, technical feedback, recruiting exposure..." /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Sponsorship deck URL"><input value={form.deckUrl} onChange={(e)=>set("deckUrl",e.target.value)} className="field" placeholder="https://..." /></Field><Field label="Additional notes"><input value={form.notes} onChange={(e)=>set("notes",e.target.value)} className="field" placeholder="Optional" /></Field></div></FormSection>}
      {step===5&&<FormSection eyebrow="Step 5" title="Review your request" subtitle="Check the essentials before submitting."><ReviewRow label="Sponsor" value={company} /><ReviewRow label="Program" value={program||"Engineering team sponsorship"} /><ReviewRow label="University" value={form.university} /><ReviewRow label="Team" value={`${form.teamName} · ${form.teamType}`} /><ReviewRow label="Applicant" value={`${form.applicantName}${form.applicantRole?` · ${form.applicantRole}`:""} · ${form.applicantEmail}`} /><ReviewRow label="Request" value={form.sponsorshipTypes.join(", ")} /><ReviewRow label="Value" value={form.requestedValue||"Not specified"} /><ReviewRow label="Need" value={form.requestedSupport} /><div className="rounded-2xl bg-[#f3f4f6] p-4 text-xs leading-5 text-black/52"><ShieldCheck className="mr-2 inline h-4 w-4" />By submitting, you confirm the information is accurate. Sponsorship is not guaranteed; the company controls its own review and decision.</div>{!contactEmail&&<div className="rounded-2xl bg-amber-50 p-4 text-xs leading-5 text-amber-800"><Info className="mr-2 inline h-4 w-4" />We don't currently have a verified sponsorship email for {company}. The application will be saved, but it will not be marked delivered.</div>}</FormSection>}
      {createApplication.error&&<div className="mt-5 rounded-2xl bg-red-50 p-4 text-xs leading-5 text-red-700">We couldn't save this application yet. Please review the form and try again. {String(createApplication.error?.message||"")}</div>}
      {!createApplication.enabled&&<div className="mt-5 rounded-2xl bg-amber-50 p-4 text-xs leading-5 text-amber-800">Application submission is not enabled for this visitor yet. The directory remains available while submission permissions are configured.</div>}
      <div className="mt-8 flex items-center justify-between border-t border-black/[0.06] pt-5">{step>1?<button onClick={()=>setStep(step-1)} className="inline-flex items-center gap-1 rounded-full bg-[#f3f4f6] px-4 py-2.5 text-xs font-semibold text-black/60"><ChevronLeft className="h-3.5 w-3.5" />Back</button>:<button onClick={onClose} className="rounded-full bg-[#f3f4f6] px-4 py-2.5 text-xs font-semibold text-black/60">Cancel</button>}{step<5?<button disabled={!stepValid} onClick={()=>setStep(step+1)} className="inline-flex items-center gap-1 rounded-full bg-black px-5 py-2.5 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-30">Continue <ChevronRight className="h-3.5 w-3.5" /></button>:<button disabled={!createApplication.enabled||createApplication.status==="pending"} onClick={submit} className="inline-flex items-center gap-2 rounded-full bg-[#0066cc] px-5 py-2.5 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40">{createApplication.status==="pending"?"Saving...":"Submit Sponsorship Application"}<Send className="h-3.5 w-3.5" /></button>}</div>
    </div>
    <style>{`.field{width:100%;min-height:46px;border-radius:14px;background:#f3f4f6;padding:11px 13px;font-size:13px;color:#1b1b1b;outline:none;border:1px solid transparent;transition:.18s}.field:focus{background:white;border-color:rgba(0,102,204,.3);box-shadow:0 0 0 3px rgba(0,102,204,.07)}.field::placeholder{color:rgba(0,0,0,.3)}`}</style>
  </DialogContent>;
}

function FormSection({eyebrow,title,subtitle,children}:{eyebrow:string;title:string;subtitle:string;children:any}){return <div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#0066cc]">{eyebrow}</p><h3 className="mt-1 text-2xl font-semibold tracking-[-.035em]">{title}</h3><p className="mt-2 text-sm text-black/45">{subtitle}</p><div className="mt-6 space-y-4">{children}</div></div>}
function Field({label,children}:{label:string;children:any}){return <label className="block"><span className="mb-2 block text-xs font-semibold text-black/60">{label}</span>{children}</label>}
function ReviewRow({label,value}:{label:string;value:string}){return <div className="flex flex-col gap-1 border-b border-black/[0.06] py-3 sm:flex-row sm:justify-between sm:gap-6"><span className="text-xs font-medium text-black/35">{label}</span><span className="max-w-md text-sm font-medium text-black/72 sm:text-right">{value}</span></div>}
function SectionLabel({children}:{children:any}){return <div className="text-[10px] font-semibold uppercase tracking-[.14em] text-black/35">{children}</div>}
function InfoCard({label,value,icon}:{label:string;value:string;icon:any}){return <div className="rounded-2xl bg-[#f3f4f6] p-4"><div className="flex items-center gap-2 text-[11px] font-medium text-black/38">{icon}{label}</div><div className="mt-2 text-sm font-semibold text-black/72">{value}</div></div>}
function ProcessRow({number,icon:Icon,title,text}:{number:string;icon:any;title:string;text:string}){return <div className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[24px] border border-black/[0.055] bg-[#f8f8f9] p-5 transition hover:bg-[#f1f5fb]"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-black text-white"><Icon className="h-4.5 w-4.5" /></div><div><div className="text-[16px] font-semibold tracking-[-.02em]">{title}</div><p className="mt-1 text-xs leading-5 text-black/45">{text}</p></div><span className="font-mono text-[10px] text-black/22">{number}</span></div>}
function SkeletonCard(){return <div className="overflow-hidden rounded-[28px] bg-white ring-1 ring-black/[0.04]"><div className="aspect-[16/8.7] animate-pulse bg-black/5" /><div className="space-y-3 p-6"><div className="h-5 w-2/3 animate-pulse rounded bg-black/5" /><div className="h-4 w-1/2 animate-pulse rounded bg-black/5" /><div className="h-16 animate-pulse rounded bg-black/5" /></div></div>}
