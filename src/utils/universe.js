export const SEQUENCE_DURATION = 7.5
export const INTRO_DURATION = 4.2
export function randomGenerator(seed = 421) {
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 }
}
export const smoothstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
export function lightPulse(radius, elapsed) {
  if (elapsed < 0 || elapsed > SEQUENCE_DURATION) return 0
  const arrival = (1 - Math.min(radius / 11.5, 1)) * 4.4
  const age = elapsed - arrival
  return smoothstep(0, .65, age) * (1 - smoothstep(1.1, 3.1, age))
}
export function createFlowers(count) {
  const random = randomGenerator()
  const flowers = [{ x: 0, z: 0, height: 3.4, scale: 1.8, tiltX: .035, tiltZ: -.055, rotation: .4, radius: 0, phase: 0 }]
  for (let i = 0; i < count; i++) {
    const radius = 3.6 + Math.sqrt((i + .5) / count) * 7.6
    const angle = i * 2.399963 + (random() - .5) * .4
    flowers.push({ x: Math.cos(angle) * radius, z: Math.sin(angle) * radius, radius,
      height: 1.3 + random() * 1.7, scale: .36 + random() * .29,
      tiltX: (random() - .5) * .3, tiltZ: (random() - .5) * .3,
      rotation: random() * Math.PI * 2, phase: random() * 30 })
  }
  return flowers
}
