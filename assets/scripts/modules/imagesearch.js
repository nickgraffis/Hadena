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
    console.log(data.palette);
    fillPalette(data.id, data.palette);
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
      show(items, 0, items.length);
    }
  };
xhttp.open("GET", request, true);
xhttp.send();
}

function show (items, startNumber, itemsLength) {
  for (let i = startNumber; i < itemsLength; i++) {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');

    let image = new Image();

    let googleProxyURL =
    'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
    image.crossOrigin = 'Anonymous';
    image.src = googleProxyURL + encodeURIComponent(items[i].link);
    let num = math.englishify(i);

    image.onload = () => {
      let aspectRatio = image.height / image.width;
      canvas.width = 100;
      canvas.height = aspectRatio * canvas.width;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      let pixels = hadena.extractPixelData(canvas);
      let mainColor = hadena.pixelsToColors(pixels, 1);

      w.postMessage({id: num, pixels: pixels});

      let hex = '#' + hadena.fullColorHex(mainColor[0].r, mainColor[0].g, mainColor[0].b);

      let box = document.querySelector('#' + num);
      let boxBg = document.querySelector('#' + num + 'bg');
      let boxAlert = document.querySelector('#' + num + 'alert');
      boxBg.style.backgroundColor = hex;
      let attribute = {image: items[i].link, color: hex};
      boxBg.setAttribute('data-attribute', JSON.stringify(attribute));
      box.innerHTML = currentDisplayVariable === 'hex' ? hex : hadena.hexToRGB(hex);
      let colorMood = hadena.getColorMood(hex, 4);
      let fontColor = colorMood === 'BRIGHT' ? "#242424" :
      colorMood === 'LIGHT' ? "#363636" :
      colorMood === 'DIM' ? "#B5B5B5" : "#F5F5F5";
      boxBg.style.color = fontColor;
      boxAlert.style.color = fontColor;
      if (i === 0) {
        document.querySelector("#small-koi").style.fill = hex;
      }
    }
    image.onerror = () => {
      document.querySelector('#' + num + 'content').innerHTML +=
      '<span class="icon is-large has-text-danger" style="align-self: center;"><i class="fas fa-3x fa-exclamation-triangle" aria-hidden="true"></i></span>';
    }
  }
}

function fillPalette (id, palette) {
  console.log(palette);
  console.log(id);
  for (let i = 0; i < 6; i++) {
    let paletteBox = document.querySelector("#" + id + '-' + math.englishify(i) + "bg");
    let hex = '#' + hadena.fullColorHex(palette[i].r, palette[i].g, palette[i].b);
    paletteBox.setAttribute('data-color', hex);
    paletteBox.style.backgroundColor = hex;
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
    if (items[i].innerHTML) {
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
  if (hadena.getColorMood(color, 4) === 'BRIGHT') {
    console.log('BRINGT');
    document.getElementById(box[0] + "bg").style.color = "#242424";
  } else if (hadena.getColorMood(color, 4) === 'LIGHT') {
      console.log('LIGHT');
      document.getElementById(box[0] + "bg").style.color = "#363636";

  } else if (hadena.getColorMood(color, 4) === 'DIM') {
      console.log('DIM');
      document.getElementById(box[0] + "bg").style.color = "#B5B5B5";

  } else {
      console.log('DARK');
      document.getElementById(box[0] + "bg").style.color = "#F5F5F5";
      document.querySelector("#" + box[0] + "palette").style.color = "#F5F5F5";

  }
  var dataObject = JSON.parse(document.querySelector("#" + box[0] + "bg").getAttribute('data-attribute'));
  var oldColor = dataObject.color;
  var newDataObject = {image: dataObject.image, color: color};
  document.getElementById(boxId).style.backgroundColor = oldColor;
  document.getElementById(boxId).setAttribute('data-color', oldColor);
  document.querySelector("#" + box[0] + "bg").setAttribute('data-attribute', JSON.stringify(newDataObject));
  document.querySelector("#" + box[0]).innerHTML = currentDisplayVariable === 'hex' ? color : hadena.hexToRGB(color);
  document.querySelector("#" + box[0] + "bg").style.backgroundColor = color;
  document.querySelector("#" + box[0] + "palette").style.backgroundColor = color;
}

console.log(currentDisplayVariable);


module.exports = {
  search: search,
  currentDisplayVariable: currentDisplayVariable
}
