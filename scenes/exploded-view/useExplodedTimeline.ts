"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject, useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export interface ExplosionProgress {
  value: number;
}

export function useExplodedTimeline(sectionRef: RefObject<HTMLElement | null>) {
  const progress = useRef<ExplosionProgress>({ value: 0 });

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const canvas = section.querySelector<HTMLElement>("[data-precision-canvas]");
      const sectionLabel = section.querySelector<HTMLElement>("[data-precision-section-label]");
      const editorial = section.querySelector<HTMLElement>("[data-precision-editorial]");
      const callouts = Array.from(section.querySelectorAll<HTMLElement>("[data-precision-callout]"));
      const rail = section.querySelector<HTMLElement>("[data-precision-progress]");
      const exit = section.querySelector<HTMLElement>("[data-precision-exit]");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = window.matchMedia("(max-width: 767px)").matches;

      if (reducedMotion) {
        progress.current.value = 0;
        gsap.set([canvas, sectionLabel, editorial, callouts, rail], { autoAlpha: 1, clearProps: "transform" });
        gsap.set(exit, { autoAlpha: 0 });
        return;
      }

      const callout = (name: string) => callouts.find((item) => item.dataset.precisionCallout === name);
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      timeline
        .to(progress.current, { duration: 1, value: 1 }, 0)
        .fromTo(sectionLabel, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, duration: 0.09, y: 0 }, 0.02)
        .fromTo(canvas, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.19 }, 0.12)
        .fromTo(rail, { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, duration: 0.82, scaleY: 1 }, 0.08);

      const stages: Array<[HTMLElement | undefined, number]> = [
        [callout("structure"), 0.36],
        [callout("hardware"), 0.47],
        [callout("drawer"), 0.58],
        [callout("led"), 0.69],
      ];

      let previousCallout: HTMLElement | undefined;
      stages.forEach(([target, position]) => {
        if (target) {
          const line = target.querySelector<HTMLElement>("i");
          timeline.fromTo(target, { autoAlpha: 0, x: 10 }, { autoAlpha: 1, duration: 0.09, x: 0 }, position);
          if (line) {
            timeline.fromTo(line, { scaleX: 0 }, { duration: 0.13, ease: "power2.out", scaleX: 1 }, position + 0.01);
          }
          if (previousCallout) {
            timeline.to(previousCallout, { autoAlpha: mobile ? 0 : 0.32, duration: 0.09 }, position);
          }
          previousCallout = target;
        }
      });

      timeline
        .fromTo(editorial, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, duration: 0.12, y: 0 }, 0.57)
        .to(callouts, { autoAlpha: 0, duration: 0.08 }, 0.78)
        .to(editorial, { autoAlpha: 0, duration: 0.1, y: -8 }, 0.8)
        .to(sectionLabel, { autoAlpha: 0, duration: 0.08 }, 0.9)
        .to(canvas, { autoAlpha: 0.12, duration: 0.08 }, 0.92)
        .fromTo(exit, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, duration: 0.04, y: 0 }, 0.96);
    },
    { scope: sectionRef },
  );

  return progress;
}
