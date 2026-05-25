import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Utility to generate random points in a sphere
function inSphere(count: number, radius: number) {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    points[i * 3] = x;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = z;
  }
  return points;
}

// Adaptive particle count — fewer on mobile to save GPU
const PARTICLE_COUNT = typeof window !== "undefined" && window.innerWidth < 768 ? 1500 : 3000;

// Check OS-level reduced motion preference once at module load
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  // Memoize sphere geometry — only computed once
  const sphere = useMemo(() => inSphere(PARTICLE_COUNT, 1.5), []);

  const { mouse, viewport } = useThree();

  useFrame((_state, delta) => {
    // Respect user's OS reduced-motion accessibility setting
    if (prefersReducedMotion || !ref.current) return;
    // Slow continuous rotation
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;

    // Mouse parallax effect
    const targetX = (mouse.x * viewport.width) / 20;
    const targetY = (mouse.y * viewport.height) / 20;

    ref.current.position.x += (targetX - ref.current.position.x) * 0.02;
    ref.current.position.y += (targetY - ref.current.position.y) * 0.02;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#3b82f6"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

// A subtle glowing abstract shape in the background
function AbstractShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  useFrame((_state, delta) => {
    // Respect user's OS reduced-motion accessibility setting
    if (prefersReducedMotion || !meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.1;
    meshRef.current.rotation.y += delta * 0.15;

    // Subtle parallax
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouse.x * 0.5, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouse.y * 0.5, 0.05);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#0a0a0a"
        roughness={0.2}
        metalness={0.8}
        wireframe={true}
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

export function BackgroundScene() {
  try {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505] overflow-hidden">
        {/* dpr capped at 2 to prevent 4K screens rendering at full resolution */}
        <Canvas 
          camera={{ position: [0, 0, 1] }} 
          dpr={[1, 2]}
          style={{ width: '100%', height: '100%' }}
        >
          <fog attach="fog" args={["#050505", 1, 3]} />
          <ambientLight intensity={0.5} />
          {/* Point light for subtle depth on the abstract shape */}
          <pointLight position={[2, 3, 1]} intensity={0.8} color="#3b82f6" />
          <ParticleField />
          <AbstractShape />
          <Preload all />
        </Canvas>
      </div>
    );
  } catch (error) {
    console.error('BackgroundScene render error:', error);
    // Fallback gradient background
    return (
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505]" style={{
        background: "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.12) 0%, #050505 100%)",
      }} />
    );
  }
}

