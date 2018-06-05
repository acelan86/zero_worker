self.addEventListener('message', (e) => {
  switch (e.data.type) {
    case 'inject':
      eval(e.data.data)
      self.postMessage({
        type: 'ready'
      })
      break
    case 'encode':
      self.postMessage({
        sid: e.data.sid,
        type: 'encode',
        data: encode(e.data.data)
      })
      break
    case 'decode':
      self.postMessage({
        sid: e.data.sid,
        type: 'decode',
        data: decode(e.data.data)
      })
    default: break
  }
})
self.postMessage({
  type: 'init',
  data: 'zero.png'
})