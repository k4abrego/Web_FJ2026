import { useEffect, useRef, useState } from 'react'

const UNITY_LOADER_SRC = '/unity-build/Build/unity-build.loader.js'
const UNITY_INIT_SRC = '/js/unity-init.js'

function loadScript(src, forceReload = false) {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`)
    if (existingScript) {
      if (forceReload) {
        existingScript.remove()
      } else {
        if (existingScript.dataset.loaded === 'true') {
          resolve()
          return
        }
        existingScript.addEventListener('load', () => resolve(), { once: true })
        existingScript.addEventListener('error', () => reject(new Error(`No se pudo cargar ${src}`)), {
          once: true,
        })
        return
      }
    }

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => {
      script.dataset.loaded = 'true'
      resolve()
    }
    script.onerror = () => reject(new Error(`No se pudo cargar ${src}`))
    document.body.appendChild(script)
  })
}

function UnityCanvas() {
  const canvasRef = useRef(null)
  const loadingRef = useRef(null)
  const progressRef = useRef(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let isCancelled = false

    if (canvasRef.current) {
      canvasRef.current.setAttribute('id', 'unity-canvas')
    }
    if (loadingRef.current) {
      loadingRef.current.setAttribute('id', 'unity-loading')
    }
    if (progressRef.current) {
      progressRef.current.setAttribute('id', 'unity-progress-fill')
    }

    loadScript(UNITY_LOADER_SRC)
      .then(() => loadScript(UNITY_INIT_SRC, true))
      .then(() => {
        if (!isCancelled) {
          // unity-init.js se encarga del overlay y progreso
          setStatus('ready')
        }
      })
      .catch((error) => {
        console.error('Unity error:', error)
        setStatus('error')
      })

    return () => {
      isCancelled = true
      const unityInstance = window.unityInstance
      if (unityInstance && typeof unityInstance.Quit === 'function') {
        unityInstance.Quit()
      }
      window.unityInstance = null
    }
  }, [])

  return (
    <div className="unity-shell" id="unity-shell">
      <canvas
        ref={canvasRef}
        width="960"
        height="600"
        tabIndex="1"
        aria-label="Canvas del videojuego"
      ></canvas>

      {status !== 'error' ? (
        <div ref={loadingRef} className="unity-loading">
          <h3>Cargando juego...</h3>
          <div className="unity-progress-bar">
            <div ref={progressRef} className="unity-progress-fill"></div>
          </div>
        </div>
      ) : (
        <div className="unity-loading">
          <h3>Error al cargar el juego.</h3>
        </div>
      )}
    </div>
  )
}

export default UnityCanvas
