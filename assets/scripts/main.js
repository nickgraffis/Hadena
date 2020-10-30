(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
const prototype = require('./modules/prototype.js');
const typewriter = require('./modules/typewriter.js');
const darktheme = require('./modules/darktheme.js');

},{"./modules/darktheme.js":3,"./modules/prototype.js":5,"./modules/typewriter.js":7}],3:[function(require,module,exports){
var color = 'sun';

window.changeColorMode = function () {
  if (color === 'sun') {
    document.body.setAttribute('data-theme', 'dark');
    document.getElementById('color-icon').classList.value = 'fa fa-moon fa-stack-1x';
    color = 'moon';
  } else {
    document.body.removeAttribute('data-theme');
    document.getElementById('color-icon').classList.value = 'fa fa-sun fa-stack-1x';
    color = 'sun';
  }
}

},{}],4:[function(require,module,exports){
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
    image.onload = () => {
      let num = math.englishify(i);

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

},{"./prototype.js":5,"./worker.js":8,"hadenajs":10,"matematik":11,"webworkify":12}],5:[function(require,module,exports){
(function (process){
const __ = require('./router.js');
const time = require('./typewriter.js');
const _s_ = require('./imagesearch.js');
const math = require('matematik');
const url = 'https://www.googleapis.com/customsearch/v1?key=' + process.env.GOOGLE_IMAGE_API_KEY + '&cx=003721172336159961663:yl9lk4zjfw1&searchType=image&num=10&fields=items(link)';

const application = document.getElementById('application');

const router = new __.Router({
  mode: 'hash',
  root: '/'
});

/* Get a file from directory and return it as a string*/
function getFile(file) {
  var x = new XMLHttpRequest();
  x.open('GET', file, false);
  x.send();
  return x.responseText;
}

/*
* Fill in the footer where the <prototype-footer> tag is present
*/
function prototypeFooter () {
  document.querySelector('prototype-footer').innerHTML = getFile('components/footer.html');
}

/*
* Fill in the footer where the <prototype-nav> tag is present
*/
function prototypeNavbar () {
  let file = getFile('components/navbar.html');
  document.querySelector('prototype-navbar').innerHTML = eval('`' + file + '`');
}

/*
* Fill in the footer where the <prototype-results> tag is present
*/
function prototypeResults () {
  document.querySelector('prototype-results').innerHTML = getFile('components/searchresults.html');
}

/*
* Fill in the koi SVG where <prototype-koi> tag is present
* This is useful over using an <object> to display an SVG file because we can change the style with the actualy SVG text
*/
function prototypeKoi () {
  document.querySelector('prototype-koi').innerHTML = getFile('components/koi.html');
}

/*
* Fill in rows and columns of boxes until we get to 20 boxes
* Each box needs an identifier between zero and nineteen
* Each box needs a random choice between class of "short", "medium", or "long"
*/
function prototypeBoxes () {
  var sizes = ["short", "medium", "long"];
  var count = 0;
  var file = getFile('components/box.html');
  for (let j = 0; j < 20; j = j + 5)
  {
    for (let i = 0; i < 5; i++)
    {
      document.querySelector("#row" + math.englishify(count)).innerHTML += eval('`' + file + '`');
    }
    count++;
  }
}

function homeSearch (event) {
  var params = document.querySelector('#imagesHome').value;
  event.preventDefault();
  //Begin the search
  _s_.search(params);
  //Begin the loader
  loader(params);
}

function searchSearch (event) {
  var params = document.querySelector('#images').value;
  event.preventDefault();
  window.history.pushState({page: 1}, "title 1", '/#/s/' + params);
}

async function loader (params) {
  let homesearchform = document.getElementById('homesearchform');
  let hero = document.getElementById('hero-isfull');
  let homesearchbody = document.getElementById('homesearchbody');
  let demoWrapper = document.getElementsByClassName('demo-wrapper')[0];
  document.getElementById('homesearchform').style.animation = 'move-up 1s ease-in-out forwards';
  demoWrapper.style.height = '125%';
  demoWrapper.style.overflow = 'visible';
  document.getElementsByClassName('demo_one')[0].style.animation = 'float-faster 4s ease-in-out infinite, disapear 2s ease-in-out infinite';
  document.getElementsByClassName('demo_three')[0].style.animation = 'float-faster 5s ease-in-out infinite, disapear 2s ease-in-out infinite';
  document.getElementsByClassName('demo_two')[0].style.animation = 'float-faster 3s ease-in-out infinite, disapear 2s ease-in-out infinite';
  document.getElementsByClassName('demo_four')[0].style.animation = 'float-faster 2s ease-in-out infinite, disapear 1s ease-in-out infinite';
  await time.sleep(1000);
  demoWrapper.style.opacity = 0;
  var div = document.createElement('DIV');
  div.classList = 'container';
  var resultsDiv = document.getElementById('hero-body').appendChild(div);
  resultsDiv.innerHTML = getFile('components/searchresults.html');
  prototypeBoxes();
  homesearchbody.remove();
  await time.sleep(1000);
  demoWrapper.remove();
  hero.classList += ' is-paddingless';
  document.getElementById('resultTextArea').style.opacity = 1;
  document.getElementById('resultTextBoxes').style.opacity = 1;
  let boxes = document.getElementsByClassName('color_box');
  for (let i = 0; i < 20; i++) {
    boxes[i].style.opacity = 1;
  }
  document.querySelector('#navigation-brand').style.opacity = 1;
  document.querySelector('#navigation-search').style.opacity = 1;
  document.querySelector("#resultText").innerHTML = params;
  prototypeKoi();
  prototypeFooter();
}

router
  .add(/s\/(.*)/, (params) => {
    console.log(params);
    application.innerHTML = getFile('templates/search.html');
    document.querySelector("#resultText").innerHTML = params;
    prototypeBoxes();
    let boxes = document.getElementsByClassName('color_box');
    for (let i = 0; i < 20; i++) {
      boxes[i].style.opacity = 1;
    }
    _s_.search(params);
    if (document.getElementsByTagName('prototype-navbar').length > 0) {
      prototypeNavbar();
    }
    if (document.getElementsByTagName('prototype-koi').length > 0) {
      prototypeKoi();
    }
    if (document.getElementsByTagName('prototype-footer').length > 0) {
      prototypeFooter();
    }
    const searchform = document.querySelector('#searchform');
    searchform.addEventListener("submit", searchSearch);
  })
  .add(/products\/(.*)\/specification\/(.*)/, (id, specification) => {
    alert(`products: ${id} specification: ${specification}`);
  })
  .add('', () => {
    application.innerHTML = getFile('templates/hero.html');
    if (document.querySelector('#imagesHome')) {
      time.typeWriter(); //Start the function immediatly, without waiting the interval time
    }
    if (document.getElementsByTagName('prototype-koi').length > 0) {
      prototypeKoi();
    }
    if (document.getElementsByTagName('prototype-navbar').length > 0) {
      prototypeNavbar();
      document.getElementById('navigation-brand').style.opacity = 0;
      document.getElementById('navigation-search').style.opacity = 0;
    }
    const searchform = document.querySelector('#searchform');
    searchform.addEventListener("submit", searchSearch);
    const homeform = document.querySelector('#homeform');
    homeform.addEventListener("submit", homeSearch);
  });

module.exports = {
  getFile: getFile
}

}).call(this,require('_process'))
},{"./imagesearch.js":4,"./router.js":6,"./typewriter.js":7,"_process":1,"matematik":11}],6:[function(require,module,exports){
class Router {
  routes = [];

  mode = null;

  root = '/';

  constructor(options) {
    this.mode = window.history.pushState ? 'history' : 'hash';
    if (options.mode) this.mode = options.mode;
    if (options.root) this.root = options.root;
    this.listen();
  }

  add = (path, cb) => {
    this.routes.push({ path, cb });
    return this;
  };

  remove = path => {
    for (let i = 0; i < this.routes.length; i += 1) {
      if (this.routes[i].path === path) {
        this.routes.slice(i, 1);
        return this;
      }
    }
    return this;
  };

  flush = () => {
    this.routes = [];
    return this;
  };

  clearSlashes = path =>
    path
      .toString()
      .replace(/\/$/, '')
      .replace(/^\//, '');

  getFragment = () => {
    let fragment = '';
    if (this.mode === 'history') {
      fragment = this.clearSlashes(decodeURI(window.location.pathname + window.location.search));
      fragment = fragment.replace(/\?(.*)$/, '');
      fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;
    } else {
      const match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : '';
    }
    return this.clearSlashes(fragment);
  };

  navigate = (path = '') => {
    if (this.mode === 'history') {
      window.history.pushState(null, null, this.root + this.clearSlashes(path));
    } else {
      window.location.href = `${window.location.href.replace(/#(.*)$/, '')}#${path}`;
    }
    return this;
  };

  listen = () => {
    clearInterval(this.interval);
    this.interval = setInterval(this.interval, 50);
  };

  interval = () => {
    if (this.current === this.getFragment()) return;
    this.current = this.getFragment();

    this.routes.some(route => {
      const match = this.current.match(route.path);
      if (match) {
        match.shift();
        route.cb.apply({}, match);
        return match;
      }
      return false;
    });
  };
}

module.exports = {
  Router: Router
}

},{}],7:[function(require,module,exports){
const math = require('matematik');

/*
* Variables for typeWrite function
* words array of example words and colors for action
* speed to identify in miliseconds how long after each char to wait
* IintervalTypeWrite to tell the window how often in miliseconds to run typeWriter
*/
var i = 0; //Keep "i" counter variable outside of typeWrite function to preserve it
var words = [["flamingo", ["#F45F87", "#B73E59", "#F55AA9", "#D23F3F", "#E1B7B0", "#A085D8", "#E29351", "#FF0000"]],
["spring time", ["#E7BF13", "#D04127", "#F0C516", "#DCC993", "#9E5E68", "#D9A7BB", "#769E29", "#2D9AE9"]],
["koi fish", ["#F5DD1A", "#F09B24", "#F43818", "#0794C2", "#D2911B", "#A085D8", "#E70D13", "#0868C1"]],
["bumble bee",["#CD2A58", "#7BC80B", "#E1BA0B", "#E886B1", "#88990F", "#F2B3D2", "#EECD1D", "#F2B3D2"]],
["atlantic ocean", ["#50C0D4", "#78A3C7", "#ADDCF4", "#0BACD4", "#ACDCFC", "#4485CD", "#C4E4FC", "#44495B"]],
["lavender", ["#BEA1E5", "#A188D9", "#D6BD1F", "#C8ADFC", "#F99C81", "#90B90F", "#C1DBEE", "#C1DBEE"]],
["maine", ["#FCF3E9", "#FABB84", "#CDB033", "#F06243", "#9A7E52", "#B2C1C8", "#EC4143", "#DE6F06"]],
["pride", ["#FF0000", "#FF4D00", "#FF9900", "#FFE500", "#CCFF00", "#80FF00", "#33FF00", "#00FFFF"]],
["humback whale", ["#4B7CBC", "#3A7C9F", "#4063BA", "#047CC1", "#78A3C7", "#0474BC", "#044E54", "#BFF0FB"]]];
var speed = 200;
var txt = words[math.getRandomInt(words.length - 1)];
var intervalTypeWrite = window.setInterval(typeWriter, 8000);

/*
* sleep creates a new Promise that will wait x miliseconds to start again
*/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*
* Asyncronious funciton can run over and over again
* typeWriter types as long as the counter is not the same as the length of the word it's typing
* When the counter gets to the end of the word we "sleep", change the color of the koi, "sleep" again, then find a new word, reset the counter and reset the placeholder variable
*/
async function typeWriter(question) {
  if (document.querySelector('#imagesHome') && !document.querySelector('#results')) {
    if (i < txt[0].length)
    {
        document.querySelector("#imagesHome").placeholder += txt[0][i];
        i++;
        setTimeout(typeWriter, speed);
    }
    if (i === txt[0].length)
    {
      for (let k = 0; k < 7; k++) {
        document.getElementsByClassName('color_box')[k].style.backgroundColor = txt[1][k];
      }
      document.querySelector("#koi").style.fill = txt[1][0];
      await sleep(3000);
      i = 0;
      txt = words[math.getRandomInt(words.length - 1)];
      document.querySelector("#imagesHome").placeholder = ""; //Use placeholder not value so user can still begin typing
      return;
    }
  }
}

module.exports = {
  typeWriter: typeWriter,
  sleep: sleep
}

},{"matematik":11}],8:[function(require,module,exports){
const hadena = require('hadenajs');

self.addEventListener('message', ({data}) => {
  console.log(data.pixels);
  let palette = hadena.pixelsToColors(data.pixels, 6);
  console.log(palette);
  self.postMessage({palette: palette, id: data.id});
})

},{"hadenajs":10}],9:[function(require,module,exports){
const math = require('matematik');

// Method for comparing arrays (because JavaScript doesn't provide this for some reason)
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};


// Hide method from for-in loops
Object.defineProperty(Array.prototype, 'equals', {enumerable: false});

/**
* Generates a random integer in the closed interval specified by a and b
* @param {Number} a - lower bound
* @param {Number} b - upper bound
* @return {Number} randomInt - random integer generated
*/
function randomIntBetween(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

/**
* Initialises the centroids for the k-means algorithm
* @param {Array} data - data set
* @param {Number} k - number of clusters/centroids
* @return {Array} centroids - array of centroid vectors
*/
function initialiseCentroidsRandomly(data, k) {
    var ranges = math.rangesOf(data);
    var centroids = [];
    for (let i = 0; i < k; i++) {
        var centroid = [];
        for (var r in ranges) {
            centroid.push(randomIntBetween(ranges[r].min, ranges[r].max));
        }
        centroids.push(centroid);
    }
    return centroids;
}

/**
* Attributes data points to the nearest centroid's cluster
* @param {Array} data - data set
* @param {Array} centroids - array of centroid vectors
* @return {Array} clusters - array of clusters
*/
function clusterDataPoints(data, centroids) {
    var clusters = [];
    centroids.forEach(function () {
        clusters.push([]);
    });
    data.forEach(function (point) {
        var nearestCentroid = centroids[0];
        centroids.forEach(function (centroid) {
            if (math.euclideanDistance(point, centroid) < math.euclideanDistance(point, nearestCentroid)) {
                nearestCentroid = centroid;
            }
        });
        clusters[centroids.indexOf(nearestCentroid)].push(point);
    });
    return clusters;
}

/**
* Calculates the new vectors of the centroids based on their respective clusters
* @param {Array} clusters - array of clusters
* @return {Array} centroids - new centroid vectors
*/
function getNewCentroids(clusters) {
    var centroids = [];
    clusters.forEach(function (cluster) {
        centroids.push(math.meanPoint(cluster));
    });
    return centroids;
}

/**
* Performs k-means clustering on a data set
* @param {Array} data - data set
* @param {Array} k - number of clusters for data points to be partitioned into
* @return {Array} clusters - array of clusters (each containing an array of vectors representing a data point)
*/
function kMeans(data, k) {
    var centroids;
    var clusters;
    var oldClusters;
    var converged = false;
    const iterationLimit = 500;
    var iterations = 0;

    // STEP ONE: Initialise centroids
    centroids = initialiseCentroidsRandomly(data, k);

    while (!converged) {
        // console.log('iterated.');
        iterations += 1;
        // STEP TWO: Cluster data points according to nearest centroid (assignment step)
        oldClusters = clusters;
        clusters = clusterDataPoints(data, centroids);

        // Check for empty clusters. If so, just retry!
        if (clusters.some(x => x.length == 0)) {
            // console.log('Empty clusters found. Restarting k-means.');
            return kMeans(data, k);
        }

        // console.log(iterations, iterationLimit);
        if (clusters.equals(oldClusters) || iterations >= iterationLimit) {
            converged = true;
        }

        // STEP THREE: Set centroids to mean point of points belonging to their respective clusters (update step)
        centroids = getNewCentroids(clusters);
    }
    // console.log(clusters);
    return clusters;
}

module.exports = {
    kMeans: kMeans
};

},{"matematik":11}],10:[function(require,module,exports){
const km = require('@nickgraffis/kmeans');
const math = require('matematik');

module.exports = {
    getRandomColor: getRandomColor,
    getColorMood: getColorMood,
    extractPixelData: extractPixelData,
    extractColorPalette: extractColorPalette,
    fullColorHex: fullColorHex,
    increaseValueOfRGB: increaseValueOfRGB,
    increaseValueOfRGB: increaseValueOfRGB,
    pixelsToColors: pixelsToColors,
    hexToRGB: hexToRGB
};

function increaseValueOfRGB(colour, percent) {
    console.log(colour);
    var hsv = rgbToHSV(colour);
    console.log(hsv);
    hsv[2] = lerp(hsv[2], 1, percent);
    console.log(hsv);
    return hsvToRGB(hsv);
}

function increaseValueOfRGB(colour, percent) {
    console.log(colour);
    var hsv = rgbToHSV(colour);
    console.log(hsv);
    hsv[1] = lerp(hsv[1], 1, percent);
    console.log(hsv);
    return hsvToRGB(hsv);
}

/*
* Convert one RGB value (Red OR Green OR Blue) to HEX
*/
var rgbToHex = function (rgb) {
  var hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
};

/*
* Convert three RGB values (Red, Green, Blue) to HEX
*/
function fullColorHex (r, g, b) {
  var red = rgbToHex(r);
  var green = rgbToHex(g);
  var blue = rgbToHex(b);
  return red + green +blue;
};

/*
* Convert HEX to RGB
* Not currently in use...
*/
function hexToRGB (hex) {
  let r = 0, g = 0, b = 0;

  // 3 digits
  if (hex.length == 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];

  // 6 digits
  } else if (hex.length == 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }

  return "rgb("+ +r + "," + +g + "," + +b + ")";
}

/*
* Returns a random color, default is HEX, but can add optional type = 'RGB'
* Optionally can add an array of colors to pick from
*/
function getRandomColor(options = [], type = 'HEX') {
  if (options.length > 0) {
    return options[Math.floor(Math.random() * options.length)];
  }
  else {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    if (type == 'HEX') {
      return color;
    }
    else {
      return hexToRGB(color);
    }
  }
}

/*
* Determine if a color is light or dark
* Accepts color as HEX or RGB
* Accepts a specificiity, default of 2, which returns 2 options, LIGHT or DARK
* You can add specificity of 4 as well
*/
function getColorMood(color, specificity = 2) {
  // Variables for red, green, blue values
  var r, g, b, hsp;

  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {

      // If RGB, store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

      r = color[1];
      g = color[2];
      b = color[3];
  } else {

      // If HEX, convert it to RGB:
      color = +("0x" + color.slice(1).replace(
      color.length < 5 && /./g, '$&$&'));

      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
  }

  // HSP (Highly Sensitive Poo) alternative to HSV from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt( 0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  if (specificity == 2) {
    if (hsp > 127.5) {

      return 'BRIGHT';
    }
    else {

        return 'DARK';
    }
  }

  if (specificity == 4) {
    if (hsp > 191) {
      return 'BRIGHT';
    }
    else if (hsp < 191 && hsp > 127.5) {
      return 'LIGHT';
    }
    else if (hsp < 127.5 && hsp > 63.5) {
      return 'DIM';
    }
    else {
      return 'DARK';
    }
  }
}

function rgbToHSV(colour){
    r = colour[0]/255, g = colour[1]/255, b = colour[2]/255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0;
    } else {
        switch(max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h,s,v];
}

function hsvToRGB(colour){
    var r, g, b;
    var h = colour[0];
    var s = colour[1];
    var v = colour[2];

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
    }

    return [r * 255, g * 255, b * 255];
}


function extractPixelData(canvas) {
    // Separate out RGBA groups
    const ctx = canvas.getContext('2d');
    const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let colours = [];
    for (let i = 0; i < data.length; i += 4) {
        colours.push([data[i], data[i+1], data[i+2], data[i+3]]);
    }
    return colours;
}

function extractColorPalette(canvas, k) {
    // Extract raw colours from image
    const allColours = extractPixelData(canvas);

    // Cluster raw colours
    const clusters = km.kMeans(allColours, k);

    // Calculate palette (mean colour of each cluster)
    var totals = clusters.map(x => x.length);
    var total = totals.reduce(function(a, b){
        return a + b;
    }, 0);
    const colours = clusters.map(x => ({mean: math.meanPoint(x), percentage: (x.length / total) * 100}));
    const palette = colours.map(x => ({r: Math.round(x.mean[0]), g: Math.round(x.mean[1]), b: Math.round(x.mean[2]), a: Math.round(x.mean[3]), p: Math.round(x.percentage)}));
    // console.log(palette);
    return palette;
}

function pixelsToColors(pixels, k) {
  // Extract raw colours from image
  const allColours = pixels;

  // Cluster raw colours
  const clusters = km.kMeans(allColours, k);

  // Calculate palette (mean colour of each cluster)
  var totals = clusters.map(x => x.length);
  var total = totals.reduce(function(a, b){
      return a + b;
  }, 0);
  const colours = clusters.map(x => ({mean: math.meanPoint(x), percentage: (x.length / total) * 100}));
  const palette = colours.map(x => ({r: Math.round(x.mean[0]), g: Math.round(x.mean[1]), b: Math.round(x.mean[2]), a: Math.round(x.mean[3]), p: Math.round(x.percentage)}));
  // console.log(palette);
  return palette;
}

},{"@nickgraffis/kmeans":9,"matematik":11}],11:[function(require,module,exports){
module.exports = {
    euclideanDistance : euclideanDistance,
    mean: mean,
    meanPoint: meanPoint,
    rangeOf: rangeOf,
    rangesOf: rangesOf,
    englishify: englishify,
    getRandomInt: getRandomInt,
    dot: dot,
    zeros: zeros,
};

/**
* Create a matrix filled with zeros of a certain height and width
* @param {Number} columns - integer - 2
* @param {Number} rows - integer - 2
* @return {Array{Array}} array - [[0, 0], [0, 0]]
*/
function zeros (columns, rows) {
  var matrix = [];
  var rowMatrix = [];
  for (let i = 0; i < columns; i++) {
      rowMatrix = [];
    for (let k = 0; k < rows; k++) {
      rowMatrix.push(0);
    }
    matrix.push(rowMatrix);
  }
  return matrix;
}

/**
* Compute the dot product of two vecors
* @param {Array} vector1
* @param {Array} vector2
* @return {Number} integer
* TODO Allow for 2-D arrays with a matrix returned
*/
function dot(vector1, vector2) {
  let result = 0;
  if (typeof vector1 === 'object') {
    if (typeof vector2 === 'object' && vector2.length === vector1.length) {
      for (var i = 0; i < vector1.length; i++) {
        result += vector1[i] * vector2[i];
      }
    } else {
      throw 'Error finding dot product of vectors of different dimensions!';
    }
  } else if (typeof vector2 === 'object') {
    throw 'Error finding dot product of vectors of different dimensions!';
  } else {
    result = vector1 * vector2;
  }
  return result;
}

/**
* Find a random integer between min and max value
* @param {Number} max - integer
* @param {Number} min - integer
* @return {Number} integer - will be between 0 and max
*/
function getRandomInt(max, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
* Accept an integer and parse it out into an english string of the same meaning
* @param {Number} num - integer - 293
* @return {'Number'} string - two hundred and ninety three
* TODO Expand beyond 9999
* TODO Allow for negative numbers
* TODO Allow for floating points
*/
function englishify(num){
  var ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
              'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
              'seventeen', 'eighteen', 'nineteen'];
  var tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty',
              'ninety'];

  var numString = num.toString();

  if (num < 0) {
    throw 'Negative numbers are not supported.';
  }

  if (num === 0) {
    return 'zero';
  }

  //One to Twenty
  if (num < 20) {
    return ones[num];
  }
  //Twenty One to Ninety Nine
  if (numString.length === 2) {
    return tens[numString[0]] + ' ' + ones[numString[1]];
  }

  //100 Plus
  if (numString.length == 3) {
    if (numString[1] === '0' && numString[2] === '0')
      return ones[numString[0]] + ' hundred';
    else
      return ones[numString[0]] + ' hundred and ' + englishify(+(numString[1] + numString[2]));
  }

  if (numString.length === 4) {
    var end = +(numString[1] + numString[2] + numString[3]);
    if (end === 0) return ones[numString[0]] + ' thousand';
    if (end < 100) return ones[numString[0]] + ' thousand and ' + englishify(end);
    return ones[numString[0]] + ' thousand ' + englishify(end);
  }
}

/**
* Find a euclidean distance between two points
* @param {Array} a - first point on graph of dimensions N
* @param {Array} b - second point on graph of dimensions N
* @return {Number} integer
*/
function euclideanDistance(a, b) {
    if (a.length != b.length) {
        throw 'Error calculating Euclidean distance. Input vectors must have same number of dimensions!';
    }
    var sum = 0;
    for (let i = 0; i < a.length; i++) {
        sum += Math.pow(b[i] - a[i], 2);
    }
    return Math.sqrt(sum);
}

/**
* Calculates the mean value of a one-dimensional dataset
* @param {Array} data - data set
* @return {Number} mean value of data set
*/
function mean(data) {
    return data.reduce((total,current) => total += current, 0) / data.length;
}

/**
* Calculates the mean point of an n-dimensional dataset
* @param {Array} data - data set
* @return {Array} mean point of data set
*/
function meanPoint(data) {
    var theMeanPoint = [];
    if (data.length != 0) {
        for (let i = 0; i < data[0].length; i++) {
            theMeanPoint.push(mean(data.map(x => x[i])));
        }
    }
    return theMeanPoint;
}

/**
* Calculates the range of a one-dimensional data set
* @param {Array} data - data set
* @return {Number} range - range of the data set
*/
function rangeOf(data) {
    return data.reduce(function(total,current) {
        if (current < total.min) { total.min = current; }
        if (current > total.max) { total.max = current; }
        return total;
    }, {min: data[0], max: data[0]});
}

/**
* Calculates the ranges of each 'component' in an n-dimensional data set
* @param {Array} data - data set
* @return {Number} range - range of the data set
*/
function rangesOf(data) {
    var ranges = [];
    for (let i = 0; i < data[0].length; i++) {
        ranges.push(rangeOf(data.map(x => x[i])));
    }
    return ranges;
}

},{}],12:[function(require,module,exports){
var bundleFn = arguments[3];
var sources = arguments[4];
var cache = arguments[5];

var stringify = JSON.stringify;

module.exports = function (fn, options) {
    var wkey;
    var cacheKeys = Object.keys(cache);

    for (var i = 0, l = cacheKeys.length; i < l; i++) {
        var key = cacheKeys[i];
        var exp = cache[key].exports;
        // Using babel as a transpiler to use esmodule, the export will always
        // be an object with the default export as a property of it. To ensure
        // the existing api and babel esmodule exports are both supported we
        // check for both
        if (exp === fn || exp && exp.default === fn) {
            wkey = key;
            break;
        }
    }

    if (!wkey) {
        wkey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
        var wcache = {};
        for (var i = 0, l = cacheKeys.length; i < l; i++) {
            var key = cacheKeys[i];
            wcache[key] = key;
        }
        sources[wkey] = [
            'function(require,module,exports){' + fn + '(self); }',
            wcache
        ];
    }
    var skey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);

    var scache = {}; scache[wkey] = wkey;
    sources[skey] = [
        'function(require,module,exports){' +
            // try to call default if defined to also support babel esmodule exports
            'var f = require(' + stringify(wkey) + ');' +
            '(f.default ? f.default : f)(self);' +
        '}',
        scache
    ];

    var workerSources = {};
    resolveSources(skey);

    function resolveSources(key) {
        workerSources[key] = true;

        for (var depPath in sources[key][1]) {
            var depKey = sources[key][1][depPath];
            if (!workerSources[depKey]) {
                resolveSources(depKey);
            }
        }
    }

    var src = '(' + bundleFn + ')({'
        + Object.keys(workerSources).map(function (key) {
            return stringify(key) + ':['
                + sources[key][0]
                + ',' + stringify(sources[key][1]) + ']'
            ;
        }).join(',')
        + '},{},[' + stringify(skey) + '])'
    ;

    var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

    var blob = new Blob([src], { type: 'text/javascript' });
    if (options && options.bare) { return blob; }
    var workerUrl = URL.createObjectURL(blob);
    var worker = new Worker(workerUrl);
    worker.objectURL = workerUrl;
    return worker;
};

},{}]},{},[2]);
