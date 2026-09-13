"use client";

import { Html, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import {
  CABINET_MODEL_URL,
  CABINET_PARTS,
  DEBUG_EXPLODED_VIEW,
  findCabinetPart,
  getCabinetMeshNames,
  type CabinetPart,
} from "./cabinetParts";
import type { ExplosionProgress } from "./useExplodedTimeline";

interface ExplodedCabinetSceneProps {
  modelAvailable: boolean;
  progress: RefObject<ExplosionProgress>;
}

type ProductProps = ExplodedCabinetSceneProps;

function stage(progress: number, start: number, end: number) {
  const value = THREE.MathUtils.clamp((progress - start) / (end - start), 0, 1);
  return value * value * (3 - 2 * value);
}

function CameraRig({ progress }: Pick<ExplodedCabinetSceneProps, "progress">) {
  const { camera, size } = useThree();
  const cameraRef = useRef(camera);
  const target = useMemo(() => new THREE.Vector3(0, 0.05, 0), []);

  useFrame(() => {
    const value = progress.current.value;
    const mobile = size.width < 768;
    const cameraMotion = mobile ? 0.45 : 1;
    const activeCamera = cameraRef.current;
    activeCamera.position.x = THREE.MathUtils.lerp(0.04, -0.05 * cameraMotion, value);
    activeCamera.position.y = THREE.MathUtils.lerp(0.08, 0.18, value);
    activeCamera.position.z = THREE.MathUtils.lerp(mobile ? 10.15 : 10.05, mobile ? 10.65 : 10.75, value);
    activeCamera.lookAt(target);
  });

  return null;
}

function Panel({ material, position, size }: { material: THREE.Material; position: [number, number, number]; size: [number, number, number] }) {
  return (
    <mesh material={material} position={position}>
      <boxGeometry args={size} />
    </mesh>
  );
}

function FallbackCabinet({ progress }: Pick<ExplodedCabinetSceneProps, "progress">) {
  const root = useRef<THREE.Group>(null);
  const leftDoor = useRef<THREE.Group>(null);
  const rightDoor = useRef<THREE.Group>(null);
  const drawer01 = useRef<THREE.Group>(null);
  const drawer02 = useRef<THREE.Group>(null);
  const shelf01 = useRef<THREE.Group>(null);
  const shelf02 = useRef<THREE.Group>(null);
  const handle01 = useRef<THREE.Group>(null);
  const handle02 = useRef<THREE.Group>(null);
  const hardware = useRef<THREE.Group>(null);
  const ledStrip = useRef<THREE.Group>(null);
  const { size } = useThree();

  const materials = useMemo(() => ({
    walnut: new THREE.MeshStandardMaterial({ color: "#4b3021", metalness: 0.03, roughness: 0.43 }),
    walnutEdge: new THREE.MeshStandardMaterial({ color: "#75492b", metalness: 0.02, roughness: 0.38 }),
    interior: new THREE.MeshStandardMaterial({ color: "#291c15", metalness: 0.02, roughness: 0.52 }),
    metal: new THREE.MeshStandardMaterial({ color: "#807a70", metalness: 0.82, roughness: 0.24 }),
    led: new THREE.MeshStandardMaterial({ color: "#fff1ca", emissive: "#d7a65f", emissiveIntensity: 3.2, roughness: 0.3 }),
  }), []);

  useEffect(() => () => {
    Object.values(materials).forEach((material) => material.dispose());
  }, [materials]);

  useFrame(() => {
    const value = progress.current.value;
    const motion = size.width < 768 ? 0.62 : 1;
    const appear = stage(value, 0, 0.13);
    const recompose = 1 - stage(value, 0.78, 0.92);
    const doors = stage(value, 0.34, 0.49) * recompose;
    const drawers = stage(value, 0.46, 0.61) * recompose;
    const shelves = stage(value, 0.57, 0.71) * recompose;
    const details = stage(value, 0.67, 0.79) * recompose;
    const exit = stage(value, 0.9, 1);

    if (root.current) {
      const scale = 0.93 + appear * 0.07 - exit * 0.04;
      root.current.scale.setScalar(scale);
      root.current.rotation.y = THREE.MathUtils.lerp(-0.065, 0.045 * motion, value);
      root.current.position.x = 0;
    }
    if (leftDoor.current) {
      leftDoor.current.position.x = -0.63 - doors * 0.66 * motion;
      leftDoor.current.rotation.y = -doors * 0.13;
    }
    if (rightDoor.current) {
      rightDoor.current.position.x = 0.63 + doors * 0.66 * motion;
      rightDoor.current.rotation.y = doors * 0.13;
    }
    if (drawer01.current) drawer01.current.position.z = 0.64 + drawers * 0.82 * motion;
    if (drawer02.current) drawer02.current.position.z = 0.64 + drawers * 1.08 * motion;
    if (shelf01.current) shelf01.current.position.y = 0.2 + shelves * 0.4 * motion;
    if (shelf02.current) shelf02.current.position.y = 0.92 + shelves * 0.34 * motion;
    if (handle01.current) {
      handle01.current.position.x = -0.1 - doors * 0.66 * motion - details * 0.13;
      handle01.current.position.z = 0.71 + details * 0.18;
    }
    if (handle02.current) {
      handle02.current.position.x = 0.1 + doors * 0.66 * motion + details * 0.13;
      handle02.current.position.z = 0.71 + details * 0.18;
    }
    if (hardware.current) hardware.current.position.z = 0.54 + details * 0.3 * motion;
    if (ledStrip.current) ledStrip.current.position.y = 1.93 + details * 0.28 * motion;
  });

  return (
    <group ref={root}>
      <group>
        <Panel material={materials.interior} position={[0, 0, -0.57]} size={[2.55, 4.35, 0.1]} />
        <Panel material={materials.walnut} position={[-1.25, 0, 0]} size={[0.12, 4.5, 1.25]} />
        <Panel material={materials.walnut} position={[1.25, 0, 0]} size={[0.12, 4.5, 1.25]} />
        <Panel material={materials.walnut} position={[0, 2.19, 0]} size={[2.5, 0.12, 1.25]} />
        <Panel material={materials.walnut} position={[0, -2.19, 0]} size={[2.5, 0.12, 1.25]} />
        <Panel material={materials.walnutEdge} position={[0, -0.86, 0]} size={[2.42, 0.1, 1.16]} />
      </group>

      <group ref={shelf01} position={[0, 0.2, 0]}>
        <Panel material={materials.walnutEdge} position={[0, 0, -0.05]} size={[2.36, 0.09, 1.04]} />
      </group>
      <group ref={shelf02} position={[0, 0.92, 0]}>
        <Panel material={materials.walnutEdge} position={[0, 0, -0.05]} size={[2.36, 0.09, 1.04]} />
      </group>

      <group ref={leftDoor} position={[-0.63, 0.66, 0.64]}>
        <Panel material={materials.walnut} position={[0, 0, 0]} size={[1.18, 2.92, 0.1]} />
      </group>
      <group ref={rightDoor} position={[0.63, 0.66, 0.64]}>
        <Panel material={materials.walnut} position={[0, 0, 0]} size={[1.18, 2.92, 0.1]} />
      </group>

      <group ref={drawer01} position={[0, -1.18, 0.64]}>
        <Panel material={materials.walnut} position={[0, 0, 0]} size={[2.36, 0.48, 0.12]} />
        <Panel material={materials.interior} position={[0, 0, -0.38]} size={[2.12, 0.4, 0.72]} />
      </group>
      <group ref={drawer02} position={[0, -1.78, 0.64]}>
        <Panel material={materials.walnut} position={[0, 0, 0]} size={[2.36, 0.48, 0.12]} />
        <Panel material={materials.interior} position={[0, 0, -0.38]} size={[2.12, 0.4, 0.72]} />
      </group>

      <group ref={handle01} position={[-0.1, 0.66, 0.71]}>
        <mesh material={materials.metal}>
          <cylinderGeometry args={[0.025, 0.025, 0.5, 16]} />
        </mesh>
      </group>
      <group ref={handle02} position={[0.1, 0.66, 0.71]}>
        <mesh material={materials.metal}>
          <cylinderGeometry args={[0.025, 0.025, 0.5, 16]} />
        </mesh>
      </group>

      <group ref={hardware} position={[0, 0, 0.54]}>
        {[-1.16, 1.16].flatMap((x) => [-0.2, 0.78, 1.54].map((y) => (
          <mesh key={`${x}-${y}`} material={materials.metal} position={[x, y, 0]}>
            <boxGeometry args={[0.06, 0.16, 0.08]} />
          </mesh>
        )))}
      </group>

      <group ref={ledStrip} position={[0, 1.93, 0.38]}>
        <mesh material={materials.led}>
          <boxGeometry args={[1.95, 0.025, 0.035]} />
        </mesh>
        <pointLight color="#d6a15d" distance={3.2} intensity={1.8} position={[0, -0.25, 0.35]} />
      </group>
    </group>
  );
}

interface InitialPartTransform {
  object: THREE.Object3D;
  position: THREE.Vector3;
}

function GlbCabinet({ progress }: Pick<ExplodedCabinetSceneProps, "progress">) {
  const { scene } = useGLTF(CABINET_MODEL_URL);
  const root = useRef<THREE.Group>(null);
  const { size: viewportSize } = useThree();
  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = size.y > 0 ? 4.4 / size.y : 1;
    clone.position.sub(center);
    clone.scale.setScalar(scale);

    const parts = {} as Partial<Record<CabinetPart, InitialPartTransform>>;
    (Object.keys(CABINET_PARTS) as CabinetPart[]).forEach((part) => {
      const object = findCabinetPart(clone, part);
      if (object) parts[part] = { object, position: object.position.clone() };
    });

    return { clone, parts, size };
  }, [scene]);

  useEffect(() => {
    if (DEBUG_EXPLODED_VIEW) console.info("[exploded-view] meshes", getCabinetMeshNames(prepared.clone));
  }, [prepared]);

  useFrame(() => {
    const value = progress.current.value;
    const motion = viewportSize.width < 768 ? 0.62 : 1;
    const recompose = 1 - stage(value, 0.78, 0.92);
    const doors = stage(value, 0.34, 0.49) * recompose;
    const drawers = stage(value, 0.46, 0.61) * recompose;
    const shelves = stage(value, 0.57, 0.71) * recompose;
    const details = stage(value, 0.67, 0.79) * recompose;
    const unitX = prepared.size.x * 0.24 * motion;
    const unitY = prepared.size.y * 0.1 * motion;
    const unitZ = Math.max(prepared.size.z, prepared.size.x * 0.2) * 0.72 * motion;

    const move = (part: CabinetPart, x: number, y: number, z: number, amount: number) => {
      const target = prepared.parts[part];
      if (!target) return;
      target.object.position.set(
        target.position.x + x * amount,
        target.position.y + y * amount,
        target.position.z + z * amount,
      );
    };

    move("leftDoor", -unitX, 0, 0, doors);
    move("rightDoor", unitX, 0, 0, doors);
    move("drawer01", 0, 0, unitZ, drawers);
    move("drawer02", 0, 0, unitZ * 1.25, drawers);
    move("shelf01", 0, unitY, 0, shelves);
    move("shelf02", 0, -unitY, 0, shelves);
    move("handle01", -unitX * 1.15, 0, unitZ * 0.25, details);
    move("handle02", unitX * 1.15, 0, unitZ * 0.25, details);
    move("hardware", 0, 0, unitZ * 0.45, details);
    move("ledStrip", 0, unitY * 0.8, 0, details);

    if (root.current) {
      root.current.position.x = 0;
      root.current.rotation.y = THREE.MathUtils.lerp(-0.055, 0.04 * motion, value);
    }
  });

  return (
    <group ref={root}>
      <primitive object={prepared.clone} />
    </group>
  );
}

