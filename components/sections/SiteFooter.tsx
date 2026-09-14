import Image from "next/image";
import { GOOGLE_REVIEWS_URL, WHATSAPP_URL } from "@/lib/contact";
import styles from "./SiteFooter.module.css";

const NAVIGATION = [
  { label: "Matéria", href: "#materia" },
  { label: "Precisão", href: "#precisao" },
  { label: "Processo", href: "#processo" },
  { label: "Projetos", href: "#projetos" },
  { label: "Avaliações", href: "#avaliacoes" },
] as const;

export function SiteFooter() {
  return (
    <footer className={styles.footer} aria-label="Rodapé">
      <div className={styles.top}>
        <div className={styles.identity}>
          <a className={styles.brand} href="#top" aria-label="Padrão Refinatto, voltar ao início">
            <Image className={styles.logo} src="/images/logo.png" alt="" width={112} height={112} />
            <span>PADRÃO REFINATTO<small>MARCENARIA SOB MEDIDA</small></span>
          </a>
          <p>Matéria, precisão e permanência<br />em cada ambiente.</p>
        </div>

        <nav className={styles.column} aria-label="Navegação do rodapé">
          <p className={styles.label}>NAVEGAÇÃO</p>
          {NAVIGATION.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>

        <div className={styles.column}>
          <p className={styles.label}>CONTATO</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href="tel:+5547991545265">(47) 99154-5265</a>
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noreferrer">Ver no Google Maps</a>
        </div>

        <div className={styles.addressBlock}>
          <p className={styles.label}>ATELIÊ</p>
          <address>
            R. Arquiteto Nilson Edson dos Santos, 1085<br />
            São Vicente · Itajaí — SC<br />
            CEP 88309-401
          </address>
          <a className={styles.directions} href={GOOGLE_REVIEWS_URL} target="_blank" rel="noreferrer">
            COMO CHEGAR <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2026 PADRÃO REFINATTO. TODOS OS DIREITOS RESERVADOS.</p>
        <p>ITAJAÍ · SANTA CATARINA · BRASIL</p>
        <a href="#top">VOLTAR AO TOPO <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}
