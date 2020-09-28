(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const prototype = require('./modules/prototype.js');
const typewriter = require('./modules/typewriter.js');
const darktheme = require('./modules/darktheme.js');

},{"./modules/darktheme.js":2,"./modules/prototype.js":3,"./modules/typewriter.js":5}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
const __ = require('./router.js');
const time = require('./typewriter.js');

const application = document.getElementById('application');

async function homeSearch (event) {
  var parmas = document.querySelector('#imagesHome').value;
  event.preventDefault();
  document.getElementById('logo-wrapper').style.animation = 'move-logo 4s ease-in-out';
  document.getElementById('level-logo').style.animation = 'scale-logo 4s ease-in-out';
  document.getElementById('home-form-control').style.animation = 'move-search 4s ease-in-out';
  document.getElementById('home-form-wrapper').style.animation = 'scale-search 4s ease-in-out';
  await time.sleep(4000);
  // window.history.pushState({page: 1}, "title 1", '/#/s/' + parmas);
}

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
  document.querySelector('prototype-nav').innerHTML = getFile('components/navbar.html');
}

/*
* Fill in the koi SVG where <prototype-koi> tag is present
* This is useful over using an <object> to display an SVG file because we can change the style with the actualy SVG text
*/
function prototypeKoi () {
  document.querySelector('prototype-koi').innerHTML = getFile('components/koi.html');
}

if (document.getElementsByTagName('prototype-footer').length > 0) {
  prototypeFooter();
}

if (document.getElementsByTagName('prototype-nav').length > 0) {
  prototypeNavbar();
}

router
  .add(/s\/(.*)/, (params) => {
    console.log(params);
    application.innerHTML = getFile('templates/search.html');
    if (document.getElementsByTagName('prototype-koi').length > 0) {
      prototypeKoi();
    }
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
    const homeform = document.querySelector('#homeform');
    homeform.addEventListener("submit", homeSearch);
  });

},{"./router.js":4,"./typewriter.js":5}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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
async function typeWriter() {
  if (document.querySelector('#imagesHome')) {
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

},{"matematik":6}],6:[function(require,module,exports){
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

},{}]},{},[1]);
