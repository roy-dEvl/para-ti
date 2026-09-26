import { useEffect, useRef, useState } from 'react'

export default function useMusic() {
  const audio = useRef(null), busy = useRef(false)
  const [playing, setPlaying] = useState(false), [status, setStatus] = useState('')
  useEffect(() => {
    const element = new Audio(); element.loop = true; element.volume = .32; element.preload = 'none'
    audio.current = element
    const failed = () => { setPlaying(false); setStatus('La música aún no está disponible. Disfruta el silencio de tu universo.') }
    element.addEventListener('error', failed)
    return () => { element.pause(); element.removeEventListener('error', failed); element.removeAttribute('src'); element.load(); audio.current = null }
  }, [])
  const toggle = async () => {
    if (busy.current || !audio.current) return
    if (playing) { audio.current.pause(); setPlaying(false); return }
    busy.current = true
    const element = audio.current
    try {
      // Loaded only after a deliberate click, so an absent file never delays entry.
      if (!element.getAttribute('src')) element.src = `${import.meta.env.BASE_URL}music.mp3`
      await element.play()
      if (audio.current === element) { setPlaying(true); setStatus('') }
    } catch { if (audio.current === element) { setPlaying(false); setStatus('La música aún no está disponible. Disfruta el silencio de tu universo.') } }
    finally { busy.current = false }
  }
  return { playing, status, toggle }
}
