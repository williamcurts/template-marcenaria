"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import detailIntegratedLight from "@/public/images/detail-integrated-light.png";
import detailPrecisionDrawer from "@/public/images/detail-precision-drawer.png";
import detailSoftCloseHinge from "@/public/images/detail-soft-close-hinge.png";
import detailWalnutSlats from "@/public/images/detail-walnut-slats.png";
import styles from "./DetailSection.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function DetailSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const label = section.querySelector<HTMLElement>("[data-detail-label]");
      const primary = section.querySelector<HTMLElement>("[data-detail-primary]");
      const primarySurface = section.querySelector<HTMLElement>("[data-detail-primary-surface]");
      const content = section.querySelector<HTMLElement>("[data-detail-content]");
      const heading = section.querySelector<HTMLElement>("[data-detail-heading]");
      const lines = section.querySelectorAll<HTMLElement>("[data-detail-line]");
      const copy = section.querySelector<HTMLElement>("[data-detail-copy]");
      const secondaryMedia = section.querySelectorAll<HTMLElement>("[data-detail-media]");
      const secondarySurfaces = section.querySelectorAll<HTMLElement>("[data-detail-surface]");
      const technicalLabels = section.querySelectorAll<HTMLElement>("[data-detail-tech]");
      const technicalRules = section.querySelectorAll<HTMLElement>("[data-detail-rule]");
      const shade = section.querySelector<HTMLElement>("[data-detail-shade]");
      const nextSection = section.querySelector<HTMLElement>("[data-detail-next]");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([label, primary, content, heading, copy, secondaryMedia, technicalLabels], {
          autoAlpha: 1,
          x: 0,
          y: 0,
        });
        gsap.set(lines, { yPercent: 0 });
        gsap.set(technicalRules, { scaleX: 1 });
        gsap.set(primary, { clipPath: "inset(0% 0% 0% 0%)" });
        return;
      }

      gsap.set(lines, { yPercent: 140 });
      gsap.set(technicalRules, { scaleX: 0 });

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
        .to(label, { autoAlpha: 1, duration: 0.055, y: 0 }, 0.025)
        .to(primary, { autoAlpha: 1, duration: 0.13, y: 0 }, 0.055)
        .to(heading, { autoAlpha: 1, duration: 0.015 }, 0.115)
        .to(lines, { duration: 0.1, stagger: 0.025, yPercent: 0 }, 0.13)
        .to(copy, { autoAlpha: 1, duration: 0.075, y: 0 }, 0.205)
        .to(content, { autoAlpha: 0, duration: 0.07, yPercent: -3 }, 0.44)
        .to(primary, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.24 }, 0.49)
        .to(secondaryMedia, { autoAlpha: 1, duration: 0.08, stagger: 0.03, y: 0 }, 0.53)
        .to(technicalLabels, { autoAlpha: 1, duration: 0.065, stagger: 0.025 }, 0.56)
        .to(technicalRules, { duration: 0.065, scaleX: 1, stagger: 0.018 }, 0.58)
        .to(primarySurface, { duration: 0.68, scale: 1.15, yPercent: -5 }, 0.18)
        .to(secondarySurfaces, { duration: 0.42, stagger: 0.025, yPercent: -9 }, 0.34)
        .to(secondaryMedia, { autoAlpha: 0, duration: 0.07 }, 0.74)
        .to([technicalLabels, technicalRules], { autoAlpha: 0, duration: 0.07 }, 0.75)
        .to(primary, { autoAlpha: 0, duration: 0.14 }, 0.77)
        .to(shade, { autoAlpha: 1, duration: 0.09 }, 0.89)
        .to(nextSection, { autoAlpha: 1, duration: 0.04, y: 0 }, 0.96);
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="detalhe" className={styles.section} aria-labelledby="detail-heading">
      <div className={styles.scene}>
        <div className={styles.primaryImage} data-detail-primary aria-hidden="true">
          <div className={`${styles.mediaSurface} ${styles.woodSurface}`} data-detail-primary-surface>
            <Image
              src={detailWalnutSlats}
              alt=""
              fill
              placeholder="blur"
              sizes="100vw"
              className={`${styles.mediaImage} ${styles.woodImage}`}
            />
          </div>
          <div className={styles.imageVeil} />
        </div>

        <div className={`${styles.secondaryImage} ${styles.hardwareImage}`} data-detail-media aria-hidden="true">
          <div className={`${styles.mediaSurface} ${styles.hardwareSurface}`} data-detail-surface>
            <Image
              src={detailSoftCloseHinge}
              alt=""
              fill
              placeholder="blur"
              sizes="(max-width: 767px) 38vw, 20vw"
              className={`${styles.mediaImage} ${styles.hardwarePhoto}`}
            />
          </div>
        </div>
        <div className={`${styles.secondaryImage} ${styles.jointImage}`} data-detail-media aria-hidden="true">
          <div className={`${styles.mediaSurface} ${styles.jointSurface}`} data-detail-surface>
            <Image
              src={detailPrecisionDrawer}
              alt=""
              fill
              placeholder="blur"
              sizes="(max-width: 767px) 48vw, 31vw"
              className={`${styles.mediaImage} ${styles.drawerPhoto}`}
            />
          </div>
        </div>
        <div className={`${styles.secondaryImage} ${styles.lightImage}`} data-detail-media aria-hidden="true">
          <div className={`${styles.mediaSurface} ${styles.lightSurface}`} data-detail-surface>
            <Image
              src={detailIntegratedLight}
              alt=""
              fill
              placeholder="blur"
              sizes="(max-width: 767px) 34vw, 18vw"
              className={`${styles.mediaImage} ${styles.lightPhoto}`}
            />
          </div>
        </div>

        <div className={styles.content} data-detail-content>
          <p className={styles.eyebrow} data-detail-label>03 / DETALHE</p>
          <h2 id="detail-heading" className={styles.heading} data-detail-heading>
            <span className={styles.lineMask}><span data-detail-line>O luxo mora</span></span>
            <span className={styles.lineMask}><span data-detail-line>no detalhe.</span></span>
          </h2>
          <p className={styles.copy} data-detail-copy>
            Textura, alinhamento, ferragens e acabamento.<br />
            Cada escolha existe para ser percebida no uso.
          </p>
        </div>

        <ul className={styles.technicalLabels} aria-label="Detalhes construtivos">
          <li className={styles.woodLabel} data-detail-tech>
            <span>VEIO / SELECIONADO</span><i data-detail-rule aria-hidden="true" />
          </li>
          <li className={styles.hardwareLabel} data-detail-tech>
            <span>FERRAGEM / SOFT-CLOSE</span><i data-detail-rule aria-hidden="true" />
          </li>
          <li className={styles.jointLabel} data-detail-tech>
            <span>ENCAIXE / PRECISÃO</span><i data-detail-rule aria-hidden="true" />
          </li>
          <li className={styles.lightLabel} data-detail-tech>
            <span>LUZ / INTEGRADA</span><i data-detail-rule aria-hidden="true" />
          </li>
        </ul>

        <div className={styles.exitShade} data-detail-shade aria-hidden="true" />
        <p className={styles.nextLabel} data-detail-next aria-hidden="true">04 / PROJETO DESTAQUE</p>
      </div>
    </section>
  );
}
