import { useFrame } from '@react-three/fiber'
import { SEQUENCE_DURATION, smoothstep } from '../utils/universe'

export default function LightingSequence({ timeline, onComplete }) {
  useFrame(({ clock }) => {
    const state = timeline.current
    if (state.sequenceStart === null) { state.boost = 0; return }
    const elapsed = clock.elapsedTime - state.sequenceStart
    state.boost = smoothstep(0, 4.5, elapsed) * (1 - smoothstep(5.4, SEQUENCE_DURATION, elapsed))
    if (elapsed >= SEQUENCE_DURATION) { state.sequenceStart = null; state.boost = 0; onComplete() }
  })
  return null
}
