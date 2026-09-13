"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useExplodedTimeline } from "@/scenes/exploded-view/useExplodedTimeline";
import styles from "./PrecisionSection.module.css";

const ExplodedCabinetScene = dynamic(
  () => import("@/scenes/exploded-view/ExplodedCabinetScene").then((module) => module.ExplodedCabinetScene),
  {
    ssr: false,
    loading: () => <p className={styles.loading}>CARREGANDO MATÉRIA</p>,
  },
);

interface PrecisionSectionProps {
  modelAvailable: boolean;
}

export function PrecisionSection({ modelAvailable }: PrecisionSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const progress = useExplodedTimeline(sectionRef);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSceneReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
      <section ref={sectionRef} id="precisao" className={styles.section} aria-labelledby="precision-heading">
        <div className={styles.scene}>
          <div className={styles.canvas} data-precision-canvas aria-hidden="true">
            {sceneReady ? <ExplodedCabinetScene modelAvailable={modelAvailable} progress={progress} /> : <p className={styles.loading}>CARREGANDO MATÉRIA</p>}
          </div>
          <div className={styles.vignette} aria-hidden="true" />

          <p className={styles.sectionLabel} data-precision-section-label>02 / PRECISÃO</p>

          <ul className={styles.callouts} aria-label="Especificações construtivas">
            <li className={styles.structureCallout} data-precision-callout="structure">
              <span>MDF 18 MM</span><i aria-hidden="true" />
            </li>
            <li className={styles.hardwareCallout} data-precision-callout="hardware">
              <span>FERRAGEM SOFT-CLOSE</span><i aria-hidden="true" />
            </li>
            <li className={styles.drawerCallout} data-precision-callout="drawer">
              <span>ENCAIXE DE PRECISÃO</span><i aria-hidden="true" />
            </li>
            <li className={styles.ledCallout} data-precision-callout="led">
              <span>ILUMINAÇÃO INTEGRADA</span><i aria-hidden="true" />
            </li>
          </ul>

          <div className={styles.editorial} data-precision-editorial>
            <h2 id="precision-heading">Precisão<br />em cada encaixe.</h2>
            <p>Cada peça existe por uma razão.<br />Cada encaixe responde ao projeto.</p>
          </div>

          <div className={styles.progressRail} aria-hidden="true">
            <span>01</span><i data-precision-progress /><span>06</span>
          </div>

          <p className={styles.exit} data-precision-exit aria-hidden="true">03 / DETALHE</p>
        </div>
      </section>
  );
}
