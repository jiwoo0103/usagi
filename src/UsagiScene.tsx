import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { useEffect, useRef } from "react";
import type { Group } from "three";

type UsagiModelProps = {
  pressToken: number;
};

function UsagiModel({ pressToken }: UsagiModelProps) {
  const group = useRef<Group>(null);
  const animationTime = useRef(1);
  const { invalidate } = useThree();

  useEffect(() => {
    if (pressToken === 0) return;
    animationTime.current = 0;
    invalidate();
  }, [invalidate, pressToken]);

  useFrame((_, delta) => {
    if (!group.current || animationTime.current >= 0.56) return;
    animationTime.current += delta;
    const progress = Math.min(animationTime.current / 0.56, 1);
    const squash = progress < 0.28
      ? progress / 0.28
      : 1 - (progress - 0.28) / 0.72;
    const bounce = Math.sin(progress * Math.PI) * 0.11;
    group.current.scale.set(1 + squash * 0.07, 1 - squash * 0.09, 1 + squash * 0.05);
    group.current.position.y = bounce - squash * 0.08;
    if (progress >= 1) {
      group.current.scale.setScalar(1);
      group.current.position.y = 0;
    } else {
      invalidate();
    }
  });

  const yellow = "#f6bf2f";
  const paleYellow = "#ffd95b";
  const cream = "#fff9e8";
  const ink = "#322a1f";

  return (
    <group ref={group} rotation={[0.02, -0.05, 0]}>
      <mesh position={[-0.52, 2.05, -0.04]} rotation={[0, 0, -0.055]}>
        <capsuleGeometry args={[0.28, 1.22, 16, 32]} />
        <meshStandardMaterial color={yellow} roughness={0.86} />
      </mesh>
      <mesh position={[0.52, 2.05, -0.04]} rotation={[0, 0, 0.055]}>
        <capsuleGeometry args={[0.28, 1.22, 16, 32]} />
        <meshStandardMaterial color={yellow} roughness={0.86} />
      </mesh>
      <mesh position={[-0.52, 2.08, 0.245]} scale={[0.48, 0.78, 0.18]}>
        <capsuleGeometry args={[0.24, 1.0, 12, 28]} />
        <meshStandardMaterial color="#f5a7a3" roughness={0.9} />
      </mesh>
      <mesh position={[0.52, 2.08, 0.245]} scale={[0.48, 0.78, 0.18]}>
        <capsuleGeometry args={[0.24, 1.0, 12, 28]} />
        <meshStandardMaterial color="#f5a7a3" roughness={0.9} />
      </mesh>

      <mesh position={[0, 0.7, 0]} scale={[1.38, 1.08, 1]}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial color={yellow} roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.67, 1.005]} scale={[1.16, 0.82, 0.075]}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial color={cream} roughness={0.92} />
      </mesh>

      <mesh position={[0, -0.96, -0.03]} scale={[0.88, 1.05, 0.76]}>
        <sphereGeometry args={[1, 42, 42]} />
        <meshStandardMaterial color={paleYellow} roughness={0.86} />
      </mesh>
      <mesh position={[0, -0.95, 0.69]} scale={[0.58, 0.7, 0.22]}>
        <sphereGeometry args={[1, 40, 40]} />
        <meshStandardMaterial color={cream} roughness={0.92} />
      </mesh>

      <mesh position={[-0.94, -0.75, 0.02]} rotation={[0, 0, -0.8]}>
        <capsuleGeometry args={[0.19, 0.42, 12, 24]} />
        <meshStandardMaterial color={paleYellow} roughness={0.86} />
      </mesh>
      <mesh position={[0.94, -0.75, 0.02]} rotation={[0, 0, 0.8]}>
        <capsuleGeometry args={[0.19, 0.42, 12, 24]} />
        <meshStandardMaterial color={paleYellow} roughness={0.86} />
      </mesh>
      <mesh position={[-0.48, -1.92, 0.15]} scale={[0.48, 0.28, 0.58]}>
        <sphereGeometry args={[0.62, 30, 30]} />
        <meshStandardMaterial color={paleYellow} roughness={0.9} />
      </mesh>
      <mesh position={[0.48, -1.92, 0.15]} scale={[0.48, 0.28, 0.58]}>
        <sphereGeometry args={[0.62, 30, 30]} />
        <meshStandardMaterial color={paleYellow} roughness={0.9} />
      </mesh>

      <mesh position={[-0.43, 0.82, 1.105]} scale={[0.12, 0.17, 0.08]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial color={ink} roughness={0.52} />
      </mesh>
      <mesh position={[0.43, 0.82, 1.105]} scale={[0.12, 0.17, 0.08]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial color={ink} roughness={0.52} />
      </mesh>
      <mesh position={[-0.45, 1.17, 1.11]} rotation={[0, 0, -0.22]}>
        <capsuleGeometry args={[0.035, 0.22, 8, 18]} />
        <meshStandardMaterial color={ink} roughness={0.62} />
      </mesh>
      <mesh position={[0.45, 1.17, 1.11]} rotation={[0, 0, 0.22]}>
        <capsuleGeometry args={[0.035, 0.22, 8, 18]} />
        <meshStandardMaterial color={ink} roughness={0.62} />
      </mesh>
      <mesh position={[-0.76, 0.48, 1.105]} scale={[0.2, 0.12, 0.045]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial color="#f4a39b" roughness={0.75} />
      </mesh>
      <mesh position={[0.76, 0.48, 1.105]} scale={[0.2, 0.12, 0.045]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial color="#f4a39b" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.48, 1.12]} scale={[0.13, 0.16, 0.07]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial color={ink} roughness={0.58} />
      </mesh>
      <mesh position={[0, 0.44, 1.19]} scale={[0.075, 0.075, 0.035]}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshStandardMaterial color="#f08d83" roughness={0.65} />
      </mesh>
    </group>
  );
}

export default function UsagiScene({ pressToken }: UsagiModelProps) {
  return (
    <Canvas
      camera={{ fov: 34, near: 0.1, far: 100, position: [0, 0.2, 8.2] }}
      dpr={[1, 1.6]}
      frameloop="always"
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={1.7} />
      <directionalLight position={[-4, 6, 7]} intensity={2.8} color="#fff8dc" />
      <directionalLight position={[4, 2, 5]} intensity={1.1} color="#ffd7bd" />
      <UsagiModel pressToken={pressToken} />
      <ContactShadows position={[0, -2.2, 0]} opacity={0.22} scale={4.2} blur={2.7} far={4} />
    </Canvas>
  );
}
