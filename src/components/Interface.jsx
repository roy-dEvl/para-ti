import useMusic from '../hooks/useMusic'
import { qualities } from '../hooks/useQuality'

function SoundIcon({ playing }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" />{playing ? <><path d="M16 8c2 2 2 6 0 8M19 5c4 4 4 10 0 14" /></> : <path d="m17 9 5 6m0-6-5 6" />}</svg>
}
export default function Interface({ sequence, illuminate, message, qualityName, setQuality, help, setHelp }) {
  const music = useMusic()
  return <div className="interface">
    <header className="topbar">
      <a className="wordmark" href="#" onClick={e => e.preventDefault()} aria-label="Para ti, un universo de flores">para ti<span>UN PEQUEÑO UNIVERSO</span></a>
      <div className="tools">
        <label className="quality"><span className="sr-only">Calidad gráfica</span><select value={qualityName} onChange={e => setQuality(e.target.value)} aria-label="Calidad gráfica">{Object.entries(qualities).map(([key, q]) => <option key={key} value={key}>{q.label}</option>)}</select></label>
        <button className="icon-button" onClick={() => setHelp(!help)} aria-label="Ayuda para explorar" aria-expanded={help}>?</button>
        <button className="icon-button" onClick={music.toggle} aria-label={music.playing ? 'Silenciar música' : 'Activar música'} aria-pressed={music.playing}><SoundIcon playing={music.playing} /></button>
      </div>
    </header>
    <div className="side-note" aria-hidden="true">UN JARDÍN ENTRE LAS ESTRELLAS</div>
    {help && <aside className="help">Arrastra para mirar alrededor. Desliza hacia arriba o abajo para descubrir los tallos. Acerca con dos dedos o con la rueda.<br />Con teclado: enfoca el universo y usa las flechas.</aside>}
    <div className={`dedication ${message ? 'dedication--visible' : ''}`} role="status">{message ? 'Para ti, jefa, un pequeño universo de luz' : ''}</div>
    <footer className="bottom-panel">
      <div className="message"><span className="eyebrow">ENTRE TODAS LAS GALAXIAS, TÚ.</span><p>Si pudiera regalarte un universo,<br className="desktop-break" /> te lo llenaría de flores amarillas.<br /><em>Para ti, jefis.</em></p></div>
      <div className="actions"><button className="illuminate" onClick={illuminate} disabled={sequence}><span aria-hidden="true">✧</span>{sequence ? 'El universo se ilumina…' : 'Iluminar el universo'}<span className="button-arrow" aria-hidden="true">↗</span></button><span className="explore-hint">ARRASTRA PARA EXPLORAR <span aria-hidden="true">·</span> ACÉRCATE A LAS FLORES</span></div>
      <span className="edition" aria-hidden="true">HECHO DE LUZ, SOLO PARA TI <span>✦</span></span>
    </footer>
    {music.status && <div className="audio-status" role="status">{music.status}</div>}
  </div>
}
