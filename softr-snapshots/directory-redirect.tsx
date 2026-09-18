import { useEffect } from "react";
import { ArrowRight, Building2 } from "lucide-react";

export default function Block(){
  useEffect(()=>{
    const timer=window.setTimeout(()=>window.location.replace("/sponsors"),120);
    return ()=>window.clearTimeout(timer);
  },[]);
  return <div className="min-h-[70vh] bg-[#f5f5f7] px-5 py-24 text-[#111827]">
    <div className="mx-auto max-w-3xl overflow-hidden rounded-[32px] border border-black/[.06] bg-white p-8 text-center shadow-[0_20px_70px_rgba(0,0,0,.08)] sm:p-12">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-[18px] bg-black text-white shadow-xl"><Building2 className="h-5 w-5"/></div>
      <h1 className="mt-6 text-3xl font-semibold tracking-[-.045em] text-[#111827]">Opening the sponsor directory…</h1>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#626874]">The engineering sponsor directory now lives in one canonical place so filters, sponsor cards, applications, and program status stay consistent.</p>
      <a href="/sponsors" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0071e3] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,113,227,.24)] transition hover:-translate-y-0.5 hover:bg-[#0077ed]">Open sponsor directory <ArrowRight className="h-4 w-4"/></a>
    </div>
  </div>
}