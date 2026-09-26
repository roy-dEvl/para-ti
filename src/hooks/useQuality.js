import { useEffect, useState } from 'react'
export const qualities = {
  high: { label: 'Alta', dpr: 1.65, flowers: 76, stars: 1500, particles: 160, petals: 24, detail: 10, bloom: true },
  medium: { label: 'Media', dpr: 1.3, flowers: 60, stars: 950, particles: 95, petals: 20, detail: 7, bloom: true },
  low: { label: 'Ligera', dpr: 1, flowers: 44, stars: 550, particles: 50, petals: 16, detail: 5, bloom: false },
}
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => { const media = matchMedia('(prefers-reduced-motion: reduce)'); const change = () => setReduced(media.matches); media.addEventListener('change', change); return () => media.removeEventListener('change', change) }, [])
  return reduced
}
export function initialQuality() {
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 4
  if (cores <= 4 || memory <= 2) return 'low'
  return matchMedia('(pointer: coarse)').matches || memory <= 4 ? 'medium' : 'high'
}
