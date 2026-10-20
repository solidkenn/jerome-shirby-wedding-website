import { useRef, useState } from 'react'
import { uploadApiUrl, uploadMaxFiles } from '../data/wedding.js'
import Ornament from './Ornament.jsx'
import './PhotoUpload.css'

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

function uploadFile(file, apiUrl, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          resolve(JSON.parse(xhr.responseText))
        } catch {
          reject(new Error('Unexpected response from server.'))
        }
      } else {
        let msg = 'Upload failed.'
        try {
          msg = JSON.parse(xhr.responseText).error || msg
        } catch {
          /* use default */
        }
        reject(new Error(msg))
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Network error.')))
    xhr.open('POST', apiUrl)
    xhr.send(formData)
  })
}

export default function PhotoUpload({ onUploaded }) {
  const inputRef = useRef(null)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  const configured = Boolean(uploadApiUrl)

  const clearSelection = () => {
    setFiles([])
    setPreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url))
      return []
    })
    if (inputRef.current) inputRef.current.value = ''
    setError('')
    setSuccess(null)
  }

  const pickFiles = (fileList) => {
    setError('')
    setSuccess(null)
    const images = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (!images.length) {
      setError('Please choose image files only (JPEG, PNG, GIF, WebP).')
      return
    }
    const next = images.slice(0, uploadMaxFiles)
    if (images.length > uploadMaxFiles) {
      setError(`You can upload up to ${uploadMaxFiles} images at a time. Only the first ${uploadMaxFiles} were added.`)
    }
    previews.forEach((p) => URL.revokeObjectURL(p.url))
    setFiles(next)
    setPreviews(next.map((f) => ({ name: f.name, size: f.size, url: URL.createObjectURL(f) })))
  }

  const removeAt = (index) => {
    if (uploading) return
    const nextFiles = files.filter((_, i) => i !== index)
    const nextPreviews = previews.filter((_, i) => {
      if (i === index) URL.revokeObjectURL(previews[i].url)
      return i !== index
    })
    setFiles(nextFiles)
    setPreviews(nextPreviews)
    if (!nextFiles.length) clearSelection()
  }

  const submit = async () => {
    if (!configured || !files.length || uploading) return

    setUploading(true)
    setProgress(0)
    setError('')
    setSuccess(null)

    const total = files.length
    const uploaded = []
    const failed = []

    for (let i = 0; i < total; i++) {
      setProgressLabel(`Uploading ${i + 1} of ${total}…`)
      try {
        const data = await uploadFile(files[i], uploadApiUrl, (filePct) => {
          const overall = Math.round(((i + filePct / 100) / total) * 100)
          setProgress(overall)
        })
        uploaded.push({
          src: data.url,
          alt: data.originalName || 'Guest photo',
          uploadedAt: data.uploadedAt,
        })
      } catch (err) {
        failed.push({ name: files[i].name, message: err.message })
      }
    }

    setUploading(false)
    setProgress(100)
    setProgressLabel('Done')

    if (uploaded.length) {
      onUploaded?.(uploaded)
      previews.forEach((p) => URL.revokeObjectURL(p.url))
      setFiles([])
      setPreviews([])
      if (inputRef.current) inputRef.current.value = ''
      setSuccess(
        uploaded.length === 1
          ? 'Thank you! Your photo was uploaded successfully.'
          : `Thank you! ${uploaded.length} photos were uploaded successfully.`,
      )
    }

    if (failed.length) {
      const detail = failed.map((f) => `${f.name}: ${f.message}`).join(' ')
      setError(
        uploaded.length
          ? `${uploaded.length} uploaded, ${failed.length} failed. ${detail}`
          : detail,
      )
    }
  }

  return (
    <div className="photo-upload card">
      <div className="photo-upload__intro">
        <Ornament />
        <p className="eyebrow">During the celebration</p>
        <h2 className="photo-upload__title">Share your photos</h2>
        <p className="photo-upload__lead">
          Capture a moment from our wedding day and upload it here so we can cherish it with you.
        </p>
      </div>

      {!configured && (
        <p className="photo-upload__notice" role="status">
          Photo upload is not configured yet. Add <code>VITE_UPLOAD_URL</code> to your environment (see{' '}
          <code>.env.example</code>).
        </p>
      )}

      <div
        className={dragOver ? 'photo-upload__drop photo-upload__drop--over' : 'photo-upload__drop'}
        onDragOver={(e) => {
          e.preventDefault()
          if (configured) setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          if (configured) pickFiles(e.dataTransfer.files)
        }}
        onClick={() => configured && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (configured && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        role="button"
        tabIndex={configured ? 0 : -1}
        aria-disabled={!configured}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="photo-upload__input"
          disabled={!configured || uploading}
          onChange={(e) => e.target.files?.length && pickFiles(e.target.files)}
        />
        <span className="photo-upload__drop-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </span>
        <p className="photo-upload__drop-label">
          {configured ? 'Tap to choose photos or drag them here' : 'Upload unavailable'}
        </p>
        <p className="photo-upload__drop-hint">Images only · up to {uploadMaxFiles} at a time</p>
      </div>

      {previews.length > 0 && (
        <div className="photo-upload__previews">
          <p className="photo-upload__summary">
            {previews.length === 1 ? '1 image selected' : `${previews.length} images selected`}
          </p>
          <ul className="photo-upload__grid">
            {previews.map((p, i) => (
              <li key={p.url} className="photo-upload__thumb">
                <img src={p.url} alt="" />
                <button
                  type="button"
                  className="photo-upload__remove"
                  aria-label={`Remove ${p.name}`}
                  disabled={uploading}
                  onClick={(e) => {
                    e.stopPropagation()
                    removeAt(i)
                  }}
                >
                  ×
                </button>
                <span className="photo-upload__meta">
                  <span className="photo-upload__name">{p.name}</span>
                  <span className="photo-upload__size">{formatBytes(p.size)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {uploading && (
        <div className="photo-upload__progress" aria-live="polite">
          <div className="photo-upload__progress-top">
            <span>{progressLabel}</span>
            <span>{progress}%</span>
          </div>
          <div className="photo-upload__progress-bar">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {error && (
        <p className="photo-upload__error" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="photo-upload__success" role="status">
          {success}
        </p>
      )}

      {previews.length > 0 && configured && (
        <button type="button" className="btn btn--primary photo-upload__submit" disabled={uploading} onClick={submit}>
          {uploading ? 'Uploading…' : previews.length === 1 ? 'Upload photo' : `Upload ${previews.length} photos`}
        </button>
      )}
    </div>
  )
}
