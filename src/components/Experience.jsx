import { Component, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Universe from './Universe'

export class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error) { console.error('No se pudo iniciar el universo:', error); this.props.onError() }
  render() { return this.state.failed ? null : this.props.children }
}
export default function Experience(props) {
  return <Canvas camera={{ position: [0, 38, 4], fov: 49, near: .1, far: 160 }}
    dpr={[1, props.quality.dpr]} gl={{ antialias: !props.quality.bloom, alpha: false, powerPreference: 'high-performance' }}
    shadows={false} fallback={<span>Tu navegador no tiene WebGL disponible.</span>}>
    <Suspense fallback={null}><Universe {...props} /></Suspense>
  </Canvas>
}
