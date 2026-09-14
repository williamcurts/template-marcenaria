"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { GOOGLE_REVIEWS_URL } from "@/lib/contact";
import styles from "./ReviewsSection.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const REVIEWS = [
  {
    author: "Lucia Maria do Nascimento",
    text: "Muito satisfeita, super recomendo, excelente trabalho, entrega no prazo!",
    image: "/images/reviews/lucia-maria-do-nascimento.jpg",
  },
  {
    author: "Nuno Viana",
    text: "Excelente profissional, material de primeira e acabamento refinado.",
    image: "/images/reviews/nuno-viana.jpg",
  },
  {
    author: "Nildinha Florêncio",
    text: "Capricho, ótimo profissionalismo, muita simpatia e pontualidade, adorei.",
    image: "/images/reviews/nildinha-florencio.jpg",
  },
] as const;

export function ReviewsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const intro = section.querySelectorAll<HTMLElement>("[data-review-intro]");
      const cards = section.querySelectorAll<HTMLElement>("[data-review-card]");
      const map = section.querySelector<HTMLElement>("[data-review-map]");
      const footer = section.querySelector<HTMLElement>("[data-review-footer]");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([...intro, ...cards, map, footer], { autoAlpha: 1, x: 0, y: 0 });
        return;
      }

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: section, start: "top 72%", once: true },
        })
        .fromTo(intro, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, duration: 0.65, stagger: 0.1, y: 0 })
        .fromTo(cards, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, duration: 0.75, stagger: 0.12, y: 0 }, "-=0.35")
        .fromTo(map, { autoAlpha: 0, x: 28 }, { autoAlpha: 1, duration: 0.8, x: 0 }, "-=0.85")
        .fromTo(footer, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, duration: 0.6, y: 0 }, "-=0.3");
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="avaliacoes" className={styles.section} aria-labelledby="reviews-heading">
      <div className={styles.header}>
        <div className={styles.headerMeta}>
          <p className={styles.eyebrow} data-review-intro>07 / AVALIAÇÕES</p>
        </div>

        <h2 id="reviews-heading" className={styles.heading} data-review-intro>
          Feito para permanecer.<br />Lembrado por quem vive.
        </h2>

        <div className={styles.score} data-review-intro aria-label="Nota 5 de 5 baseada em 111 avaliações no Google">
          <Image
            alt=""
            aria-hidden="true"
            className={styles.googleLogo}
            height={40}
            src="/images/google-g.svg"
            width={40}
          />
          <span className={styles.scoreNumber}>5,0</span>
          <span className={styles.scoreMeta}>
            <span className={styles.stars} aria-hidden="true">★ ★ ★ ★ ★</span>
            <span>111 AVALIAÇÕES NO GOOGLE</span>
          </span>
        </div>
      </div>

      <div className={styles.content}>
        <ol className={styles.reviews} aria-label="Depoimentos de clientes no Google">
          {REVIEWS.map((review, index) => (
            <li key={review.author} className={styles.card} data-review-card>
              <div className={styles.avatar}>
                <Image
                  alt={`Foto de ${review.author}`}
                  className={styles.avatarImage}
                  fill
                  sizes="64px"
                  src={review.image}
                />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <span className={styles.cardNumber} aria-hidden="true">0{index + 1}</span>
                  <span className={styles.cardStars} aria-label="5 estrelas">★ ★ ★ ★ ★</span>
                </div>
                <blockquote className={styles.quote}>“{review.text}”</blockquote>
                <p className={styles.author}>{review.author}</p>
              </div>
            </li>
          ))}
        </ol>

        <aside className={styles.location} data-review-map aria-labelledby="location-heading">
          <div className={styles.mapFrame}>
            <iframe
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=-26.9052396,-48.6997732&z=16&output=embed"
              title="Localização da Padrão Refinatto Marcenaria no Google Maps"
            />
          </div>
          <div className={styles.locationInfo}>
            <div>
              <p className={styles.locationEyebrow}>ONDE ESTAMOS</p>
              <h3 id="location-heading">Nosso ateliê em Itajaí.</h3>
            </div>
            <address>
              R. Arquiteto Nilson Edson dos Santos, 1085<br />
              São Vicente · Itajaí — SC
            </address>
          </div>
        </aside>
      </div>

      <div className={styles.footer} data-review-footer>
        <p>Avaliações publicadas por clientes na ficha da Padrão Refinatto Marcenaria.</p>
        <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noreferrer">
          VER TODAS NO GOOGLE <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
