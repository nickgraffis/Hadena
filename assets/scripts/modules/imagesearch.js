const hadena = require('hadenajs');
const math = require('matematik');
const prototype = require('./prototype.js')
const work = require('webworkify');
const w = work(require('./worker.js'));
const url = 'https://www.googleapis.com/customsearch/v1?key=' + 'AIzaSyACjaZLemAxecYCv5rZM_JQBIcEwM7t6NE' + '&cx=003721172336159961663:yl9lk4zjfw1&searchType=image&num=10&fields=items(link)';
var currentDisplayVariable = localStorage.getItem('displayVariable') ? localStorage.getItem('displayVariable') : localStorage.setItem('displayVariable', 'hex');

/*
* Show the image of the box with the ID of imageid by changing the background image of the box
*/
var imageVisable = 0;

w.addEventListener('message', ({data}) => {
  console.log(data);
    fillPalette(data);
});

var items = {};
function search (query) {
  items = {};
  var request = url + "&q=" + query;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      items = JSON.parse(xhttp.responseText).items;
      more(query, 11);
    }
  };
xhttp.open("GET", request, true);
xhttp.send();
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
      show(items, 0);
    }
  };
xhttp.open("GET", request, true);
xhttp.send();
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
function show (items, startNumber) {
  for (let i = 0; i < 20; i++) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let img = new Image();
    let googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
    img.crossOrigin = 'Anonymous';
    img.src = googleProxyURL + encodeURIComponent(items[i].link);
    console.log(items[i].link);
    img.onload = function () {
      let num = math.englishify(i);
      canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
      let aspectRatio = img.height / img.width;
      canvas.width = 100;
      canvas.height = aspectRatio * canvas.width;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      let palette = hadena.extractColorPalette(canvas, 1);
      let hex = hadena.fullColorHex(palette[0].r, palette[0].g, palette[0].b);
      document.querySelector("#" + num + "bg").style.backgroundColor = "#" + hex;
      document.querySelector("#" + num + "palette").style.backgroundColor = "#" + hex;
      var attribute = {image: items[i].link, color: "#" + hex};
      document.querySelector("#" + num + "bg").setAttribute('data-attribute', JSON.stringify(attribute));
      console.log(hex);
      console.log(hadena.hexToRGB('#' + hex));
      document.querySelector("#" + num).innerHTML = currentDisplayVariable === 'hex' ? "#" + hex : hadena.hexToRGB('#' + hex);
      if (hadena.getColorMood("#" + hex, 4) === 'BRIGHT') {
        document.querySelector("#" + num + "bg").style.color = "#242424";
        document.querySelector("#" + num + "alert").style.color = "#242424";
      } else if (hadena.getColorMood("#" + hex, 4) === 'LIGHT') {
          document.querySelector("#" + num + "bg").style.color = "#363636";
          document.querySelector("#" + num + "alert").style.color = "#363636";
      } else if (hadena.getColorMood("#" + hex, 4) === 'DIM') {
        document.querySelector("#" + num + "bg").style.color = "#B5B5B5";
        document.querySelector("#" + num + "alert").style.color = "#B5B5B5";
      } else {
        document.querySelector("#" + num + "bg").style.color = "#F5F5F5";
        document.querySelector("#" + num + "alert").style.color = "#F5F5F5";
      }
      if (i === 0) {
        document.querySelector("#small-koi").style.fill = "#" + hex;
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
        document.querySelector("#" + num + '-' + math.englishify(k) + "bg").style.backgroundColor = "#" + hadena.fullColorHex(palette[i][k].r, palette[i][k].g, palette[i][k].b);
      }
    }
}

window.showImage = function (imageid)
{
  let num = math.englishify(imageid);
  var box = document.querySelector("#" + num + "bg");
  var palette = document.querySelector("#" + num + "palette");
  var url = JSON.parse(box.getAttribute('data-attribute')).image;
  box.style.backgroundImage = "url(" + url + ")";
  palette.style.backgroundColor = 'transparent';
  imageVisable = 1;
}

/*
* Hide the image of the box with the ID of imageid by setting background image back to null
*/
window.hideImage = function (imageid)
{
  if (imageVisable === 1)
  {
    let num = math.englishify(imageid);
    document.querySelector("#" + num + "bg").style.backgroundImage = null;
  }
}

