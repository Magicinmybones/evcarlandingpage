import { useEffect, useState } from 'react'

const MINIMUM_DISPLAY_TIME = 1100
const ASSET_TIMEOUT = 30000

function getMediaAssets() {
  const assets = new Map()

  const addAsset = (source, type) => {
    if (!source) return
    const url = new URL(source, window.location.href).href
    if (!assets.has(url)) {
      assets.set(url, {
        id: url,
        url,
        type,
        weight: type === 'video' ? 6 : 1,
      })
    }
  }

  document.querySelectorAll('img').forEach((image) => {
    addAsset(image.currentSrc || image.src, 'image')
  })

  document.querySelectorAll('video').forEach((video) => {
    const selectedSource = video.currentSrc
      || video.src
      || video.querySelector('source')?.src
    addAsset(selectedSource, 'video')
  })

  document.querySelectorAll('[data-preload-background]').forEach((element) => {
    addAsset(element.dataset.preloadBackground, 'image')
  })

  return [...assets.values()]
}

function loadImage(url, signal, onProgress) {
  return new Promise((resolve) => {
    const image = new Image()
    let settled = false

    const finish = async () => {
      if (settled) return
      settled = true
      window.clearTimeout(timeout)
      signal.removeEventListener('abort', finish)

      if (image.decode) {
        await image.decode().catch(() => undefined)
      }

      onProgress(1)
      resolve()
    }

    const timeout = window.setTimeout(finish, ASSET_TIMEOUT)
    signal.addEventListener('abort', finish, { once: true })
    image.addEventListener('load', finish, { once: true })
    image.addEventListener('error', finish, { once: true })
    image.src = url

    if (image.complete) finish()
  })
}

async function streamAsset(asset, signal, onProgress) {
  const response = await fetch(asset.url, {
    cache: 'force-cache',
    credentials: 'same-origin',
    signal,
  })

  if (!response.ok) {
    throw new Error(`Unable to preload ${asset.url}`)
  }

  const reader = response.body?.getReader()
  const contentLength = Number(response.headers.get('content-length'))

  if (!reader || !Number.isFinite(contentLength) || contentLength <= 0) {
    await response.blob()
    onProgress(1)
    return
  }

  let received = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    received += value.byteLength
    onProgress(Math.min(received / contentLength, 0.995))
  }

  onProgress(1)
}

async function preloadAsset(asset, signal, onProgress) {
  const isLocal = new URL(asset.url).origin === window.location.origin
  const assetController = new AbortController()
  const abortAsset = () => assetController.abort()
  const timeout = window.setTimeout(abortAsset, ASSET_TIMEOUT)
  signal.addEventListener('abort', abortAsset, { once: true })

  try {
    if (isLocal) {
      await streamAsset(asset, assetController.signal, onProgress)
    } else if (asset.type === 'image') {
      await loadImage(asset.url, assetController.signal, onProgress)
    }
  } catch {
    // A failed optional asset must not leave visitors trapped on the loader.
  } finally {
    window.clearTimeout(timeout)
    signal.removeEventListener('abort', abortAsset)
    onProgress(1)
  }
}

export default function SitePreloader({ onReveal, onDismiss }) {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('loading')

  useEffect(() => {
    const controller = new AbortController()
    const startedAt = performance.now()
    const assetProgress = new Map()
    let active = true
    let progressFrame = 0
    const timers = []

    document.body.classList.add('is-preloading')

    const wait = (duration) => new Promise((resolve) => {
      const timer = window.setTimeout(resolve, duration)
      timers.push(timer)
    })

    const updateProgress = (assets, asset, value) => {
      if (!active) return
      assetProgress.set(asset.id, Math.max(assetProgress.get(asset.id) || 0, value))

      if (progressFrame) return
      progressFrame = requestAnimationFrame(() => {
        progressFrame = 0
        const totalWeight = assets.reduce((sum, item) => sum + item.weight, 0)
        const loadedWeight = assets.reduce(
          (sum, item) => sum + (assetProgress.get(item.id) || 0) * item.weight,
          0,
        )
        const percentage = totalWeight ? (loadedWeight / totalWeight) * 100 : 100
        if (active) setProgress(Math.min(99, Math.floor(percentage)))
      })
    }

    const run = async () => {
      // Allow the complete React tree to commit before taking the media inventory.
      await new Promise((resolve) => requestAnimationFrame(resolve))
      if (!active) return

      const assets = getMediaAssets()
      assets.forEach((asset) => assetProgress.set(asset.id, 0))

      const mediaTasks = assets.map((asset) => preloadAsset(
        asset,
        controller.signal,
        (value) => updateProgress(assets, asset, value),
      ))

      const fontTask = document.fonts?.ready?.catch(() => undefined)
      await Promise.allSettled(fontTask ? [...mediaTasks, fontTask] : mediaTasks)

      const elapsed = performance.now() - startedAt
      if (elapsed < MINIMUM_DISPLAY_TIME) {
        await wait(MINIMUM_DISPLAY_TIME - elapsed)
      }
      if (!active) return

      setProgress(100)
      setStage('ready')

      await wait(420)
      if (!active) return
      onReveal()
      setStage('exiting')

      await wait(850)
      if (!active) return
      document.body.classList.remove('is-preloading')
      onDismiss()
    }

    run()

    return () => {
      active = false
      controller.abort()
      if (progressFrame) cancelAnimationFrame(progressFrame)
      timers.forEach(window.clearTimeout)
      document.body.classList.remove('is-preloading')
    }
  }, [onDismiss, onReveal])

  const percentage = String(progress).padStart(3, '0')

  return (
    <div
      className={`site-preloader is-${stage}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading Blinq website: ${progress}%`}
    >
      <div className="site-preloader-grid" aria-hidden="true" />

      <div className="site-preloader-top">
        <span className="site-preloader-brand"><i /> BLINQ</span>
        <span>BATTERY MOBILITY / 2026</span>
      </div>

      <div className="site-preloader-center">
        <span className="site-preloader-kicker">
          {progress === 100 ? 'SYSTEM READY' : 'PREPARING THE EXPERIENCE'}
        </span>
        <div className="site-preloader-value" aria-hidden="true">
          <strong>{percentage}</strong>
          <span>%</span>
        </div>
        <div
          className="site-preloader-progress"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={progress}
        >
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </div>

      <div className="site-preloader-bottom">
        <span>MEDIA SYSTEMS</span>
        <span><i /> {progress === 100 ? 'READY' : 'SYNCING ASSETS'}</span>
      </div>
    </div>
  )
}
