const MIN_QUERY = 2

export function normalizeGuestName(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

function jsonpLookup(url) {
  return new Promise((resolve, reject) => {
    const callbackName = `rsvpLookup_${Date.now()}_${Math.random().toString(36).slice(2)}`
    const script = document.createElement('script')
    const u = new URL(url)
    u.searchParams.set('callback', callbackName)

    const cleanup = () => {
      delete window[callbackName]
      script.remove()
    }

    const timer = setTimeout(() => {
      cleanup()
      reject(new Error('Lookup timed out'))
    }, 12000)

    window[callbackName] = (data) => {
      clearTimeout(timer)
      cleanup()
      resolve(data)
    }

    script.onerror = () => {
      clearTimeout(timer)
      cleanup()
      reject(new Error('Lookup failed'))
    }

    script.src = u.toString()
    document.body.appendChild(script)
  })
}

/**
 * Search Guest List via Google Apps Script (?action=lookup&q=).
 * Tries CORS fetch first, then JSONP (script tag + callback).
 */
export async function lookupGuests(endpoint, query) {
  const q = String(query || '').trim()
  if (!endpoint || q.length < MIN_QUERY) return []

  const url = new URL(endpoint)
  url.searchParams.set('action', 'lookup')
  url.searchParams.set('q', q)

  try {
    const res = await fetch(url.toString(), { method: 'GET', mode: 'cors' })
    if (res.ok) {
      const data = await res.json()
      if (data?.ok && Array.isArray(data.results)) return data.results
    }
  } catch {
    // fall through to JSONP
  }

  try {
    const data = await jsonpLookup(url.toString())
    if (data?.ok && Array.isArray(data.results)) return data.results
  } catch {
  }

  return []
}