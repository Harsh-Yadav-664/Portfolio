import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { lerpMouse } from "../../lib/mouse";
import { usePalette } from "../../lib/theme";
import type { ReactNode } from "react";

/* ═════════════════════════════════════════════════════════════
   THREE 3D OBJECTS
   1. SceneHero  — "artifact": distorted-feel icosahedron stack
   2. SceneCore  — torus-knot data core (projects section)
   3. SceneOrbit — gyroscope rings + core sphere (contact section)
   Every colour is read from the active theme palette, so the
   objects re-light themselves in both console-dark and cream.
═════════════════════════════════════════════════════════════ */

function makeCloud(count: number, rMin: number, rMax: number, squash = 0.8): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = rMin + Math.random() * (rMax - rMin);
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.cos(ph) * squash;
    pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
  }
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return g;
}

export function Scene({
  children,
  className = "",
  paused = false,
  camera = [0, 0, 6],
}: {
  children: ReactNode;
  className?: string;
  paused?: boolean;
  camera?: [number, number, number];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(true);
  const p = usePalette();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShown(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const stop = paused || !shown;

  return (
    <div ref={wrapRef} className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={stop ? "demand" : "always"}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: camera, fov: 42 }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[6, 5, 6]} intensity={1.5} decay={0} color={p.key} />
        <pointLight position={[-6, -4, -5]} intensity={0.5} decay={0} color={p.rim} />
        {children}
      </Canvas>
    </div>
  );
}

/* ── 1 · HERO ARTIFACT ── */
export function SceneHero({ paused = false }: { paused?: boolean }) {
  const p = usePalette();
  const rig = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const cloud = useRef<THREE.Points>(null);
  const sats = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];
  const cloudGeo = useMemo(() => makeCloud(620, 2.1, 3.4, 0.72), []);

  useFrame((state, dt) => {
    if (paused) return;
    const t = state.clock.elapsedTime;
    const { x, y } = lerpMouse(dt);
    const g = rig.current;
    if (!g) return;
    g.rotation.y += dt * 0.12;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, y * 0.22, Math.min(1, dt * 3));
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -x * 0.12, Math.min(1, dt * 3));
    if (shell.current) {
      shell.current.rotation.x = t * 0.1;
      shell.current.rotation.z = -t * 0.06;
    }
    if (halo.current) halo.current.rotation.y = -t * 0.05;
    if (cloud.current) cloud.current.rotation.y = t * 0.016;
    sats.forEach((s, i) => {
      const m = s.current;
      if (!m) return;
      const a = t * 0.5 + i * ((Math.PI * 2) / 3);
      m.position.set(Math.cos(a) * 2.45, Math.sin(t * 0.7 + i * 2.1) * 0.45, Math.sin(a) * 2.45);
      m.rotation.x = t * 1.4 + i;
      m.rotation.y = t;
    });
  });

  return (
    <group ref={rig}>
      <mesh>
        <icosahedronGeometry args={[0.95, 2]} />
        <meshStandardMaterial
          color={p.core}
          metalness={0.85}
          roughness={0.32}
          emissive={p.volt}
          emissiveIntensity={0.05}
          flatShading
        />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial color={p.volt} wireframe transparent opacity={0.34} />
      </mesh>
      <mesh ref={halo}>
        <icosahedronGeometry args={[2.05, 1]} />
        <meshBasicMaterial color={p.volt} wireframe transparent opacity={0.09} />
      </mesh>
      <points ref={cloud} geometry={cloudGeo}>
        <pointsMaterial size={0.028} color={p.volt} transparent opacity={0.5} sizeAttenuation depthWrite={false} />
      </points>
      {sats.map((s, i) => (
        <mesh key={i} ref={s}>
          <octahedronGeometry args={[0.09, 0]} />
          <meshBasicMaterial color={p.volt} />
        </mesh>
      ))}
    </group>
  );
}

