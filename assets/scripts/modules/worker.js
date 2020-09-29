const hadena = require('hadenajs');

self.addEventListener('message', ({data}) => {
  console.log(data.data);
  let palette = [];
  for (let i = 0; i < data.data.length; i++) {
      palette.push(hadena.pixelsToColours(data.data[i], 6));
    }
    console.log(palette);
    self.postMessage(palette);
})
