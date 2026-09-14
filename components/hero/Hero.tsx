"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { WHATSAPP_URL } from "@/lib/contact";
import styles from "./Hero.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const hero = heroRef.current;
      const video = videoRef.current;

      if (!hero || !video) return;

      const introElements = hero.querySelectorAll<HTMLElement>("[data-hero-intro]");
      const headlineLines = hero.querySelectorAll<HTMLElement>("[data-hero-line]");
      const navbar = hero.querySelector<HTMLElement>("[data-hero-nav]");
      const eyebrow = hero.querySelector<HTMLElement>("[data-hero-eyebrow]");
      const copy = hero.querySelector<HTMLElement>("[data-hero-copy]");
      const cta = hero.querySelector<HTMLElement>("[data-hero-cta]");
      const scrollIndicator = hero.querySelector<HTMLElement>("[data-hero-scroll]");
      const content = hero.querySelector<HTMLElement>("[data-hero-content]");
      const scrollOverlay = hero.querySelector<HTMLElement>("[data-hero-overlay]");
      const transition = hero.querySelector<HTMLElement>("[data-hero-transition]");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(introElements, { autoAlpha: 1, x: 0, y: 0 });
        gsap.set(headlineLines, { yPercent: 0 });
        return;
      }

      gsap.set(headlineLines, { yPercent: 110 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(navbar, { autoAlpha: 0, y: -18 }, { autoAlpha: 1, duration: 0.7, y: 0 })
        .fromTo(eyebrow, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, duration: 0.55, y: 0 }, "-=0.3")
        .to(headlineLines, { duration: 1.05, stagger: 0.14, yPercent: 0 }, "-=0.16")
        .fromTo(copy, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, duration: 0.7, y: 0 }, "-=0.5")
        .fromTo(cta, { autoAlpha: 0, x: -16 }, { autoAlpha: 1, duration: 0.6, x: 0 }, "-=0.48")
        .fromTo(scrollIndicator, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, duration: 0.6, y: 0 }, "-=0.38");

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
        })
        .to(video, { scale: 1.055, yPercent: 2.5 }, 0)
        .to(content, { autoAlpha: 0, yPercent: -12 }, 0)
        .to(scrollOverlay, { autoAlpha: 0.84 }, 0)
        .to(transition, { autoAlpha: 1 }, 0);
    },
    { scope: heroRef },
  );

  return (
    <section ref={heroRef} id="top" className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.videoLayer} aria-hidden="true">
        <video
          ref={videoRef}
          autoPlay
          className={styles.video}
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/hero-poster.jpg"
        >
          <source media="(max-width: 767px)" src="/video/hero-mobile.mp4" type="video/mp4" />
          <source src="/video/hero-desktop.mp4" type="video/mp4" />
        </video>
      </div>

      <div className={styles.topOverlay} aria-hidden="true" />
      <div className={styles.baseOverlay} aria-hidden="true" />
      <div className={styles.scrollOverlay} data-hero-overlay aria-hidden="true" />
      <div className={styles.heroTransition} data-hero-transition aria-hidden="true" />

      <header className={styles.header} data-hero-intro data-hero-nav>
        <a className={styles.brand} href="#top" aria-label="Padrão Refinatto, início">
          <Image
            alt=""
            className={styles.brandLogo}
            height={72}
            priority
            src="/images/logo.png"
            width={72}
          />
        </a>
        <nav className={styles.navigation} aria-label="Navegação principal">
          <a href="#projetos">PROJETOS</a><a href="#processo">PROCESSO</a><a href="#materia">ATELIÊ</a><a href="#contato">CONTATO</a>
        </nav>
        <a className={styles.projectLink} href={WHATSAPP_URL} target="_blank" rel="noreferrer">
          INICIAR PROJETO <span aria-hidden="true">↗</span>
        </a>
        <button className={styles.menuButton} type="button" aria-label="Abrir menu" aria-expanded="false"><span /><span /></button>
      </header>

      <div className={styles.content} data-hero-content>
        <p className={styles.eyebrow} data-hero-intro data-hero-eyebrow>
          MARCENARIA AUTORAL <span aria-hidden="true">·</span> INTERIORES SOB MEDIDA
        </p>
        <h1 id="hero-heading" className={styles.heading}>
          <span className={styles.lineMask}><span data-hero-line>Matéria transformada</span></span>
          <span className={styles.lineMask}><span data-hero-line>em arquitetura.</span></span>
        </h1>
        <p className={styles.copy} data-hero-intro data-hero-copy>
          Projetamos e construímos mobiliário sob medida com precisão, materialidade e permanência.
        </p>
        <a className={styles.cta} data-hero-intro data-hero-cta href="#materia">
          <span>CONHEÇA NOSSO PROCESSO</span><i aria-hidden="true" /><b aria-hidden="true">↘</b>
        </a>
      </div>

      <a className={styles.scrollIndicator} data-hero-intro data-hero-scroll href="#materia">
        <span>SCROLL</span><i aria-hidden="true" />
      </a>
    </section>
  );
}
