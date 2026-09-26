import * as THREE from 'three'

// A tapered, cupped solid petal, with a thin underside: never a billboard.
export function petalGeometry(segments = 10, leaf = false) {
  const positions = [], indices = []
  const across = 6
  for (let side = 0; side < 2; side++) {
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const width = Math.pow(Math.sin(Math.PI * t), .8) * (leaf ? .36 : .24) + .005
      for (let j = 0; j <= across; j++) {
        const v = j / across * 2 - 1
        positions.push(v * width, Math.sin(t * Math.PI) * .14 + t * t * .16 + v * v * .075 - side * .035, t * (leaf ? 1.5 : 1.2))
        if (i < segments && j < across) {
          const a = side * (segments + 1) * (across + 1) + i * (across + 1) + j
          const b = a + across + 1
          indices.push(...(side ? [a, b, a + 1, b, b + 1, a + 1] : [a, a + 1, b, b, a + 1, b + 1]))
        }
      }
    }
  }
  const offset = (segments + 1) * (across + 1)
  for (let i = 0; i < segments; i++) for (const j of [0, across]) {
    const a = i * (across + 1) + j, b = a + across + 1
    indices.push(a, b, a + offset, b, b + offset, a + offset)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices); geometry.computeVertexNormals(); geometry.computeBoundingSphere()
  return geometry
}
export function glowMaterial(color, roughness = .65) {
  const material = new THREE.MeshStandardMaterial({ color, roughness, metalness: .08, side: THREE.DoubleSide })
  material.onBeforeCompile = shader => {
    shader.vertexShader = 'attribute float aGlow; varying float vGlow;\n' + shader.vertexShader
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvGlow = aGlow;')
    shader.fragmentShader = 'varying float vGlow;\n' + shader.fragmentShader
    shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(1.0, 0.57, 0.12) * vGlow;')
  }
  material.customProgramCacheKey = () => 'flower-glow-v1'
  return material
}
