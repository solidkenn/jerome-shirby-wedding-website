import { useEffect, useRef, useState } from 'react'
import { lookupGuests } from './rsvpLookup.js'

export function useGuestNameLookup(endpoint, name) {
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const requestId = useRef(0)

  useEffect(() => {
    const q = name.trim()
    if (!endpoint || q.length < 2) {
      setSuggestions([])
      setOpen(false)
      setLoading(false)
      return undefined
    }

    const id = ++requestId.current
    setLoading(true)
    const timer = setTimeout(() => {
      lookupGuests(endpoint, q).then((results) => {
        if (id !== requestId.current) return
        setSuggestions(results)
        setOpen(results.length > 0)
        setLoading(false)
      })
    }, 350)

    return () => clearTimeout(timer)
  }, [endpoint, name])

  const dismiss = () => {
    setOpen(false)
  }

  return { suggestions, open, loading, dismiss, setOpen }
}