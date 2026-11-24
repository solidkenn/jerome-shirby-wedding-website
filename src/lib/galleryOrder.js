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
  return spreadGalleryGrid(interleaved, 3)
}

function pickWithDifferentGroup(queue, avoid) {
  if (!queue.length) return null
  if (!avoid) return queue.shift()
  const avoidKey = galleryGroupKey(avoid.file)
  const idx = queue.findIndex((p) => galleryGroupKey(p.file) !== avoidKey)
  if (idx === -1) return queue.shift()
  return queue.splice(idx, 1)[0]
}

/** Two-row mobile strip: uniform tiles, pairs fill each column (no span-2). */
function packFilmStripTwoRow(photos) {
  const spread = roundRobinByGroup(photos)
  const packed = []
  let i = 0
  while (i < spread.length) {
    packed.push({ ...spread[i], stripTall: false })
    if (i + 1 < spread.length) {
      packed.push({ ...spread[i + 1], stripTall: false })
      i += 2
    } else {
      i += 1
    }
  }
  return packed
}

/**
 * Film strip column-major grid. Tall = span 2 on desktop (3 rows).
 * Pack as short×3 columns, tall+short pairs, or leftover singles without span-2.
 */
export function packFilmStripColumns(photos, rows = 3) {
  if (rows === 2) return packFilmStripTwoRow(photos)

  const spread = roundRobinByGroup(photos)
  const tallQueue = spread.filter((p) => p.tall)
  const shortQueue = spread.filter((p) => !p.tall)
  const packed = []
  let tallFirst = true

  while (shortQueue.length >= rows && shortQueue.length > tallQueue.length) {
    for (let i = 0; i < rows; i += 1) {
      packed.push({ ...shortQueue.shift(), stripTall: false })
    }
  }

  while (tallQueue.length > 0 && shortQueue.length > 0) {
    if (tallFirst) {
      const tall = tallQueue.shift()
      const short = pickWithDifferentGroup(shortQueue, tall)
      packed.push({ ...tall, stripTall: true })
      packed.push({ ...short, stripTall: false })
    } else {
      const short = shortQueue.shift()
      const tall = pickWithDifferentGroup(tallQueue, short)
      packed.push({ ...short, stripTall: false })
      packed.push({ ...tall, stripTall: true })
    }
    tallFirst = !tallFirst
  }

  while (shortQueue.length >= rows) {
    for (let i = 0; i < rows; i += 1) {
      packed.push({ ...shortQueue.shift(), stripTall: false })
    }
  }

  while (tallQueue.length > 0 && shortQueue.length > 0) {
    const tall = tallQueue.shift()
    const short = pickWithDifferentGroup(shortQueue, tall)
    packed.push({ ...tall, stripTall: true })
    packed.push({ ...short, stripTall: false })
  }

  while (shortQueue.length > 0) {
    packed.push({ ...shortQueue.shift(), stripTall: false })
  }

  for (const tall of tallQueue) {
    packed.push({ ...tall, stripTall: false })
  }

  return packed
}