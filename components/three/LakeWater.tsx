'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Lake water shader — Watts Bar at sunset.
 *
 * Custom GLSL surface with two layered sine ripples for low-amplitude
 * shimmer, plus a subtle Fresnel rim so the horizon edge reads as
 * water-meeting-sky rather than a flat panel.
 *
 * Color uses the brand fire-amber as the highlight tint and a deep
 * forest-tinted base to keep the water under-saturated against the
 * sunset HDRI's natural orange.
 *
 * Sized large (200m × 200m) so it extends to the horizon from any
 * camera position in Scene 5.
 */
export function LakeWater({
  position = [0, -0.3, -30],
  size = [200, 200] as [number, number],
}: {
  position?: [number, number, number];
  size?: [number, number];
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      // Daytime lake palette — bright sky-blue highlight at the horizon,
      // deep teal base near camera, pale silvery rim where water meets sky
      uHighlight: { value: new THREE.Color('#B0CFE0') },
      uBase: { value: new THREE.Color('#3D6B7A') },
      uFresnelTint: { value: new THREE.Color('#D8E6E8') },
    }),
    [],
  );

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
      <planeGeometry args={[size[0], size[1], 128, 128]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={false}
      />
    </mesh>
  );
}

/* ----------------------- Shaders ----------------------- */

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vShimmer;

  // Cheap two-layer sine ripple — low amplitude is the brand rule.
  float ripple(vec2 p) {
    float a = sin(p.x * 0.45 + uTime * 0.6) * 0.5
            + sin(p.y * 0.65 - uTime * 0.4) * 0.4;
    float b = sin((p.x + p.y) * 1.1 + uTime * 0.9) * 0.15;
    return (a + b) * 0.08;  // amplitude clamp
  }

  void main() {
    vec3 pos = position;
    float h = ripple(pos.xy);
    pos.z += h;
    vec4 wp = modelMatrix * vec4(pos, 1.0);
    vWorldPos = wp.xyz;
    vNormal = normalize(normalMatrix * vec3(0.0, 0.0, 1.0));
    vShimmer = h;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uHighlight;
  uniform vec3 uBase;
  uniform vec3 uFresnelTint;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vShimmer;

  void main() {
    // Distance-based depth mixing — water reads darker close to camera
    float horizonFade = smoothstep(0.0, 60.0, length(vWorldPos.xz));
    vec3 col = mix(uBase, uHighlight, horizonFade * 0.55);

    // Fresnel at grazing angles for the far-horizon water-meets-sky line
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - clamp(dot(viewDir, vec3(0.0, 1.0, 0.0)), 0.0, 1.0), 2.2);
    col = mix(col, uFresnelTint, fresnel * 0.55);

    // Add shimmer highlight bands
    float spec = pow(clamp(vShimmer * 8.0 + 0.5, 0.0, 1.0), 6.0);
    col += uHighlight * spec * 0.35;

    gl_FragColor = vec4(col, 1.0);
  }
`;
