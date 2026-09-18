import { ArrowUpRight, Building2, GraduationCap } from "lucide-react";

export function StudentCompanyStory({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="relative overflow-hidden bg-[#07101d] text-white">
      <div className="eng-grid absolute inset-0 opacity-45" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-7 lg:px-8 lg:py-28">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-blue-300">Where sponsorship becomes progress</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-.05em] sm:text-5xl">Students bring the ambition.<br />Companies bring momentum.</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/52">The strongest sponsorships are working relationships: real projects, useful products, practical expertise and a clear path from introduction to impact.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
          <figure className="story-image group relative min-h-[410px] overflow-hidden rounded-[34px] border border-white/10">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Formula_student_teams_photo.jpg" alt="Formula Student teams gathered with their race cars" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <figcaption className="absolute bottom-0 p-6 sm:p-8"><span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-semibold backdrop-blur"><GraduationCap className="h-3.5 w-3.5" /> Student teams</span><p className="mt-3 max-w-lg text-2xl font-semibold">Hands-on support for the work happening in the lab.</p></figcaption>
          </figure>
          <figure className="story-image group relative min-h-[410px] overflow-hidden rounded-[34px] border border-white/10">
            <img src="https://images.pexels.com/photos/7869041/pexels-photo-7869041.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="Students collaborating on a robotics project in a workshop" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <figcaption className="absolute bottom-0 p-6 sm:p-8"><span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-semibold backdrop-blur"><Building2 className="h-3.5 w-3.5" /> Company connection</span><p className="mt-3 text-2xl font-semibold">Make the introduction worth having.</p><button onClick={onExplore} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-200 transition hover:text-white">Explore sponsors <ArrowUpRight className="h-4 w-4" /></button></figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
