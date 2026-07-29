import { writeFile } from 'node:fs/promises'

const port = 9223
const pageUrl = 'http://127.0.0.1:4173/'

const createTarget = async () => {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(pageUrl)}`, {
    method: 'PUT',
  })
  return response.json()
}

const capture = async ({ width, height, output }) => {
  const target = await createTarget()
  const socket = new WebSocket(target.webSocketDebuggerUrl)
  const pending = new Map()
  let messageId = 0

  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data)
    if (!message.id || !pending.has(message.id)) return
    const { resolve, reject } = pending.get(message.id)
    pending.delete(message.id)
    if (message.error) reject(new Error(message.error.message))
    else resolve(message.result)
  })

  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })

  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++messageId
    pending.set(id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })

  await send('Page.enable')
  await send('Runtime.enable')
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 600,
  })
  await send('Page.navigate', { url: pageUrl })
  let sectionReady = false
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const check = await send('Runtime.evaluate', {
      expression: `Boolean(document.querySelector('.brand-grid-section'))`,
      returnByValue: true,
    })
    if (check.result.value) {
      sectionReady = true
      break
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  if (!sectionReady) throw new Error('Support section did not render')

  await send('Runtime.evaluate', {
    expression: `document.querySelector('.brand-grid-section').scrollIntoView({ block: 'start' })`,
  })
  await send('Runtime.evaluate', {
    expression: `Promise.all(
      [...document.querySelectorAll('.brand-grid-section img')]
        .map((image) => image.complete ? true : new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true })
          image.addEventListener('error', resolve, { once: true })
        }))
    )`,
    awaitPromise: true,
  })
  await new Promise((resolve) => setTimeout(resolve, 500))

  const section = await send('Runtime.evaluate', {
    expression: `(() => {
      const element = document.querySelector('.brand-grid-section')
      const rect = element.getBoundingClientRect()
      return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: element.scrollHeight
      }
    })()`,
    returnByValue: true,
  })
  console.log(width, section.result.value)

  const image = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    fromSurface: true,
    clip: {
      ...section.result.value,
      scale: 1,
    },
  })

  await writeFile(output, Buffer.from(image.data, 'base64'))
  socket.close()
}

await capture({
  width: 1440,
  height: 900,
  output: new URL('./desktop-support.png', import.meta.url),
})

await capture({
  width: 390,
  height: 844,
  output: new URL('./mobile-support.png', import.meta.url),
})
