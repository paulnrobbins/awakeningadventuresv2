'use client';

/**
 * The Perspective Platform — overlook deck on the ridge silhouette.
 *
 * Tiny detail. Visible only as a silhouette during Scene 2's pull-back,
 * but its presence is what tells the visitor "this property has views,
 * not just trees." Built from primitives — no need for a custom GLB.
 */
export function PerspectivePlatform({
  position = [0, 0, 0],
  rotationY = 0,
}: {
  position?: [number, number, number];
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Support posts */}
      {[
        [-1.2, 0, -0.6],
        [1.2, 0, -0.6],
        [-1.2, 0, 0.6],
        [1.2, 0, 0.6],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], 0.6, p[2]]}>
          <cylinderGeometry args={[0.08, 0.1, 1.2, 6]} />
          <meshStandardMaterial color="#5A4126" roughness={0.85} />
        </mesh>
      ))}

      {/* Deck */}
      <mesh position={[0, 1.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.12, 1.6]} />
        <meshStandardMaterial color="#4A3220" roughness={0.88} />
      </mesh>

      {/* Railing on the view side */}
      <mesh position={[0, 1.55, 0.7]}>
        <boxGeometry args={[2.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#5A4126" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.4, 0.7]}>
        <boxGeometry args={[2.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#5A4126" roughness={0.85} />
      </mesh>
    </group>
  );
}
