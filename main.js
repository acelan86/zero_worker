let lib = (() => {
  let _isReady = false
  let _cache = []
  let _callbacks = {}
  let _uuid = 0
  function _gen () {
    return 'u' + _uuid++
  }
  function _getCode (png, callback) {
    let source = png
    let img = document.createElement('img')
    img.onload = () => {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      let context = canvas.getContext("2d")
      context.drawImage(img, 0, 0)
      let imageData = context.getImageData(0, 0, canvas.width, canvas.height),
          pixels = imageData.data

      let buffer = []
      for (let i = 0, l = pixels.length; i < l; i++) {
          if (i % 4 == 3) continue
          if (!pixels[i]) break
          buffer.push(String.fromCharCode(pixels[i]))
      }
      callback(buffer.join(''))
      img = null
    }
    img.src = png
  }
  function _do (action, data, callback) {
    let sid = _gen()
    _callbacks[sid] = callback
    if (!_isReady) {
      _cache.push([sid, data, action])
    } else {
      worker.postMessage({
        sid: sid,
        type: action,
        data: data
      })
    }
  }

  var worker = new Worker('worker.js')
  worker.addEventListener('message', function (e) {
    switch (e.data.type) {
      case 'init':
        _getCode(e.data.data, (code) => {
          worker.postMessage({
            type: 'inject',
            data: code
          })
        })
        break
      case 'ready':
        _isReady = true
        while (action = _cache.pop()) {
          worker.postMessage({
            sid: action[0],
            type: action[2],
            data: action[1]
          })
          delete _cache
        }
        break
      case 'encode':
      case 'decode':
        _callbacks[e.data.sid] && _callbacks[e.data.sid](e.data.data)
        delete _callbacks[e.data.sid]
        break
      default: break
    }
  })

  return {
    encode (str, callback) {
      _do('encode', str, callback)
    },
    decode (str, callback) {
      _do('decode', str, callback)
    }
  }
})()