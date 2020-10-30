const hadena = require('hadenajs');

self.addEventListener('message', ({data}) => {
  console.log(data.pixels);
  let palette = hadena.pixelsToColors(data.pixels, 6);
  console.log(palette);
  self.postMessage({palette: palette, id: data.id});
})
