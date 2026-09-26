import test from 'node:test'
import assert from 'node:assert/strict'
import { createFlowers, lightPulse, SEQUENCE_DURATION } from '../src/utils/universe.js'

test('garden is deterministic and keeps a clear central flower', () => {
  const flowers = createFlowers(76)
  assert.deepEqual(flowers, createFlowers(76))
  assert.equal(flowers.length, 77)
  assert.equal(flowers[0].radius, 0)
  for (const flower of flowers.slice(1)) {
    assert.ok(flower.radius > 3.6 && flower.radius < 11.5)
    assert.ok(flower.scale < flowers[0].scale / 2)
    assert.ok(Math.abs(Math.hypot(flower.x, flower.z) - flower.radius) < 1e-10)
  }
})
test('light wave advances outside to inside and returns to darkness', () => {
  assert.ok(lightPulse(11.5, .8) > .9)
  assert.equal(lightPulse(0, .8), 0)
  assert.ok(lightPulse(5.75, 3) > .9)
  assert.equal(lightPulse(0, 3), 0)
  assert.ok(lightPulse(0, 5.2) > .9)
  for (const radius of [0, 5.75, 11.5]) {
    assert.equal(lightPulse(radius, -1), 0)
    assert.equal(lightPulse(radius, SEQUENCE_DURATION + .1), 0)
  }
})
