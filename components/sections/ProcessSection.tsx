"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import styles from "./ProcessSection.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STAGES = [
  {
    key: "briefing",
    number: "01",
    title: "Briefing",
    copy: "Entendemos o espaço, a rotina, as necessidades e a intenção do projeto.",
    image: "/images/process-briefing.jpg",
  },
  {
    key: "projeto",
    number: "02",
    title: "Projeto",
    copy: "Transformamos necessidades em proporções, materiais, soluções e detalhamento técnico.",
    image: "/images/process-design.jpg",
  },
  {
    key: "producao",
    number: "03",
    title: "Produção",
    copy: "Cada peça é fabricada com controle de medida, acabamento e montagem.",
    image: "/images/process-production.jpg",
  },
  {
    key: "instalacao",
    number: "04",
    title: "Instalação",
    copy: "A execução acontece no ambiente real, com ajuste fino e atenção aos encontros.",
    image: "/images/process-installation.jpg",
  },
  {
    key: "entrega",
    number: "05",
    title: "Entrega",
    copy: "O ambiente só termina quando tudo funciona, encaixa e permanece.",
    image: "/images/process-delivery.jpg",
  },
] as const;

type StageKey = (typeof STAGES)[number]["key"];

interface ProcessSectionProps {
  stageImagesAvailable: Record<StageKey, boolean>;
}

