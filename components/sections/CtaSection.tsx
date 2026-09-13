"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import styles from "./CtaSection.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const eyebrow = section.querySelector<HTMLElement>("[data-cta-eyebrow]");
      const lines = section.querySelectorAll<HTMLElement>("[data-cta-line]");
      const support = section.querySelector<HTMLElement>("[data-cta-support]");
      const cta = section.querySelector<HTMLElement>("[data-cta-link]");
      const footer = section.querySelector<HTMLElement>("[data-cta-footer]");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([eyebrow, support, cta, footer], { autoAlpha: 1, x: 0, y: 0 });
        gsap.set(lines, { yPercent: 0 });
        return;
      }

      gsap.set(lines, { yPercent: 130 });

      gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: section, start: "top 70%", once: true },
      })
        .fromTo(eyebrow, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, duration: 0.55, y: 0 })
        .to(lines, { duration: 1, stagger: 0.18, yPercent: 0 }, "-=0.25")
        .fromTo(support, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, duration: 0.6, y: 0 }, "-=0.5")
        .fromTo(cta, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, duration: 0.6, y: 0 }, "-=0.35")
        .fromTo(footer, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, duration: 0.55, y: 0 }, "-=0.3");
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="contato" className={styles.section} aria-labelledby="cta-heading">
      <p className={styles.eyebrow} data-cta-eyebrow>07 / CONTATO</p>

      <div className={styles.main}>
        <h2 id="cta-heading" className={styles.heading}>
          <span className={styles.lineMask}><span data-cta-line>Seu próximo ambiente</span></span>
          <span className={styles.lineMask}><span data-cta-line>começa aqui.</span></span>
        </h2>

        <p className={styles.support} data-cta-support>
          Conte-nos sobre o espaço.<br />
          O restante começa com uma conversa.
        </p>

        <a className={styles.cta} data-cta-link href="#contato">
          <span>INICIAR PROJETO</span><i aria-hidden="true" /><b aria-hidden="true">↗</b>
        </a>
      </div>

      <footer className={styles.footer} data-cta-footer>
        <p className={styles.brandTag}>PADRÃO REFINATTO<br />MARCENARIA</p>
        <p className={styles.rights}>© 2026 PADRÃO REFINATTO<br />TODOS OS DIREITOS RESERVADOS</p>
      </footer>
    </section>
  );
}
