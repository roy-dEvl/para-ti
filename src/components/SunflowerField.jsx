import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createFlowers, lightPulse, randomGenerator } from '../utils/universe'
import { glowMaterial, petalGeometry } from '../utils/geometry'

export default function SunflowerField({ quality, timeline, reduced }) {
  const group = useRef()
  const assets = useMemo(() => {
    const random = randomGenerator(72), flowers = createFlowers(quality.flowers)
    const parts = {
      petals: { geometry: petalGeometry(quality.detail), material: glowMaterial('#ffdc67'), entries: [] },
      centers: { geometry: new THREE.SphereGeometry(1, 24, 12), material: glowMaterial('#50301a'), entries: [] },
      seeds: { geometry: new THREE.IcosahedronGeometry(1, 0), material: glowMaterial('#b5863c'), entries: [] },
      stems: { geometry: new THREE.CylinderGeometry(.055, .09, 1, 6), material: glowMaterial('#34482c'), entries: [] },
      leaves: { geometry: petalGeometry(quality.detail, true), material: glowMaterial('#526138'), entries: [] },
    }
    const obj = new THREE.Object3D(), head = new THREE.Object3D()
    function add(part, flower, position, rotation, scale, color, parent) {
      obj.position.set(...position); obj.rotation.set(...rotation); obj.scale.set(...scale); obj.updateMatrix()
      const matrix = parent ? new THREE.Matrix4().multiplyMatrices(parent, obj.matrix) : obj.matrix.clone()
      parts[part].entries.push({ matrix, flower, color: new THREE.Color(color) })
    }
    flowers.forEach((f, id) => {
      head.position.set(f.x, f.height, f.z); head.rotation.set(f.tiltX, f.rotation, f.tiltZ); head.scale.setScalar(f.scale); head.updateMatrix()
      const count = id === 0 ? 34 : quality.petals
      for (let layer = 0; layer < 3; layer++) for (let p = 0; p < count; p++) {
        const angle = p / count * Math.PI * 2 + layer * .13 + (random() - .5) * .05
        const radius = .46 + layer * .04
        const length = 1.02 - layer * .13 + random() * .12
        add('petals', id, [Math.sin(angle) * radius, layer * .045, Math.cos(angle) * radius], [(random() - .5) * .12 - layer * .05, angle, (random() - .5) * .1], [.85 + random() * .28, 1, length], new THREE.Color().setHSL(.115 + random() * .025, .86, .52 + random() * .15), head.matrix)
      }
      add('centers', id, [0, .14, 0], [0, 0, 0], [.59, .235, .59], '#ffffff', head.matrix)
      const seedCount = id === 0 ? 380 : 36
      for (let s = 0; s < seedCount; s++) {
        const radius = Math.sqrt((s + .5) / seedCount) * .56, angle = s * 2.399963
        const y = .14 + .235 * Math.sqrt(1 - (radius / .6) ** 2)
        const size = id === 0 ? .024 + random() * .012 : .057
        add('seeds', id, [Math.cos(angle) * radius, y, Math.sin(angle) * radius], [0, angle, .2], [size, size * .65, size], s % 4 ? '#cfaa68' : '#76512f', head.matrix)
      }
      add('stems', id, [f.x, f.height / 2, f.z], [0, 0, 0], [f.scale, f.height, f.scale], '#ffffff')
      for (let l = 0; l < 3; l++) {
        const angle = f.rotation + l * 2.5
        add('leaves', id, [f.x, f.height * (.25 + l * .2), f.z], [-.35 + l * .16, angle, .15], [f.scale * .8, f.scale, f.scale * .95], l % 2 ? '#b3b97b' : '#ffffff')
      }
    })
    const meshes = Object.values(parts).map(part => {
      const glow = new THREE.InstancedBufferAttribute(new Float32Array(part.entries.length), 1).setUsage(THREE.DynamicDrawUsage)
      part.geometry.setAttribute('aGlow', glow)
      const mesh = new THREE.InstancedMesh(part.geometry, part.material, part.entries.length)
      part.entries.forEach((entry, i) => { mesh.setMatrixAt(i, entry.matrix); mesh.setColorAt(i, entry.color) })
      mesh.instanceMatrix.needsUpdate = true; mesh.instanceColor.needsUpdate = true
      mesh.computeBoundingSphere()
      return { ...part, mesh, glow }
    })
    return { flowers, meshes, pulses: new Float32Array(flowers.length) }
  }, [quality])
  useEffect(() => () => assets.meshes.forEach(p => { p.mesh.dispose(); p.geometry.dispose(); p.material.dispose() }), [assets])
  const lastUpdate = useRef(-1)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (group.current && !reduced) group.current.rotation.y = Math.sin(t * .12) * .012
    if (t - lastUpdate.current < 1 / 24) return
    lastUpdate.current = t
    const elapsed = timeline.current.sequenceStart === null ? -1 : t - timeline.current.sequenceStart
    assets.flowers.forEach((f, i) => {
      const ambient = reduced ? .02 : Math.pow(Math.max(0, Math.sin(t * .65 + f.phase)), 28) * .45
      assets.pulses[i] = .015 + ambient + lightPulse(f.radius, elapsed) * (i === 0 ? 2.3 : 1.65)
    })
    assets.meshes.forEach((part, index) => {
      const multiplier = index >= 3 ? .12 : index === 1 ? .35 : 1
      for (let i = 0; i < part.entries.length; i++) part.glow.array[i] = assets.pulses[part.entries[i].flower] * multiplier
      part.glow.needsUpdate = true
    })
  })
  return <group ref={group}>{assets.meshes.map((part, i) => <primitive key={i} object={part.mesh} dispose={null} />)}</group>
}