function Product({ modelAvailable, progress }: ProductProps) {
  return (
    <>
      <CameraRig progress={progress} />
      <ambientLight color="#8f8175" intensity={0.22} />
      <directionalLight color="#d5a36b" intensity={3.1} position={[4.5, 5.5, 5]} />
      <directionalLight color="#78818c" intensity={0.72} position={[-4, 1.5, 3]} />
      <pointLight color="#c99a5a" distance={7} intensity={1.6} position={[-2.8, -1.2, 3.5]} />
      {modelAvailable ? <GlbCabinet progress={progress} /> : <FallbackCabinet progress={progress} />}
    </>
  );
}

function LoadingLabel() {
  return (
    <Html center>
      <span style={{ color: "#a8a49a", fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: ".2em", whiteSpace: "nowrap" }}>
        CARREGANDO MATÉRIA
      </span>
    </Html>
  );
}

export function ExplodedCabinetScene({ modelAvailable, progress }: ExplodedCabinetSceneProps) {
  return (
    <Canvas
      camera={{ fov: 32, near: 0.1, far: 100, position: [0.04, 0.08, 10.05] }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.06;
      }}
    >
      <Suspense fallback={<LoadingLabel />}>
        <Product modelAvailable={modelAvailable} progress={progress} />
      </Suspense>
    </Canvas>
  );
}
