"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import styles from "./ProjectsSection.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PROJECTS = [
  {
    key: "aurora",
    number: "01",
    name: ["Residência", "Aurora"],
    type: "RESIDENCIAL",
    location: "GOIÁS · 2026",
    material: "NOGUEIRA · PEDRA NATURAL",
    image: "/images/project-01.jpg",
    href: "/projetos/residencia-aurora",
    alt: "Sala de estar da Residência Aurora, com marcenaria em nogueira e acabamento em pedra natural",
  },
  {
    key: "nogueira",
    number: "02",
    name: ["Casa", "Nogueira"],
    type: "RESIDENCIAL",
    location: "SÃO PAULO · 2025",
    material: "NOGUEIRA · LATÃO",
    image: "/images/project-02.jpg",
    href: "/projetos/casa-nogueira",
    alt: "Cozinha da Casa Nogueira, com marcenaria em nogueira e ferragens em latão",
  },
  {
    key: "monolith",
    number: "03",
    name: ["Apartamento", "Monolith"],
    type: "RESIDENCIAL",
    location: "SÃO PAULO · 2026",
    material: "CONCRETO · CARVALHO",
    image: "/images/project-03.jpg",
    href: "/projetos/apartamento-monolith",
    alt: "Sala de estar do Apartamento Monolith, com marcenaria em carvalho e base em concreto aparente",
  },
] as const;

type ProjectKey = (typeof PROJECTS)[number]["key"];

interface ProjectsSectionProps {
  imagesAvailable: Record<ProjectKey, boolean>;
}

