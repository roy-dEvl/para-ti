import { useCallback, useEffect, useRef, useState } from 'react'
import Experience, { SceneBoundary } from './components/Experience'
import Intro from './components/Intro'
import Interface from './components/Interface'
import { initialQuality, qualities, useReducedMotion } from './hooks/useQuality'
import { INTRO_DURATION } from './utils/universe'

function supportsWebGL() {
  try { const canvas = document.createElement('canvas'); const context = canvas.getContext('webgl2'); if (!context) return false; context.getExtension('WEBGL_lose_context')?.loseContext(); return true } catch { return false }
}
export default function App() {
  const [phase, setPhase] = useState('intro'), [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(() => !supportsWebGL())
  const [qualityName, setQualityName] = useState(initialQuality), [sequence, setSequence] = useState(false)
  const [message, setMessage] = useState(false), [help, setHelp] = useState(false)
  const reduced = useReducedMotion(), scene = useRef(), messageTimer = useRef()
  const timeline = useRef({ now: 0, enterStart: null, sequenceStart: null, reveal: 0, boost: 0, keyOrbit: null })
  const onReady = useCallback(() => setReady(true), [])
  const onLost = useCallback(() => setFailed(true), [])
  const onSlow = useCallback(() => setQualityName(current => current === 'high' ? 'medium' : 'low'), [])
  useEffect(() => {
    if (phase !== 'entering') return
    const timer = setTimeout(() => { setPhase('exploring'); scene.current?.focus({ preventScroll: true }) }, (reduced ? 1 : INTRO_DURATION) * 1000)
    return () => clearTimeout(timer)
  }, [phase, reduced])
  useEffect(() => () => clearTimeout(messageTimer.current), [])
  const onComplete = useCallback(() => { setSequence(false); setMessage(true); messageTimer.current = setTimeout(() => setMessage(false), 5500) }, [])
  const illuminate = () => {
    if (timeline.current.sequenceStart !== null) return
    clearTimeout(messageTimer.current); setMessage(false)
    timeline.current.sequenceStart = timeline.current.now
    setSequence(true)
  }
  const onKey = event => {
    const directions = { ArrowLeft: { x: 1, y: 0 }, ArrowRight: { x: -1, y: 0 }, ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 } }
    if (directions[event.key]) { event.preventDefault(); timeline.current.keyOrbit = directions[event.key] }
  }
  if (failed) return <main className="fallback"><span className="fallback-star">✧</span><h1>Tu universo sigue aquí.</h1><p>Para abrir este jardín necesitas un navegador con WebGL 2 y aceleración gráfica. Si se interrumpió la conexión gráfica, intenta abrirlo otra vez.</p><button className="illuminate" onClick={() => location.reload()}>Volver a intentar</button><blockquote>Si pudiera regalarte un universo, te lo llenaría de flores amarillas. Para ti, jefis.</blockquote></main>
  return <main className={`app phase-${phase} ${reduced ? 'reduced-motion' : ''}`}>
    <div className="scene" ref={scene} tabIndex={phase === 'exploring' ? 0 : -1} role="region" aria-label="Universo tridimensional de girasoles. Usa las flechas o arrastra para explorar."
      onKeyDown={onKey} onKeyUp={() => { timeline.current.keyOrbit = null }} onBlur={() => { timeline.current.keyOrbit = null }}>
      <SceneBoundary onError={onLost}><Experience quality={qualities[qualityName]} phase={phase} timeline={timeline} reduced={reduced} onReady={onReady} onLost={onLost} onSlow={onSlow} onComplete={onComplete} /></SceneBoundary>
    </div>
    {phase === 'entering' && <div className="entry-effects" aria-hidden="true"><div className="entry-flash" />{Array.from({ length: reduced ? 0 : 42 }, (_, i) => <i key={i} style={{ '--angle': `${i * 137.5}deg`, '--distance': `${18 + i % 9 * 4}vmax`, '--delay': `${i % 7 * .025}s` }} />)}</div>}
    <Intro phase={phase} ready={ready} reduced={reduced} enter={() => setPhase('entering')} />
    {phase === 'exploring' && <Interface sequence={sequence} illuminate={illuminate} message={message} qualityName={qualityName} setQuality={setQualityName} help={help} setHelp={setHelp} />}
  </main>
}
