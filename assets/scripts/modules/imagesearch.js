const hadena = require('hadenajs');
const math = require('matematik');
const work = require('webworkify')
const w = work(require('./worker.js'));

w.addEventListener('message', ({data}) => {
  console.log(data);
    fillPalette(data);
});

var items = {};
var hexes = [];
function search (query) {
  console.log(query);
  var request = url + "&q=" + query;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      items = JSON.parse(xhttp.responseText).items;
      console.log(items);
      more(query, 11);
    }
  };
  xhttp.open("GET", request, true);
  xhttp.send();
  return true;
}

/*
* Get 10 more requests starting from startNumber and push() them to items object
*/
function more (query, startNumber) {
  var request = url + "&start=" + startNumber + "&q=" + query;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      for (let i = 0; i < 10; i++) {
        item = JSON.parse(xhttp.responseText).items[i];
        items.push(item);
      }
      console.log(items);
    }
  };
  xhttp.open("GET", request, true);
  xhttp.send();
  return true;
}

function getImages (query) {
  search(query);
  return items;
}

function getColors (items) {
  for (let i = 0; i < 20; i++) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let img = new Image();
    let googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
    img.crossOrigin = 'Anonymous';
    img.src = googleProxyURL + encodeURIComponent(items[i].link);
    img.onload = function () {
      canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
      let aspectRatio = img.height / img.width;
      canvas.width = 100;
      canvas.height = aspectRatio * canvas.width;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      let palette = hadena.extractColorPalette(canvas, 1);
      let hex = hadena.fullColorHex(palette[0].r, palette[0].g, palette[0].b);
      hexes.push(hex);
    }
  }
  if(hexes.length >= 20) {
    return hexes;
  }
}

/*
* For each box, there are 20...
* Create a new ColorThief() object
* Create a new Image() object
* Add Google Proxy URL and image URL to Image() object, and set Cross Origin permission to Anonymous
* Turn the resulting ColorThief() color to a HEX and change the background color of the box to that color
* Add the HEX number to the box as text
* Determine if the color is lightOrDark and change the text color of the box to be the opposite
* Change the color of the koi logo to the first color
* Log errors
*/
function show (colors) {
  for (let i = 0; i < 20; i++) {
    let num = math.englishify(i);
    let hex = colors[i];
    document.querySelector("#" + num + "bg").style.backgroundColor = "#" + hex;
    document.querySelector("#" + num + "palette").style.backgroundColor = "#" + hex;
    var attribute = {image: items[i].link, color: "#" + hex};
    document.querySelector("#" + num + "bg").setAttribute('data-attribute', JSON.stringify(attribute));
    document.querySelector("#" + num).innerHTML = "#" + hex;
    if (hadena.getColorMood("#" + hex, 4) === 'BRIGHT') {
      document.querySelector("#" + num + "bg").style.color = "#242424";
      document.querySelector("#" + num + "alert").style.color = "#242424";
      document.querySelector("#" + num + "palette").style.color = "#242424";
    } else if (hadena.getColorMood("#" + hex, 4) === 'LIGHT') {
        document.querySelector("#" + num + "bg").style.color = "#363636";
        document.querySelector("#" + num + "alert").style.color = "#363636";
        document.querySelector("#" + num + "palette").style.color = "#363636";
    } else if (hadena.getColorMood("#" + hex, 4) === 'DIM') {
      document.querySelector("#" + num + "bg").style.color = "#B5B5B5";
      document.querySelector("#" + num + "alert").style.color = "#B5B5B5";
      document.querySelector("#" + num + "palette").style.color = "#B5B5B5";
    } else {
      document.querySelector("#" + num + "bg").style.color = "#F5F5F5";
      document.querySelector("#" + num + "alert").style.color = "#F5F5F5";
      document.querySelector("#" + num + "palette").style.color = "#F5F5F5";
    }
    if (i === 0) {
      if (document.getElementById("koi")){
        document.getElementById("koi").style.fill = "#" + hex;
      } else if (document.getElementById("small-koi")) {
        document.getElementById("small-koi").style.fill = "#" + hex;
      }
    }
  }
  let pixels = [];
  for (let i = 0; i < 20; i++) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let img = new Image();
    let googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
    img.crossOrigin = 'Anonymous';
    img.src = googleProxyURL + encodeURIComponent(items[i].link);
    img.onload = function () {
      let num = math.englishify(i);
      canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
      let aspectRatio = img.height / img.width;
      canvas.width = 100;
      canvas.height = aspectRatio * canvas.width;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      pixels.push(hadena.extractPixelData(canvas));
    }
  }
  var timeout = setInterval(function() {
      console.log('checking');
    if(pixels.length > 15) { //It might never reach 20 if there is an issue with the image
      console.log(pixels);
      w.postMessage({data: pixels});
      clearInterval(timeout);
    }
}, 100);
}


function fillPalette (palette) {
console.log(palette);
  for (let i = 0; i < palette.length; i++) {
    let num = math.englishify(i);
      for (let k = 0; k < 6; k++) {
        console.log(palette[i][k]);
        document.querySelector("#" + num + '-' + math.englishify(k) + "bg").setAttribute('data-color', "#" + hadena.fullColorHex(palette[i][k].r, palette[i][k].g, palette[i][k].b));
        document.querySelector("#" + num + '-' + math.englishify(k) + "bg").style.color = "#" + hadena.fullColorHex(palette[i][k].r, palette[i][k].g, palette[i][k].b);
      }
    }
}

module.exports = {
  search: search,
  show: show,
  getImages: getImages
}