export function ProjectsSection({ imagesAvailable }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const label = section.querySelector<HTMLElement>("[data-projects-label]");
      const heading = section.querySelector<HTMLElement>("[data-projects-heading]");
      const lines = section.querySelectorAll<HTMLElement>("[data-projects-line]");
      const shade = section.querySelector<HTMLElement>("[data-projects-shade]");
      const outro = section.querySelector<HTMLElement>("[data-projects-outro]");
      const projectEls = Array.from(section.querySelectorAll<HTMLElement>("[data-projects-project]"));

      const projectParts = projectEls.map((project) => ({
        root: project,
        media: project.querySelector<HTMLElement>("[data-projects-media]"),
        surface: project.querySelector<HTMLElement>("[data-projects-surface]"),
        scrim: project.querySelector<HTMLElement>("[data-projects-scrim]"),
        counter: project.querySelector<HTMLElement>("[data-projects-counter]"),
        name: project.querySelector<HTMLElement>("[data-projects-name]"),
        meta: project.querySelector<HTMLElement>("[data-projects-meta]"),
      }));

      const allContent = projectParts.flatMap((part) => [part.counter, part.name, part.meta]);
      const allSurfaces = projectParts.map((part) => part.surface);
      const allMedia = projectParts.map((part) => part.media);

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const desktop = window.matchMedia("(min-width: 768px)").matches;

      if (reducedMotion) {
        gsap.set([label, heading, ...allContent], { autoAlpha: 1, x: 0, y: 0 });
        gsap.set(lines, { yPercent: 0 });
        gsap.set(projectEls, { autoAlpha: 1 });
        gsap.set(allMedia, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(allSurfaces, { scale: 1 });
        return;
      }

      if (desktop) {
          gsap.set(lines, { yPercent: 120 });
          gsap.set(projectEls, { autoAlpha: 0 });
          gsap.set(allMedia, { clipPath: "inset(100% 0% 0% 0%)" });
          gsap.set(allContent, { autoAlpha: 0, y: "1rem" });
          gsap.set(allSurfaces, { scale: 1.03 });

          const openEnd = 0.25;
          const projectsEnd = 0.93;
          const span = (projectsEnd - openEnd) / PROJECTS.length;
          const projectExitDuration = span * 0.15;

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
            .to(label, { autoAlpha: 1, duration: 0.035, y: 0 }, 0.015)
            .to(heading, { autoAlpha: 1, duration: 0.02 }, 0.03)
            .to(lines, { duration: 0.07, stagger: 0.02, yPercent: 0 }, 0.035)
            .to([label, heading], { autoAlpha: 0, duration: 0.04 }, openEnd - 0.04);

          projectParts.forEach((part, index) => {
            const start = openEnd + index * span;
            const end = start + span;
            const isLast = index === PROJECTS.length - 1;
            const content = [part.counter, part.name, part.meta];

            timeline
              .to(part.root, { autoAlpha: 1, duration: 0.015 }, start)
              .to(part.media, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.07 }, start)
              .to(content, { autoAlpha: 1, duration: 0.035, stagger: 0.018, y: 0 }, start + 0.025)
              .to(part.surface, { duration: span, scale: 1.08 }, start);

            if (!isLast) {
              timeline
                .to(content, { autoAlpha: 0, duration: projectExitDuration, y: "-0.6rem" }, end - projectExitDuration)
                .to(part.scrim, { duration: projectExitDuration, opacity: 1 }, end - projectExitDuration)
                .to(part.root, { autoAlpha: 0, duration: projectExitDuration * 0.6 }, end - projectExitDuration * 0.6);
            }
          });

          const lastContent = projectParts[projectParts.length - 1];
          timeline
            .to(shade, { autoAlpha: 1, duration: 0.045 }, projectsEnd)
            .to([lastContent.counter, lastContent.name, lastContent.meta], { autoAlpha: 0, duration: 0.035 }, projectsEnd + 0.005)
            .to(outro, { autoAlpha: 1, duration: 0.035, y: 0 }, projectsEnd + 0.025);
        return;
      }

          gsap.set(lines, { yPercent: 100 });
          gsap.set(projectEls, { autoAlpha: 0 });
          gsap.set(allContent, { autoAlpha: 0, y: "1.2rem" });
          gsap.set(allMedia, { clipPath: "inset(0% 0% 0% 0%)" });
          gsap.set(allSurfaces, { scale: 1.05 });

          gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: section, start: "top 75%", once: true },
          })
            .fromTo(label, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, duration: 0.5, y: 0 })
            .to(lines, { duration: 0.7, stagger: 0.12, yPercent: 0 }, "-=0.3");

          projectParts.forEach((part) => {
            const content = [part.counter, part.name, part.meta];

            gsap.timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: { trigger: part.root, start: "top 78%", once: true },
            })
              .to(part.root, { autoAlpha: 1, duration: 0.5 })
              .to(content, { autoAlpha: 1, duration: 0.5, stagger: 0.08, y: 0 }, "-=0.3")
              .to(part.surface, { duration: 0.9, scale: 1 }, "-=0.5");
          });

          gsap.fromTo(
            outro,
            { autoAlpha: 0, y: 14 },
            {
              autoAlpha: 1,
              duration: 0.5,
              y: 0,
              scrollTrigger: { trigger: outro, start: "top 85%", once: true },
            },
          );
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="projetos" className={styles.section} aria-labelledby="projects-heading">
      <div className={styles.scene}>
        <div className={styles.intro}>
          <p className={styles.sectionLabel} data-projects-label>06 / PROJETOS</p>
          <h2 id="projects-heading" className={styles.heading} data-projects-heading>
            <span className={styles.lineMask}><span data-projects-line>Projetos que</span></span>
            <span className={styles.lineMask}><span data-projects-line>permanecem.</span></span>
          </h2>
        </div>

        <ol className={styles.projects} aria-label="Projetos em destaque">
          {PROJECTS.map((project, index) => (
            <li key={project.key} className={styles.project} data-projects-project={project.number}>
              <div className={styles.media} data-projects-media>
                <div className={styles.surface} data-projects-surface>
                  {imagesAvailable[project.key] ? (
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      priority={index === 0}
                      sizes="100vw"
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.fallback} aria-hidden="true" />
                  )}
                </div>
                <div className={styles.overlay} aria-hidden="true" />
                <div className={styles.scrim} data-projects-scrim aria-hidden="true" />
              </div>

              <div className={styles.content}>
                <p className={styles.counter} data-projects-counter aria-hidden="true">
                  {project.number} / 0{PROJECTS.length}
                </p>
                <h3 className={styles.name} data-projects-name>
                  {project.name.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h3>
                <p className={styles.meta} data-projects-meta>
                  {project.type}
                  <br />
                  {project.location}
                  <br />
                  <span className={styles.metaSecondary}>{project.material}</span>
                </p>
                <a className={styles.link} href={project.href}>
                  VER PROJETO <span aria-hidden="true">↗</span>
                </a>
              </div>
            </li>
          ))}
        </ol>

        <div className={styles.exitShade} data-projects-shade aria-hidden="true" />
        <p className={styles.outro} data-projects-outro>
          Cada projeto começa
          <br />
          com uma conversa.
        </p>
      </div>
    </section>
  );
}
