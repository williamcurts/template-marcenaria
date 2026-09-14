import { existsSync } from "node:fs";
import path from "node:path";
import { Hero } from "@/components/hero/Hero";
import { CtaSection } from "@/components/sections/CtaSection";
import { DetailSection } from "@/components/sections/DetailSection";
import { FeaturedProjectSection } from "@/components/sections/FeaturedProjectSection";
import { MaterialSection } from "@/components/sections/MaterialSection";
import { PrecisionSection } from "@/components/sections/PrecisionSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { SiteFooter } from "@/components/sections/SiteFooter";

export default function Home() {
  const cabinetModelAvailable = existsSync(path.join(process.cwd(), "public", "models", "refinatto-cabinet.glb"));
  const featuredProjectImageAvailable = existsSync(path.join(process.cwd(), "public", "images", "desenho-projeto.png"));
  const imagesDir = path.join(process.cwd(), "public", "images");
  const stageImagesAvailable = {
    briefing: existsSync(path.join(imagesDir, "process-briefing.jpg")),
    projeto: existsSync(path.join(imagesDir, "process-design.jpg")),
    producao: existsSync(path.join(imagesDir, "process-production.jpg")),
    instalacao: existsSync(path.join(imagesDir, "process-installation.jpg")),
    entrega: existsSync(path.join(imagesDir, "process-delivery.jpg")),
  };
  const projectImagesAvailable = {
    aurora: existsSync(path.join(imagesDir, "project-01.jpg")),
    nogueira: existsSync(path.join(imagesDir, "project-02.jpg")),
    monolith: existsSync(path.join(imagesDir, "project-03.jpg")),
  };

  return (
    <main>
      <Hero />
      <MaterialSection />
      <PrecisionSection modelAvailable={cabinetModelAvailable} />
      <DetailSection />
      <FeaturedProjectSection imageAvailable={featuredProjectImageAvailable} />
      <ProcessSection stageImagesAvailable={stageImagesAvailable} />
      <ProjectsSection imagesAvailable={projectImagesAvailable} />
      <ReviewsSection />
      <CtaSection />
      <SiteFooter />
    </main>
  );
}
