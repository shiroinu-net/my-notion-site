"use client";
import { useEffect } from "react";

export default function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("rs-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08 }
    );

    const observe = () => {
      document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    };

    observe();
    // Re-observe on route change (Next.js SPA navigation)
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
