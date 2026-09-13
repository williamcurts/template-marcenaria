import type { Object3D } from "three";

export const CABINET_MODEL_URL = "/models/refinatto-cabinet.glb";

export const CABINET_PARTS = {
  carcass: ["carcass", "cabinetBody", "structure", "corpus"],
  leftDoor: ["leftDoor", "doorLeft", "portaEsquerda"],
  rightDoor: ["rightDoor", "doorRight", "portaDireita"],
  drawer01: ["drawer01", "drawer1", "gaveta01", "gaveta1"],
  drawer02: ["drawer02", "drawer2", "gaveta02", "gaveta2"],
  shelf01: ["shelf01", "shelf1", "prateleira01", "prateleira1"],
  shelf02: ["shelf02", "shelf2", "prateleira02", "prateleira2"],
  handle01: ["handle01", "handle1", "puxador01", "puxador1"],
  handle02: ["handle02", "handle2", "puxador02", "puxador2"],
  hardware: ["hardware", "hinges", "ferragens", "dobradicas"],
  ledStrip: ["ledStrip", "led", "lighting", "iluminacao"],
} as const;

export type CabinetPart = keyof typeof CABINET_PARTS;

export const DEBUG_EXPLODED_VIEW = false;

function normalizeName(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase();
}

export function findCabinetPart(root: Object3D, part: CabinetPart): Object3D | null {
  const aliases = CABINET_PARTS[part].map(normalizeName);
  let exactMatch: Object3D | null = null;
  let partialMatch: Object3D | null = null;

  root.traverse((object) => {
    if (exactMatch || !object.name) return;
    const name = normalizeName(object.name);

    if (aliases.includes(name)) {
      exactMatch = object;
      return;
    }

    if (!partialMatch && aliases.some((alias) => name.includes(alias))) {
      partialMatch = object;
    }
  });

  return exactMatch ?? partialMatch;
}

export function getCabinetMeshNames(root: Object3D) {
  const names: string[] = [];
  root.traverse((object) => {
    if ("isMesh" in object && object.isMesh && object.name) names.push(object.name);
  });
  return names;
}