window.displayVariable = function ()
{
  if (localStorage.getItem('displayVariable')) {
    if (localStorage.getItem('displayVariable') === 'hex') {
      console.log(localStorage.getItem('displayVariable'))
      var type = 'rgb';
      document.getElementById('displayvariable').innerHTML = 'rgb( )';
    } else {
      console.log(localStorage.getItem('displayVariable'))
      document.getElementById('displayvariable').innerHTML = '#hex';
      var type = 'hex';
    }
  }
  console.log(type);
  let items = document.getElementsByClassName('hex');
  console.log(items);
  for (let i = 0; i < items.length; i++) {
  console.log(items[i]);
    if (type === 'rgb') {
      console.log(hadena.hexToRGB(items[i].innerHTML));
      items[i].innerHTML = hadena.hexToRGB(items[i].innerHTML);
    } else {
      let rgbItem = items[i].innerHTML.split('rgb(')[1];
      rgbItem = rgbItem.substring(rgbItem.length - 1, 0);
      console.log(rgbItem);
      let rgb = rgbItem.split(',');
      console.log(rgb);
      items[i].innerHTML = '#' + hadena.fullColorHex(rgb[0], rgb[1], rgb[2]);
    }
    items[i].classList.add(type + '_value');
    items[i].classList.remove(currentDisplayVariable + '_value');
  }

  localStorage.setItem('displayVariable', type);
  currentDisplayVariable = localStorage.getItem('displayVariable') ? localStorage.getItem('displayVariable') : localStorage.setItem('displayVariable', 'hex');
}

/*
* Copy the text of the box with an ID of hexid
* Flash an alert for this box as well
*/
window.copyHex = function (hexid) {
  let num = math.englishify(hexid);
  document.querySelector("#" + num + "alert").style.visibility = "visible";
  var fadeTarget = document.querySelector("#" + num + "alert");
  var fadeEffect = setInterval(function () {
      if (!fadeTarget.style.opacity) {
          fadeTarget.style.opacity = 1;
      }
      if (fadeTarget.style.opacity > 0) {
          fadeTarget.style.opacity -= 0.1;
      } else {
          clearInterval(fadeEffect);
      }
  }, 100);

  fadeTarget.style.opacity = 1;
  var text = document.querySelector("#" + num).innerText;
  var elem = document.createElement("textarea");
  document.body.appendChild(elem);
  elem.value = text;
  elem.select();
  document.execCommand("copy");
  document.body.removeChild(elem);
}

function parseId(id) {
  var twoIds = id.split('bg');
  var boxId = twoIds[0].split('-');
  console.log(boxId);
  return boxId;
}

window.changeColor = function (boxId) {
  console.log(boxId);
  var box = parseId(boxId);
  var color = document.getElementById(boxId).getAttribute('data-color');
  if (getColorMood(color, 4) === 'BRIGHT') {
    console.log('BRINGT');
    document.getElementById(box[0] + "bg").style.color = "#242424";
    document.querySelector("#" + box[0] + "palette").style.color = "#242424";
  } else if (getColorMood(color, 4) === 'LIGHT') {
      console.log('LIGHT');
      document.getElementById(box[0] + "bg").style.color = "#363636";
      document.querySelector("#" + box[0] + "palette").style.color = "#363636";

  } else if (getColorMood(color, 4) === 'DIM') {
      console.log('DIM');
      document.getElementById(box[0] + "bg").style.color = "#B5B5B5";
      document.querySelector("#" + box[0] + "palette").style.color = "#B5B5B5";

  } else {
      console.log('DARK');
      document.getElementById(box[0] + "bg").style.color = "#F5F5F5";
      document.querySelector("#" + box[0] + "palette").style.color = "#F5F5F5";

  }
  var dataObject = JSON.parse(document.querySelector("#" + box[0] + "bg").getAttribute('data-attribute'));
  var oldColor = dataObject.color;
  var newDataObject = {image: dataObject.image, color: color};
  document.getElementById(boxId).style.color = oldColor;
  document.getElementById(boxId).setAttribute('data-color', oldColor);
  document.querySelector("#" + box[0] + "bg").setAttribute('data-attribute', JSON.stringify(newDataObject));
  document.querySelector("#" + box[0]).innerHTML = color;
  document.querySelector("#" + box[0] + "bg").style.backgroundColor = color;
  document.querySelector("#" + box[0] + "palette").style.backgroundColor = color;
}

console.log(currentDisplayVariable);


module.exports = {
  search: search,
  currentDisplayVariable: currentDisplayVariable
}