/* ── 2 · DATA CORE (PROJECTS) ── */
export function SceneCore({ paused = false }: { paused?: boolean }) {
  const p = usePalette();
  const rig = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  const cloud = useRef<THREE.Points>(null);
  const cloudGeo = useMemo(() => makeCloud(380, 1.7, 2.9, 0.85), []);

  useFrame((state, dt) => {
    if (paused) return;
    const t = state.clock.elapsedTime;
    const { x, y } = lerpMouse(dt);
    if (rig.current) {
      rig.current.rotation.x = THREE.MathUtils.lerp(rig.current.rotation.x, y * 0.18, Math.min(1, dt * 3));
      rig.current.rotation.z = THREE.MathUtils.lerp(rig.current.rotation.z, -x * 0.1, Math.min(1, dt * 3));
    }
    if (knot.current) {
      knot.current.rotation.x += dt * 0.18;
      knot.current.rotation.y += dt * 0.11;
    }
    if (wire.current) {
      wire.current.rotation.y -= dt * 0.08;
      wire.current.rotation.z += dt * 0.05;
    }
    if (cloud.current) cloud.current.rotation.y = t * 0.02;
  });

  return (
    <group ref={rig}>
      <mesh ref={knot}>
        <torusKnotGeometry args={[1.05, 0.3, 220, 28]} />
        <meshStandardMaterial
          color={p.core}
          metalness={0.8}
          roughness={0.4}
          emissive={p.volt}
          emissiveIntensity={0.04}
          flatShading
        />
      </mesh>
      <mesh ref={wire}>
        <torusKnotGeometry args={[1.05, 0.3, 130, 18]} />
        <meshBasicMaterial color={p.volt} wireframe transparent opacity={0.22} />
      </mesh>
      <points ref={cloud} geometry={cloudGeo}>
        <pointsMaterial size={0.024} color={p.volt} transparent opacity={0.4} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}

/* ── 3 · GYRO ORBIT (CONTACT) ── */
export function SceneOrbit({ paused = false }: { paused?: boolean }) {
  const p = usePalette();
  const rig = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const r0 = useRef<THREE.Mesh>(null);
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const sats = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];

  useFrame((state, dt) => {
    if (paused) return;
    const t = state.clock.elapsedTime;
    const { x, y } = lerpMouse(dt);
    if (rig.current) {
      rig.current.rotation.y = THREE.MathUtils.lerp(rig.current.rotation.y, x * 0.3, Math.min(1, dt * 3));
      rig.current.rotation.x = THREE.MathUtils.lerp(rig.current.rotation.x, y * 0.2, Math.min(1, dt * 3));
    }
    if (core.current) {
      core.current.rotation.y += dt * 0.2;
      const s = 1 + Math.sin(t * 1.2) * 0.035;
      core.current.scale.setScalar(s);
    }
    if (r0.current) {
      r0.current.rotation.x = t * 0.42;
      r0.current.rotation.y = t * 0.2;
    }
    if (r1.current) {
      r1.current.rotation.y = t * 0.3;
      r1.current.rotation.z = t * 0.14;
    }
    if (r2.current) {
      r2.current.rotation.x = -t * 0.22;
      r2.current.rotation.z = t * 0.26;
    }
    sats.forEach((s, i) => {
      const m = s.current;
      if (!m) return;
      const a = t * (0.55 + i * 0.2) + i * Math.PI;
      const r = i === 0 ? 1.55 : 1.9;
      m.position.set(Math.cos(a) * r, Math.sin(a) * r * 0.35, Math.sin(a) * r);
    });
  });

  return (
    <group ref={rig}>
      <mesh ref={core}>
        <sphereGeometry args={[0.85, 48, 48]} />
        <meshStandardMaterial
          color={p.core}
          metalness={0.9}
          roughness={0.28}
          emissive={p.volt}
          emissiveIntensity={0.06}
        />
      </mesh>
      <mesh ref={r0}>
        <torusGeometry args={[1.55, 0.007, 8, 128]} />
        <meshBasicMaterial color={p.volt} transparent opacity={0.55} />
      </mesh>
      <mesh ref={r1}>
        <torusGeometry args={[1.9, 0.005, 8, 128]} />
        <meshBasicMaterial color={p.volt} transparent opacity={0.3} />
      </mesh>
      <mesh ref={r2}>
        <torusGeometry args={[2.25, 0.004, 8, 128]} />
        <meshBasicMaterial color={p.volt} transparent opacity={0.14} />
      </mesh>
      {sats.map((s, i) => (
        <mesh key={i} ref={s}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color={p.volt} />
        </mesh>
      ))}
    </group>
  );
}
