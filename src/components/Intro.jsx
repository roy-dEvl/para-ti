export default function Intro({ phase, ready, enter, reduced }) {
  if (phase === 'exploring') return null
  return <div className={`intro ${phase === 'entering' ? 'intro--leaving' : ''} ${reduced ? 'intro--reduced' : ''}`}>
    <button className="name-button" onClick={enter} disabled={!ready || phase !== 'intro'} aria-label="ELISSS, entrar en tu universo">
      ELISSS
    </button>
    {!ready && <span className="loading" role="status">Cargando tu universo…</span>}
  </div>
}
