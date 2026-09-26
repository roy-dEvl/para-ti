import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { INTRO_DURATION, smoothstep } from '../utils/universe'

export default function CameraController({ phase, timeline, reduced }) {
  const controls = useRef(), initialized = useRef(false)
  useFrame(({ camera, clock, size }, delta) => {
    const state = timeline.current
    state.now = clock.elapsedTime
    const distance = size.width < size.height ? 37 : 30
    if (phase === 'intro') {
      camera.position.set(0, distance * 1.5, distance * .14); camera.lookAt(0, 1, 0)
      state.reveal = 0; initialized.current = false
    } else if (phase === 'entering') {
      if (state.enterStart === null) state.enterStart = clock.elapsedTime
      const progress = smoothstep(0, reduced ? .9 : INTRO_DURATION, clock.elapsedTime - state.enterStart)
      state.reveal = smoothstep(0, .7, progress)
      const angle = reduced ? .07 : .07 + (1 - progress) * .35
      camera.position.set(Math.sin(angle) * (1 - progress) * 5, THREE.MathUtils.lerp(distance * 1.5, distance, progress), THREE.MathUtils.lerp(distance * .14, distance * .27, progress))
      camera.lookAt(0, 1, 0)
    } else if (controls.current) {
      if (!initialized.current) { controls.current.target.set(0, 1, 0); initialized.current = true }
      state.reveal = 1
      const key = state.keyOrbit
      if (key) {
        const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.current.target))
        spherical.theta += key.x * Math.min(delta, .05) * .7
        spherical.phi = THREE.MathUtils.clamp(spherical.phi + key.y * Math.min(delta, .05) * .55, .12, 1.34)
        camera.position.copy(controls.current.target).add(new THREE.Vector3().setFromSpherical(spherical))
      }
    }
  }, -1)
  return <OrbitControls ref={controls} enabled={phase === 'exploring'} makeDefault enablePan={false} enableDamping dampingFactor={reduced ? 1 : .055} rotateSpeed={.38} zoomSpeed={.5} minPolarAngle={.12} maxPolarAngle={1.34} minDistance={15} maxDistance={42} target={[0, 1, 0]} />
}
