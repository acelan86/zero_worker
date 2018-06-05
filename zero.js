const zeroPad = num => '00000000'.slice(String(num).length) + num

const textToBinary = username => (
  username.split('').map(char => zeroPad(char.charCodeAt(0).toString(2))).join(' ')
)

const binaryToZeroWidth = binary => (
  binary.split('').map((binaryNum) => {
    const num = parseInt(binaryNum, 10)
    if (num === 1) {
      return String.fromCharCode(8203)
    } else if (num === 0) {
      return String.fromCharCode(8204)
    }
    return String.fromCharCode(8205)
  }).join(String.fromCharCode(65279))
);

function encode (username) {
  const binaryUsername = textToBinary(username)
  const zeroWidthUsername = binaryToZeroWidth(binaryUsername)
  return zeroWidthUsername
}

const zeroWidthToBinary = string => (
  string.split(String.fromCharCode(65279)).map((char) => {
    if (char === String.fromCharCode(8203)) {
      return '1'
    } else if (char === String.fromCharCode(8204)) {
      return '0'
    }
    return ' '
  }).join('')
)

const binaryToText = string => (
  string.split(' ').map(num => String.fromCharCode(parseInt(num, 2))).join('')
);

function decode (zeroWidthUsername) {
  const binaryUsername = zeroWidthToBinary(zeroWidthUsername)
  const textUsername = binaryToText(binaryUsername)
  return textUsername
}

self.encode = encode;
self.decode = decode;