import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import SunflowerField from './SunflowerField'
import Stars from './Stars'
import CameraController from './CameraController'
import LightingSequence from './LightingSequence'

function Lifecycle({ onReady, onLost, onSlow }) {
  const gl = useThree(state => state.gl), samples = useRef({ elapsed: 0, frames: 0, settled: 0, done: false })
  useEffect(() => {
    const canvas = gl.domElement
    const lost = event => { event.preventDefault(); onLost() }
    canvas.addEventListener('webglcontextlost', lost)
    onReady()
    return () => canvas.removeEventListener('webglcontextlost', lost)
  }, [gl, onReady, onLost])
  useFrame((_, delta) => {
    const s = samples.current
    if (s.done || document.hidden) return
    s.settled += delta
    if (s.settled < 7) return
    s.elapsed += Math.min(delta, .15); s.frames++
    if (s.elapsed > 5) { s.done = true; if (s.frames / s.elapsed < 29) onSlow() }
  })
  return null
}
export default function Universe({ quality, phase, timeline, reduced, onComplete, onReady, onLost, onSlow }) {
  return <>
    <color attach="background" args={['#05080e']} />
    <fog attach="fog" args={['#05080e', 46, 110]} />
    <ambientLight intensity={.65} color="#abb8e0" />
    <hemisphereLight args={['#ffe5aa', '#16221d', 1.1]} />
    <directionalLight position={[8, 18, 6]} intensity={2.2} color="#fff1c3" />
    <directionalLight position={[-8, 5, -10]} intensity={1.3} color="#a2b5ed" />
    <group visible={phase !== 'intro'}>
      <SunflowerField quality={quality} timeline={timeline} reduced={reduced} />
    </group>
    <Stars quality={quality} timeline={timeline} reduced={reduced} />
    <Stars quality={quality} timeline={timeline} reduced={reduced} particles />
    <CameraController phase={phase} timeline={timeline} reduced={reduced} />
    <LightingSequence timeline={timeline} onComplete={onComplete} />
    <Lifecycle onReady={onReady} onLost={onLost} onSlow={onSlow} />
    {quality.bloom && <EffectComposer multisampling={0} resolutionScale={.65}>
      <Bloom intensity={.48} luminanceThreshold={1.15} luminanceSmoothing={.55} mipmapBlur />
      <Vignette offset={.2} darkness={.48} />
    </EffectComposer>}
  </>
}
