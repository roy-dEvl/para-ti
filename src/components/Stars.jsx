import { useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { randomGenerator } from '../utils/universe'

export default function Stars({ quality, timeline, reduced, particles = false }) {
  const assets = useMemo(() => {
    const count = particles ? quality.particles : quality.stars, random = randomGenerator(particles ? 815 : 15)
    const positions = new Float32Array(count * 3), sizes = new Float32Array(count), phases = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const radius = particles ? 2 + random() * 16 : 18 + random() * 65
      const angle = random() * Math.PI * 2, vertical = random() * 2 - 1
      positions.set([Math.cos(angle) * radius * Math.sqrt(1 - vertical * vertical), vertical * radius * (particles ? .35 : 1), Math.sin(angle) * radius * Math.sqrt(1 - vertical * vertical)], i * 3)
      sizes[i] = particles ? 1.7 + random() * 2.5 : 1.5 + Math.pow(random(), 4) * 6
      phases[i] = random() * Math.PI * 2
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1)); geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    const material = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uReveal: { value: 0 }, uBoost: { value: 0 }, uDpr: { value: 1 }, uMotion: { value: reduced ? 0 : 1 } },
      vertexShader: `attribute float aSize; attribute float aPhase; varying float vAlpha; uniform float uTime; uniform float uDpr; uniform float uMotion;
        void main(){ vec3 p = position; ${particles ? 'p.y += sin(uTime * .17 + aPhase) * .7 * uMotion; p.x += cos(uTime * .12 + aPhase) * .3 * uMotion;' : ''}
          vec4 mv = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * uDpr * clamp(34. / max(1., -mv.z), .85, 2.5);
          vAlpha = .65 + .35 * sin(uTime * (.4 + aPhase * .12) * uMotion + aPhase); }`,
      fragmentShader: `varying float vAlpha; uniform float uReveal; uniform float uBoost;
        void main(){ float d = length(gl_PointCoord - .5) * 2.; float a = pow(max(0., 1. - d), 1.25);
          gl_FragColor = vec4(${particles ? 'vec3(1., .69, .27)' : 'vec3(.86, .91, 1.)'} * (1. + uBoost * .4), a * vAlpha * uReveal); }`,
    })
    return { geometry, material }
  }, [quality, particles, reduced])
  useEffect(() => () => { assets.geometry.dispose(); assets.material.dispose() }, [assets])
  useFrame(({ clock, gl }) => {
    const uniforms = assets.material.uniforms
    uniforms.uTime.value = clock.elapsedTime; uniforms.uReveal.value = timeline.current.reveal
    uniforms.uBoost.value = timeline.current.boost; uniforms.uDpr.value = gl.getPixelRatio()
  })
  return <points geometry={assets.geometry} material={assets.material} frustumCulled={false} />
}