export function ProcessSection({ stageImagesAvailable }: ProcessSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const label = section.querySelector<HTMLElement>("[data-process-label]");
      const heading = section.querySelector<HTMLElement>("[data-process-heading]");
      const lines = section.querySelectorAll<HTMLElement>("[data-process-line]");
      const support = section.querySelector<HTMLElement>("[data-process-support]");
      const railFill = section.querySelector<HTMLElement>("[data-process-rail-fill]");
      const marks = Array.from(section.querySelectorAll<HTMLElement>("[data-process-mark]"));
      const stageEls = Array.from(section.querySelectorAll<HTMLElement>("[data-process-stage]"));
      const stageArea = section.querySelector<HTMLElement>("[data-process-stage-area]");
      const shade = section.querySelector<HTMLElement>("[data-process-shade]");
      const nextLabel = section.querySelector<HTMLElement>("[data-process-next]");

      const stageParts = stageEls.map((stage) => ({
        root: stage,
        number: stage.querySelector<HTMLElement>("[data-process-number]"),
        title: stage.querySelector<HTMLElement>("[data-process-title]"),
        copy: stage.querySelector<HTMLElement>("[data-process-copy]"),
        media: stage.querySelector<HTMLElement>("[data-process-media]"),
        surface: stage.querySelector<HTMLElement>("[data-process-surface]"),
      }));

      const allStageEls = stageParts.flatMap((part) => [part.number, part.title, part.copy, part.media]);
      const allSurfaces = stageParts.map((part) => part.surface);

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const desktop = window.matchMedia("(min-width: 768px)").matches;

      if (reducedMotion) {
        gsap.set([label, heading, support, ...allStageEls], { autoAlpha: 1, x: 0, y: 0 });
        gsap.set(stageEls, { autoAlpha: 1 });
        gsap.set(lines, { yPercent: 0 });
        gsap.set(railFill, { scaleY: 1 });
        gsap.set(marks, { opacity: 1 });
        gsap.set(allSurfaces, { scale: 1 });
        return;
      }

      if (desktop) {
          gsap.set(lines, { yPercent: 120 });
          gsap.set(railFill, { scaleY: 0 });
          gsap.set(marks, { opacity: 0.32 });
          gsap.set(stageEls, { autoAlpha: 0 });
          gsap.set(allStageEls, { autoAlpha: 0, y: "1.1rem" });
          gsap.set(allSurfaces, { scale: 1.08 });

          const stagesStart = 0.3;
          const stagesEnd = 0.94;
          const stageSpan = (stagesEnd - stagesStart) / STAGES.length;
          const stageExitDuration = stageSpan * 0.14;

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.7,
            },
          });

          timeline
            .to(label, { autoAlpha: 1, duration: 0.045, y: 0 }, 0.02)
            .to(heading, { autoAlpha: 1, duration: 0.02 }, 0.05)
            .to(lines, { duration: 0.09, stagger: 0.02, yPercent: 0 }, 0.06)
            .to(support, { autoAlpha: 1, duration: 0.05, y: 0 }, 0.09)
            .to([label, heading, support], { autoAlpha: 0, duration: 0.055 }, stagesStart - 0.055)
            .to(railFill, { duration: stagesEnd - stagesStart, scaleY: 1 }, stagesStart);

          stageParts.forEach((part, index) => {
            const start = stagesStart + index * stageSpan;
            const end = start + stageSpan;
            const isLast = index === STAGES.length - 1;

            timeline
              .to(part.root, { autoAlpha: 1, duration: 0.01 }, start)
              .to(part.number, { autoAlpha: 1, duration: 0.015, y: 0 }, start)
              .to(part.title, { autoAlpha: 1, duration: 0.018, y: 0 }, start + 0.008)
              .to(part.copy, { autoAlpha: 1, duration: 0.02, y: 0 }, start + 0.015)
              .to(part.media, { autoAlpha: 1, duration: 0.035, y: 0 }, start + 0.005)
              .to(part.surface, { duration: stageSpan, scale: 1 }, start)
              .to(marks[index], { duration: 0.03, opacity: 1 }, start);

            if (!isLast) {
              timeline
                .to(
                  [part.number, part.title, part.copy, part.media],
                  { autoAlpha: 0, duration: stageExitDuration, y: "-0.6rem" },
                  end - stageExitDuration,
                )
                .to(part.root, { autoAlpha: 0, duration: 0.01 }, end - 0.01);
            }
          });

          timeline
            .to(shade, { autoAlpha: 1, duration: 0.045 }, 0.95)
            .to(nextLabel, { autoAlpha: 1, duration: 0.025, y: 0 }, 0.975);
        return;
      }

          gsap.set(lines, { yPercent: 100 });
          gsap.set(railFill, { scaleY: 0 });
          gsap.set(allStageEls, { autoAlpha: 0, y: "1.4rem" });
          gsap.set(allSurfaces, { scale: 1.05 });

          gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: section, start: "top 75%", once: true },
          })
            .fromTo(label, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, duration: 0.5, y: 0 })
            .to(lines, { duration: 0.7, stagger: 0.12, yPercent: 0 }, "-=0.3")
            .fromTo(support, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, duration: 0.55, y: 0 }, "-=0.35");

          if (stageArea) {
            gsap.to(railFill, {
              ease: "none",
              scaleY: 1,
              scrollTrigger: { trigger: stageArea, start: "top 80%", end: "bottom 30%", scrub: 0.6 },
            });
          }

          stageParts.forEach((part, index) => {
            gsap.timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: { trigger: stageEls[index], start: "top 78%", once: true },
            })
              .to(part.number, { autoAlpha: 1, duration: 0.4, y: 0 })
              .to(part.title, { autoAlpha: 1, duration: 0.45, y: 0 }, "-=0.25")
              .to(part.copy, { autoAlpha: 1, duration: 0.45, y: 0 }, "-=0.28")
              .to(part.media, { autoAlpha: 1, duration: 0.55, y: 0 }, "-=0.3")
              .to(part.surface, { duration: 0.9, scale: 1 }, "-=0.5")
              .to(marks[index], { duration: 0.3, opacity: 1 }, "-=0.4");
          });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="processo" className={styles.section} aria-labelledby="process-heading">
      <div className={styles.scene}>
        <p className={styles.sectionLabel} data-process-label>05 / PROCESSO</p>

        <div className={styles.intro}>
          <h2 id="process-heading" className={styles.heading} data-process-heading>
            <span className={styles.lineMask}><span data-process-line>Do primeiro traço</span></span>
            <span className={styles.lineMask}><span data-process-line>ao último encaixe.</span></span>
          </h2>
          <p className={styles.support} data-process-support>
            Cada etapa é acompanhada de perto,<br />
            do entendimento do ambiente à instalação final.
          </p>
        </div>

        <div className={styles.stageArea} data-process-stage-area>
          <div className={styles.rail} aria-hidden="true">
            <span className={styles.railTrack} />
            <span className={styles.railFill} data-process-rail-fill />
            <ol className={styles.railMarks}>
              {STAGES.map((stage) => (
                <li key={stage.key} className={styles.railMark} data-process-mark={stage.number}>
                  <i />
                  <span>{stage.number}</span>
                </li>
              ))}
            </ol>
          </div>

          <ol className={styles.stages} aria-label="Etapas do processo Padrão Refinatto">
            {STAGES.map((stage) => (
              <li key={stage.key} className={styles.stage} data-process-stage={stage.number}>
                <div className={styles.stageText}>
                  <p className={styles.stageNumber} data-process-number aria-hidden="true">{stage.number}</p>
                  <h3 className={styles.stageTitle} data-process-title>{stage.title}</h3>
                  <p className={styles.stageCopy} data-process-copy>{stage.copy}</p>
                </div>
                <div className={styles.stageMedia} data-process-media aria-hidden="true">
                  <div className={styles.stageSurface} data-process-surface>
                    {stageImagesAvailable[stage.key] ? (
                      <Image
                        src={stage.image}
                        alt=""
                        fill
                        sizes="(max-width: 767px) 100vw, 46vw"
                        className={styles.stageImage}
                      />
                    ) : (
                      <div className={styles.stageFallback} />
                    )}
                  </div>
                  <div className={styles.stageVeil} />
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.exitShade} data-process-shade aria-hidden="true" />
        <p className={styles.nextLabel} data-process-next aria-hidden="true">06 / PROJETOS</p>
      </div>
    </section>
  );
}
