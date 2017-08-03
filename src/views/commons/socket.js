const io = require('socket.io-client');

class Socket extends io {
  change (url, base) {
    return Socket(url, base);
  }
}

export default function (url, base) {
  return new Socket(url, base);
}