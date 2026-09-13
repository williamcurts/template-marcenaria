"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import styles from "./MaterialSection.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function MaterialSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const label = section.querySelector<HTMLElement>("[data-material-label]");
      const image = section.querySelector<HTMLElement>("[data-material-image]");
      const videoTilt = section.querySelector<HTMLElement>("[data-material-video-tilt]");
      const lines = section.querySelectorAll<HTMLElement>("[data-material-line]");
      const copy = section.querySelector<HTMLElement>("[data-material-copy]");
      const technicalLine = section.querySelector<HTMLElement>("[data-material-rule]");
      const technicalLabels = section.querySelectorAll<HTMLElement>("[data-material-tech]");
      const word = section.querySelector<HTMLElement>("[data-material-word]");
      const content = section.querySelector<HTMLElement>("[data-material-content]");
      const scene = section.querySelector<HTMLElement>("[data-material-scene]");
      const exit = section.querySelector<HTMLElement>("[data-material-exit]");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([label, image, copy, technicalLine, technicalLabels, word], { autoAlpha: 1, x: 0, y: 0 });
        gsap.set(lines, { yPercent: 0 });
        gsap.set(technicalLine, { scaleX: 1 });
        return;
      }

      gsap.set(lines, { yPercent: 112 });

      gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: section, start: "top 92%", once: true },
      })
        .fromTo(label, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, duration: 0.5, y: 0 })
        .fromTo(image, { autoAlpha: 0, scale: 0.96, y: 28 }, { autoAlpha: 1, duration: 1.15, scale: 1, y: 0 }, "-=0.12")
        .to(lines, { duration: 1.05, stagger: 0.14, yPercent: 0 }, "-=0.7")
        .fromTo(copy, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, duration: 0.65, y: 0 }, "-=0.5")
        .fromTo(technicalLine, { scaleX: 0 }, { duration: 0.8, scaleX: 1 }, "-=0.35")
        .fromTo(technicalLabels, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, duration: 0.55, stagger: 0.12, y: 0 }, "-=0.5")
        .fromTo(word, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, duration: 0.55, y: 0 }, "-=0.35");

      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.6 },
      })
        .to(image, { duration: 2.5, scale: 1.07, yPercent: -3 }, 0)
        .to(content, { duration: 2.5, yPercent: -4 }, 0)
        .to(word, { duration: 1.7, letterSpacing: "0.58em" }, 0.45)
        .to(scene, { backgroundColor: "#070706", duration: 0.9 }, 2.15)
        .to([image, copy, technicalLabels, technicalLine], { autoAlpha: 0, duration: 0.85 }, 2.45)
        .to(lines, { autoAlpha: 0, duration: 0.75, yPercent: -10 }, 2.58)
        .to([label, word], { autoAlpha: 0, duration: 0.55 }, 2.72)
        .to(exit, { autoAlpha: 1, duration: 0.7, y: 0 }, 3.02);

      if (!image || !videoTilt || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const rotateX = gsap.quickTo(videoTilt, "rotationX", { duration: 0.7, ease: "power3.out" });
      const rotateY = gsap.quickTo(videoTilt, "rotationY", { duration: 0.7, ease: "power3.out" });
      const moveX = gsap.quickTo(videoTilt, "x", { duration: 0.8, ease: "power3.out" });
      const moveY = gsap.quickTo(videoTilt, "y", { duration: 0.8, ease: "power3.out" });

      const handlePointerMove = (event: PointerEvent) => {
        const bounds = image.getBoundingClientRect();
        const normalizedX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        const normalizedY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

        rotateX(normalizedY * -2.2);
        rotateY(normalizedX * 3.2);
        moveX(normalizedX * 4);
        moveY(normalizedY * 3);
        videoTilt.style.setProperty("--pointer-x", `${(normalizedX + 1) * 50}%`);
        videoTilt.style.setProperty("--pointer-y", `${(normalizedY + 1) * 50}%`);
        videoTilt.style.setProperty("--pointer-active", "1");
      };

      const handlePointerLeave = () => {
        rotateX(0);
        rotateY(0);
        moveX(0);
        moveY(0);
        videoTilt.style.setProperty("--pointer-x", "50%");
        videoTilt.style.setProperty("--pointer-y", "50%");
        videoTilt.style.setProperty("--pointer-active", "0");
      };

      image.addEventListener("pointermove", handlePointerMove);
      image.addEventListener("pointerleave", handlePointerLeave);

      return () => {
        image.removeEventListener("pointermove", handlePointerMove);
        image.removeEventListener("pointerleave", handlePointerLeave);
        gsap.killTweensOf(videoTilt);
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="materia" className={styles.section} aria-labelledby="material-heading">
      <div className={styles.scene} data-material-scene>
        <div className={styles.texture} aria-hidden="true" />
        <div className={styles.imageStage} data-material-image aria-hidden="true">
          <div className={styles.videoTilt} data-material-video-tilt>
            <video
              className={styles.materialVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/images/material-poster.jpg"
              tabIndex={-1}
            >
              <source src="/video/High_end_luxury_woodworking_co.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <div className={styles.content} data-material-content>
          <p className={styles.eyebrow} data-material-label>01 / MATÉRIA</p>
          <h2 id="material-heading" className={styles.heading}>
            <span className={styles.lineMask}><span data-material-line>Tudo começa</span></span>
            <span className={styles.lineMask}><span data-material-line>na matéria.</span></span>
          </h2>
          <p className={styles.copy} data-material-copy>Selecionamos cada superfície pelo veio, pela textura e pela forma como a luz reage à matéria.</p>
        </div>
        <div className={styles.technical}>
          <div className={styles.technicalRule} data-material-rule aria-hidden="true" />
          <dl>
            <div data-material-tech><dt>MATERIAL</dt><dd>NOGUEIRA</dd></div>
            <div data-material-tech><dt>TEXTURA</dt><dd>VEIO SELECIONADO</dd></div>
            <div data-material-tech><dt>ACABAMENTO</dt><dd>ACETINADO</dd></div>
          </dl>
        </div>
        <p className={styles.materialWord} data-material-word aria-hidden="true">MATÉRIA</p>
        <p className={styles.exitWord} data-material-exit aria-hidden="true">PRECISÃO</p>
      </div>
    </section>
  );
}
