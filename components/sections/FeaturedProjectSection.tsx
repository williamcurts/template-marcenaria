"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import styles from "./FeaturedProjectSection.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface FeaturedProjectSectionProps {
  imageAvailable: boolean;
}

export function FeaturedProjectSection({ imageAvailable }: FeaturedProjectSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const label = section.querySelector<HTMLElement>("[data-project-label]");
      const identity = section.querySelector<HTMLElement>("[data-project-identity]");
      const frame = section.querySelector<HTMLElement>("[data-project-frame]");
      const veil = section.querySelector<HTMLElement>("[data-project-veil]");
      const heading = section.querySelector<HTMLElement>("[data-project-heading]");
      const lines = section.querySelectorAll<HTMLElement>("[data-project-line]");
      const infoItems = section.querySelectorAll<HTMLElement>("[data-project-info-item]");
      const tag = section.querySelector<HTMLElement>("[data-project-tag]");
      const shade = section.querySelector<HTMLElement>("[data-project-shade]");
      const nextLabel = section.querySelector<HTMLElement>("[data-project-next]");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([label, identity, frame, heading, tag], { autoAlpha: 1, x: 0, y: 0 });
        gsap.set(lines, { yPercent: 0 });
        gsap.set(infoItems, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(lines, { yPercent: 120 });

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
        .to(identity, { autoAlpha: 1, duration: 0.045, y: 0 }, 0.05)
        .to(frame, { autoAlpha: 1, duration: 0.09, y: 0 }, 0.07)
        .to(heading, { autoAlpha: 1, duration: 0.02 }, 0.15)
        .to(lines, { duration: 0.09, stagger: 0.02, yPercent: 0 }, 0.16)
        .to([label, identity], { autoAlpha: 0, duration: 0.05 }, 0.37)
        .to(heading, { autoAlpha: 0, duration: 0.06 }, 0.42)
        .to(
          frame,
          { bottom: 0, borderRadius: 0, duration: 0.35, left: 0, right: 0, top: 0 },
          0.43,
        )
        .to(veil, { duration: 0.25, opacity: 0.45 }, 0.55)
        .to(infoItems, { autoAlpha: 1, duration: 0.04, stagger: 0.02, y: 0 }, 0.56)
        .to(infoItems, { autoAlpha: 0, duration: 0.045, stagger: 0.018 }, 0.79)
        .to(tag, { autoAlpha: 1, duration: 0.04, y: 0 }, 0.8)
        .to(tag, { autoAlpha: 0, duration: 0.04 }, 0.91)
        .to(shade, { autoAlpha: 1, duration: 0.07 }, 0.91)
        .to(nextLabel, { autoAlpha: 1, duration: 0.03, y: 0 }, 0.97);
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="projeto-destaque" className={styles.section} aria-labelledby="project-heading">
      <div className={styles.scene}>
        <p className={styles.sectionLabel} data-project-label>04 / PROJETO</p>
        <p className={styles.identity} data-project-identity>
          RESIDÊNCIA AURORA<br />GOIÁS · 2026
        </p>

        <div className={styles.frame} data-project-frame>
          <div className={styles.surface} data-project-surface>
            {imageAvailable ? (
              <Image
                src="/images/desenho-projeto.png"
                alt="Desenho de projeto de uma sala integrada com marcenaria sob medida em nogueira"
                fill
                sizes="100vw"
                className={styles.image}
              />
            ) : (
              <div className={styles.fallback} aria-hidden="true" />
            )}
          </div>
          <div className={styles.veil} data-project-veil aria-hidden="true" />
        </div>

        <h2 id="project-heading" className={styles.heading} data-project-heading>
          <span className={styles.lineMask}><span data-project-line>Da matéria</span></span>
          <span className={styles.lineMask}><span data-project-line>ao ambiente.</span></span>
        </h2>

        <dl className={styles.info} aria-label="Dados do projeto">
          <div data-project-info-item><dt>TIPO</dt><dd>RESIDENCIAL</dd></div>
          <div data-project-info-item><dt>AMBIENTES</dt><dd>06</dd></div>
          <div data-project-info-item><dt>MATERIAL</dt><dd>NOGUEIRA</dd></div>
          <div data-project-info-item><dt>EXECUÇÃO</dt><dd>SOB MEDIDA</dd></div>
        </dl>

        <p className={styles.tag} data-project-tag aria-hidden="true">
          RESIDÊNCIA AURORA<br />MARCENARIA COMPLETA
        </p>

        <div className={styles.exitShade} data-project-shade aria-hidden="true" />
        <p className={styles.nextLabel} data-project-next aria-hidden="true">05 / PROCESSO</p>
      </div>
    </section>
  );
}
