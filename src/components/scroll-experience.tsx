"use client";

import { useEffect, useState } from "react";

export function ScrollExperience() {
  const [progress, setProgress] = useState(0);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      setProgress(next);
      setShowHint(window.scrollY < 120);
      document.documentElement.style.setProperty("--page-scroll", String(next));
    };

    const targets = Array.from(document.querySelectorAll("main > section, body > div > section, body > div > header"));
    targets.forEach((target, index) => {
      target.setAttribute("data-scroll-reveal", "");
      (target as HTMLElement).style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 55}ms`);
    });
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && entry.target.setAttribute("data-visible", "true")),
      { rootMargin: "0px 0px -4%", threshold: 0 },
    );
    targets.forEach(target => observer.observe(target));
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
      <div className={`scroll-hint ${showHint ? "scroll-hint--visible" : ""}`} aria-hidden="true">
        <span>Scroll to explore</span><i />
      </div>
      <div className="scroll-orbit" aria-hidden="true" />
    </>
  );
}
