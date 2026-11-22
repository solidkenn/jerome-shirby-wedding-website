/** Stable seed shuffle (Mulberry32). */
function createRng(seed) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

function seededShuffle(items, seed) {
  const rng = createRng(seed)
  const out = [...items]
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Rough batch key so same-day shoots are spread apart in the film strip rows. */
export function galleryGroupKey(file) {
  const date = file.match(/^(\d{8})/)
  if (date) return `d:${date[1]}`
  if (file.startsWith('fxn')) return 'fxn'
  if (file.startsWith('IMG_058')) return 'img58'
  if (file.startsWith('IMG_059')) return 'img59'
  if (file.startsWith('IMG_060')) return 'img60'
  if (file.startsWith('FB_')) return 'fb'
  if (file.startsWith('Image')) return 'image0577'
  if (file.startsWith('received_')) return 'received'
  return `f:${file.slice(0, 12)}`
}

function roundRobinByGroup(photos, seed = 0x6a736772) {
  const buckets = new Map()
  for (const photo of photos) {
    const key = galleryGroupKey(photo.file)
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key).push(photo)
  }

  for (const [key, list] of buckets) {
    buckets.set(key, seededShuffle(list, seed + key.split('').reduce((a, c) => a + c.charCodeAt(0), 0)))
  }

  const keys = [...buckets.keys()].sort((a, b) => buckets.get(b).length - buckets.get(a).length)
  const result = []
  let placed = true
  while (placed) {
    placed = false
    for (const key of keys) {
      const list = buckets.get(key)
      if (list?.length) {
        result.push(list.shift())
        placed = true
      }
    }
  }
  return result
}

/**
 * Film strip uses column-major 3 rows: indices 0,3,6… share a horizontal row.
 * Swap items so batches rarely repeat within the same row.
 */
function spreadFilmStripRows(photos, rows = 3) {
  const result = [...photos]
  const n = result.length
  const conflicts = (idx) => {
    const row = idx % rows
    const key = galleryGroupKey(result[idx].file)
    let count = 0
    for (let j = row; j < n; j += rows) {
      if (j !== idx && galleryGroupKey(result[j].file) === key) count += 1
    }
    return count
  }

  for (let pass = 0; pass < n * 2; pass += 1) {
    let improved = false
    for (let i = 0; i < n; i += 1) {
      if (conflicts(i) === 0) continue
      const rowI = i % rows
      for (let j = i + 1; j < n; j += 1) {
        if (j % rows === rowI) continue
        if (galleryGroupKey(result[j].file) === galleryGroupKey(result[i].file)) continue
        const before = conflicts(i) + conflicts(j)
        ;[result[i], result[j]] = [result[j], result[i]]
        const after = conflicts(i) + conflicts(j)
        if (after < before) {
          improved = true
          break
        }
        ;[result[i], result[j]] = [result[j], result[i]]
      }
    }
    if (!improved) break
  }
  return result
}

/** Gallery grid: avoid neighbors that share a batch (left/right and above). */
function spreadGalleryGrid(photos, columns = 3) {
  const result = [...photos]
  const n = result.length
  const neighborGroups = (idx) => {
    const keys = new Set([galleryGroupKey(result[idx].file)])
    const col = idx % columns
    const candidates = [idx - 1, idx + 1, idx - columns, idx + columns].filter(
      (j) => j >= 0 && j < n && Math.abs((j % columns) - col) <= 1,
    )
    for (const j of candidates) keys.add(galleryGroupKey(result[j].file))
    return keys.size
  }

  for (let pass = 0; pass < n * 3; pass += 1) {
    let improved = false
    for (let i = 0; i < n; i += 1) {
      const score = neighborGroups(i)
      if (score >= Math.min(columns + 2, 4)) continue
      for (let j = i + 1; j < n; j += 1) {
        if (galleryGroupKey(result[j].file) === galleryGroupKey(result[i].file)) continue
        ;[result[i], result[j]] = [result[j], result[i]]
        if (neighborGroups(i) > score) {
          improved = true
          break
        }
        ;[result[i], result[j]] = [result[j], result[i]]
      }
    }
    if (!improved) break
  }
  return result
}

export function orderGalleryPhotos(photos) {
  const interleaved = roundRobinByGroup(photos)
  const forFilm = spreadFilmStripRows(interleaved, 3)
  return spreadGalleryGrid(forFilm, 3)
}