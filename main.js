(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
Array.prototype.equals = function (array) {
    if (!array)
        return false;

    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            return false;
        }
    }
    return true;
};
},{}],2:[function(require,module,exports){
require('@nickgraffis/array.equals');
const math = require('matematik');

module.exports = {
    kMeans: kMeans,
};

function centroidInit(data, k) {
  console.log(data);
    var ranges = math.rangesOf(data);
    var centroids = [];
    for (let i = 0; i < k; i++) {
        var centroid = [];
        for (var r in ranges) {
            centroid.push(math.randomIntBetween(ranges[r].min, ranges[r].max));
        }
        centroids.push(centroid);
    }
    return centroids;
}

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

function newCentroids(clusters) {
    var centroids = [];
    clusters.forEach(function (cluster) {
        centroids.push(math.meanDataPoint(cluster));
    });
    return centroids;
}

function kMeans(data, k) {
    var centroids;
    var clusters;
    var oldClusters;
    var converged = false;
    const iterationLimit = 500;
    var iterations = 0;

    // STEP ONE: Initialise centroids
    centroids = centroidInit(data, k);

    while (!converged) {
        console.log('iterated.');
        iterations += 1;
        // STEP TWO: Cluster data points according to nearest centroid (assignment step)
        oldClusters = clusters;
        clusters = clusterDataPoints(data, centroids);

        // Check for empty clusters. If so, just retry!
        if (clusters.some(x => x.length == 0)) {
            console.log('Empty clusters found. Restarting k-means.');
            return kMeans(data, k);
        }

        console.log(iterations, iterationLimit);
        if (clusters.equals(oldClusters) || iterations >= iterationLimit) {
            converged = true;
        }

        // STEP THREE: Set centroids to mean point of points belonging to their respective clusters (update step)
        centroids = newCentroids(clusters);
    }
    return clusters;
}

},{"@nickgraffis/array.equals":1,"matematik":4}],3:[function(require,module,exports){
const km = require('@nickgraffis/kmeans');
const math = require('matematik');

module.exports = {
    getRandomColor: getRandomColor,
    getColorMood: getColorMood,
    getPixels: getPixels,
    extractColourPalette: extractColourPalette,
    fullColorHex: fullColorHex,
};
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
var hexToRBG = function (hex) {
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
* Returns a random HEX color
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
      return hexToRBG(color);
    }
  }
}

/*
* Determine if a color is light or dark
* Accepts color as HEX or RGB
* Accepts a specificiity, default of 2, which returns 2 options, LIGHT or DARK
* TODO: Allow up to five values returning (BRIGHT, LIGHT, MEDIUM, DIM, DARK)
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

function getPixels(url) {
  var image = new Image();
  let googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
  image.crossOrigin = 'Anonymous';
  image.src = googleProxyURL + encodeURIComponent(url);
  var canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
  var colors = []
  for (let h = 0; h < image.height; h++)
  {
    for (let w = 0; w < image.width; w++)
    {
      var rgba = canvas.getContext('2d').getImageData(h, w, 1, 1).data;
      colors.push(rgba);
    }
  }
  console.log(colors);
  return colors;
}

function extractColourPalette(url, k) {
    // Extract raw colours from image
    const allColours = getPixels(url);

    // Cluster raw colours
    const clusters = km.kMeans(allColours, k);

    // Calculate palette (mean colour of each cluster)
    const colours = clusters.map(x => math.meanDataPoint(x));
    const palette = colours.map(x => ({r: x[0], g: x[1], b: x[2], a: x[3]}));

    return palette;
}

},{"@nickgraffis/kmeans":2,"matematik":4}],4:[function(require,module,exports){
module.exports = {
    euclideanDistance : euclideanDistance,
    rangeOf : rangeOf,
    rangesOf: rangesOf,
    meanDataPoint: meanDataPoint,
    mean: mean,
    randomIntBetween: randomIntBetween,
};


function euclideanDistance(a, b) {
    if (a.length != b.length) {
        //throw 'Error calculating Euclidean distance. Input vectors must have same number of dimensions!';
        return Math.infinity;
    }
    var sum = 0;
    for (let i = 0; i < a.length; i++) {
        sum += Math.pow(b[i] - a[i], 2);
    }
    return Math.sqrt(sum);
}

function rangeOf(data) {
	return data.reduce(function(total, current) {
		if (current < total.min) { total.min = current; }
		if (current > total.max) { total.max = current; }
		return total;
	}, {min: data[0], max: data[0]});
}

function rangesOf(data) {
	var ranges = [];
	for (let i = 0; i < data[0].length; i++) {
		ranges.push(rangeOf(data.map(x => x[i])));
	}
	return ranges;
}

function meanDataPoint(data) {
	var point = [];
	if (data.length != 0) {
		for (let i = 0; i < data[0].length; i++) {
			point.push(mean(data.map(x => x[i])));
		}
	}
	return point;
}

function mean(data) {
	return data.reduce((total, current) => total += current, 0) / data.length;
}

function randomIntBetween(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}
},{}],5:[function(require,module,exports){
const hadena = require('hadenajs');

/*
* Show the image of the box with the ID of imageid by changing the background image of the box
*/
function showImage(imageid)
{
  let num = humanize(imageid);
  document.querySelector("#" + num + "bg").style.backgroundImage = "url(" + items[imageid].link + ")";
  imageVisable = 1;
}

/*
* Hide the image of the box with the ID of imageid by setting background image back to null
*/
function hideImage(imageid)
{
  if (imageVisable === 1)
  {
    let num = humanize(imageid);
    document.querySelector("#" + num + "bg").style.backgroundImage = null;
  }
}

/*
* Copy the text of the box with an ID of hexid
* Flash an alert for this box as well
*/
function copyHex(hexid) {
  let num = humanize(hexid);
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

// /*
// * GET first ten responses from query
// * Call more() to get the next 10 starting at #11
// * TODO: When the user scrolls to the bottom of the page, create 10 more boxes and then request 10 more colors starting at #21
// */
//
// var url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyDpgEBBXGOOxTMMCVMp6NHzAJxQJcMobaA&cx=003721172336159961663:yl9lk4zjfw1&searchType=image&num=10&fields=items(link)";
// var items = {};
// var params = new URLSearchParams(window.location.search);
// function search (query) {
//   document.querySelector("#resultText").innerHTML = query;
//   items = {};
//   var request = url + "&q=" + query;
//   var xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//       items = JSON.parse(xhttp.responseText).items;
//       more(query, 11);
//     }
//   };
// xhttp.open("GET", request, true);
// xhttp.send();
// }
//
// /*
// * Get 10 more requests starting from startNumber and push() them to items object
// */
// function more (query, startNumber) {
//   var request = url + "&start=" + startNumber + "&q=" + query;
//   var xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function () {
//     if (this.readyState == 4 && this.status == 200) {
//       for (let i = 0; i < 10; i++) {
//         item = JSON.parse(xhttp.responseText).items[i];
//         items.push(item);
//       }
//       show(items, 0);
//     }
//   };
// xhttp.open("GET", request, true);
// xhttp.send();
// }
//
// /*
// * For each box, there are 20...
// * Create a new ColorThief() object
// * Create a new Image() object
// * Add Google Proxy URL and image URL to Image() object, and set Cross Origin permission to Anonymous
// * Turn the resulting ColorThief() color to a HEX and change the background color of the box to that color
// * Add the HEX number to the box as text
// * Determine if the color is lightOrDark and change the text color of the box to be the opposite
// * Change the color of the koi logo to the first color
// * Log errors
// */
// function show (items, startNumber) {
//   for (let i = 0; i < 20; i++) {
//     console.log(items[i]);
//     try {
//       let num = humanize(i);
//       let color = hadena.extractColourPalette(items[i].link, 1);
//       console.log(color);
//       let hex = hadena.fullColorHex(color[0].r, color[0].g, color[0].b);
//       document.querySelector("#" + num + "bg").style.backgroundColor = "#" + hex;
//       document.querySelector("#" + num).innerHTML = "#" + hex;
//       if (hadena.getColorMood(hex) === 'BRIGHT') {
//         document.querySelector("#" + num + "bg").style.color = "#4a4a4a";
//         document.querySelector("#" + num + "alert").style.color = "#4a4a4a";
//       } else {
//         document.querySelector("#" + num + "bg").style.color = "#b5b5b5";
//         document.querySelector("#" + num + "alert").style.color = "#b5b5b5";
//       }
//       if (i === 0) {
//         document.querySelector("#koi").style.fill = "#" + hex;
//       }
//     }
//     catch (error) {
//       console.log(error.message);
//     }
//   }
// }

/*
* Find random integer less than the max
*/
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
/*
* Accept a integer as a number...
* Parse it into a string of english version of number...
*/
function humanize(num){
  var ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
              'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
              'seventeen', 'eighteen', 'nineteen'];
  var tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty',
              'ninety'];

  var numString = num.toString();

  if (num < 0) throw new Error('Negative numbers are not supported.');

  if (num === 0) return 'zero';

  //the case of 1 - 20
  if (num < 20) {
    return ones[num];
  }

  if (numString.length === 2) {
    return tens[numString[0]] + ' ' + ones[numString[1]];
  }

  //100 and more
  if (numString.length == 3) {
    if (numString[1] === '0' && numString[2] === '0')
      return ones[numString[0]] + ' hundred';
    else
      return ones[numString[0]] + ' hundred and ' + convert(+(numString[1] + numString[2]));
  }

  if (numString.length === 4) {
    var end = +(numString[1] + numString[2] + numString[3]);
    if (end === 0) return ones[numString[0]] + ' thousand';
    if (end < 100) return ones[numString[0]] + ' thousand and ' + convert(end);
    return ones[numString[0]] + ' thousand ' + convert(end);
  }
}

/*
* Fill in rows and columns of boxes until we get to 20 boxes
* Each box needs an identifier between zero and nineteen
* Each box needs a random choice between class of "short", "medium", or "long"
*/
function prototypeBoxes () {
  var sizes = ["short", "medium", "long"];
  var count = 0;
  for (let j = 0; j < 20; j = j + 5)
  {
    for (let i = 0; i < 5; i++)
    {
      document.querySelector("#row" + humanize(count)).innerHTML += '<div class="box color_box ' + sizes[getRandomInt(3)] + '" id="' + humanize(i + j) + 'bg"><article class="media" id="' + humanize(i + j) + 'media"><div class="media-content"><div class="content"><nav class="level"><div class="level-left"><a class="level-item hex" onclick="copyHex(' + (i + j) + ');" id="' + humanize(i + j) + '"></a></div><div class="level-right"><div class="level-item"><i class="far fa-image" onmouseover="showImage(' + (i + j) +');" onmouseleave="hideImage(' + (i + j) + ')"></i></div></div></nav></div></div></article><div class="has-text-centered has-text-weight-bold subtitle hex_alert" id="' + humanize(i + j) + 'alert">HEX copied!</div></div>';
    }
    count++;
  }
}

/*
* Fill in the footer where the <prototype-footer> tag is present
*/
function prototypeFooter () {

  document.querySelector('prototype-footer').innerHTML = '<div class="hero-foot"><div class="content has-text-centered"><p><strong>派手な HADENA</strong> by <a href="https://twitter.com/nickgraffistwit">Nick Graffis</a>. Learn about the project<a href="/code"> here</a>.</p></div></div>';

}

/*
* links are an array of routes and then titles
* siteTitle can be set for the navigation bar
* prototypeNavLinks creates the navigation links within a header
*/
var links = [["reason", "Reason"],
["code", "Code"]];
var siteTitle = '派手な HADENA';

function prototypeNavLinks (links) {
  for (let i = 0; i < links.length; i++) {
    document.querySelector('#nav-links').innerHTML += '<div class="level-item has-text centered"><a href="/' + links[i][0] + '" class="navbar-item has-text-grey-dark has-text-weight-bold nav-links">' + links[i][1] + '</a></div>';
    if (i + 1 != links.length) {
      document.querySelector('#nav-links').innerHTML += '<div class="level-item has-text centered"><p class="has-text-grey-dark has-text-weight-bold"> | </p></div>';
    }
  }
}

/*
* Fill in the koi SVG where <prototype-koi> tag is present
* This is useful over using an <object> to display an SVG file because we can change the style with the actualy SVG text
*/
function prototypeKoi () {
  document.querySelector('prototype-koi').innerHTML = '<figure class="image is-96x96 koi"> <svg id="koi" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 433 286" style="fill: #0E95ED;" xml:space="preserve"> <style type="text/css"> .st0{fill:#FFFFFF;} </style> <g> <g> <path class="st0" d="M0,207C0,138,0,69,0,0c144.3,0,288.7,0,433,0c0,56.4,0,112.7,0,169c-0.7-0.8-1.8-1.5-1.9-2.4 c-0.7-4.3-1.1-8.7-1.6-13.1c-0.3-2.4-1.3-5.1-0.6-7.3c3.2-10.6,1.6-20.8-2-30.7c-3.8-10.4-8.7-20.4-12.6-30.8 c-7-18.9-7.7-37.8,0.4-56.6c1.6-3.7,2.9-7.5,4.8-12.5c-14.7,13.3-28.3,25.6-35.6,43c-3.1,7.4-6.2,14.9-4.7,23.4 c0.7,3.7-2,4-4.9,2.8c-8.2-3.2-15.1-8.4-20.6-15.3c-3.5-4.4-6.7-9-10.2-13.9c-0.4,1.6-0.8,2.8-1,4.1c-0.2,1.5-0.2,3-0.4,4.4 c-2.4,18.5,0.6,35.7,14,49.4c8.3,8.5,18,15.7,26.8,23.8c4.7,4.4,9.7,9,10.4,15.9c1.4,13.7-6.1,21.4-19.7,21.3 c-11.4-0.1-21.8-4.4-30.5-10.8c-10-7.4-18.1-17.2-23.3-28.7c-7.9-17.4-19.8-31.3-34.9-42.8c-16.8-12.8-35.3-21-56.7-21.7 c-15.1-0.5-30-1.8-44.5-6.7c-9-3.1-18.5-5-28.2-1.4c-11.1,4-15.4,13.7-19.5,23.4c-1.9,4.4-4.8,5.8-9.3,6.6c0.3-3,0.8-5.8,0.7-8.5 c-0.5-10.1-1.4-20.2-1.9-30.3c-0.4-7.6-3.4-13.7-9.1-18.7c-1.4-1.3-2.5-3.3-2.9-5.1c-1.3-6.9-3.2-13.1-9.5-17.4 c-3.6-2.5-7-5.3-10.3-8.2c-2.9-2.6-5.4-3.4-8.7-0.7c-8.7,7.2-16.1,15.4-19.8,26.4C61,43,62.2,56.2,65.1,69.5 c4,18.2,9.1,36.1,7.7,55.3c-0.8,10.9-7.9,18-11.7,26.9c-0.3,0.7-1.7,1.1-2.6,1.2c-8.3,1.6-11.8,7.6-14.8,14.7 c-2.1,5.1-4.9,10.1-8.5,14.2c-6.2,7.3-10.1,15-9.9,24.8c0.1,5.2-1.1,10.5-1.9,15.7c-0.5,3.3-2.5,3.6-5.1,2.2 c-5.1-2.8-8.2-6.9-8.9-13c-0.8-6.7,1.6-12.4,5.3-17.7c5.9-8.2,12-16.4,17.6-24.7c4.7-6.9,7.3-14.6,6.1-23.1 c-1.1-7.7-5.1-13.5-11.9-17.8c12.1,15.2,7.8,29.1-2.9,42.6c-3.1,3.9-6.1,7.9-9.4,11.6C7.8,189.6,3.3,197.9,0,207z M322.9,75.6 c1.7-8.5,3.5-16,4.5-23.6c0.3-2.6-0.8-6.3-2.6-8.1c-1.3-1.3-5.7-1.5-7.1-0.3c-2.1,1.7-4.1,5.3-3.9,7.8 C314.7,59.6,317.1,67.7,322.9,75.6z M309.5,79.4c-4.1-7-9.4-11.6-15.8-14.8c-3.4-1.7-6.5,0-7.8,3.3c-1.4,3.5,0.6,6.3,4.1,7.2 C296.1,76.8,302.4,77.9,309.5,79.4z M54.7,117.4c0.6-0.3,1.1-0.5,1.7-0.8c-2.3-6.2-4.3-12.6-7.1-18.6c-0.8-1.7-3.8-3.2-5.9-3.3 c-1.5,0-4,2.2-4.4,3.8c-0.4,1.8,0.6,4.6,2,6C45.3,109.1,50.1,113.2,54.7,117.4z"/> <path d="M0,207c3.3-9,7.8-17.4,14.3-24.5c3.4-3.7,6.3-7.7,9.4-11.6c10.7-13.4,15-27.3,2.9-42.6c6.7,4.2,10.8,10.1,11.9,17.8 c1.2,8.5-1.4,16.2-6.1,23.1c-5.7,8.4-11.8,16.5-17.6,24.7c-3.8,5.3-6.1,10.9-5.3,17.7c0.7,6,3.7,10.1,8.9,13 c2.6,1.4,4.6,1.1,5.1-2.2c0.8-5.2,2-10.5,1.9-15.7c-0.2-9.8,3.6-17.5,9.9-24.8c3.6-4.1,6.3-9.2,8.5-14.2c3-7.1,6.5-13.1,14.8-14.7 c0.9-0.2,2.3-0.6,2.6-1.2c3.9-8.9,10.9-16,11.7-26.9c1.4-19.2-3.7-37.1-7.7-55.3C62.2,56.2,61,43,65.5,29.8 c3.7-11,11.1-19.1,19.8-26.4c3.3-2.7,5.8-1.9,8.7,0.7c3.3,2.9,6.6,5.8,10.3,8.2c6.2,4.2,8.2,10.5,9.5,17.4 c0.3,1.8,1.5,3.9,2.9,5.1c5.6,5.1,8.6,11.2,9.1,18.7c0.5,10.1,1.4,20.2,1.9,30.3c0.1,2.7-0.4,5.5-0.7,8.5c4.6-0.7,7.5-2.2,9.3-6.6 c4.1-9.7,8.4-19.3,19.5-23.4c9.7-3.5,19.1-1.6,28.2,1.4c14.5,4.9,29.4,6.2,44.5,6.7c21.3,0.6,39.8,8.8,56.7,21.7 c15.1,11.5,27,25.4,34.9,42.8c5.2,11.5,13.3,21.3,23.3,28.7c8.7,6.4,19,10.7,30.5,10.8c13.6,0.1,21.1-7.6,19.7-21.3 c-0.7-6.9-5.7-11.5-10.4-15.9c-8.8-8.1-18.5-15.3-26.8-23.8c-13.4-13.7-16.5-30.9-14-49.4c0.2-1.5,0.2-3,0.4-4.4 c0.2-1.3,0.6-2.5,1-4.1c3.6,4.9,6.7,9.6,10.2,13.9c5.5,6.9,12.4,12,20.6,15.3c2.9,1.1,5.6,0.8,4.9-2.8c-1.5-8.5,1.6-16,4.7-23.4 c7.3-17.5,20.9-29.8,35.6-43c-1.9,5-3.2,8.9-4.8,12.5c-8.2,18.8-7.5,37.8-0.4,56.6c3.9,10.4,8.9,20.4,12.6,30.8 c3.6,9.9,5.2,20.2,2,30.7c-0.7,2.2,0.3,4.8,0.6,7.3c0.5,4.4,0.9,8.8,1.6,13.1c0.1,0.9,1.3,1.6,1.9,2.4c0,1,0,2,0,3 c-0.5,0.8-1.3,1.6-1.4,2.5c-1.7,15.2-7.8,28.2-19.6,38.2c-15.5,12.9-37.8,16.9-55.5,3.5c-4.1-3.1-8.8-4.8-13.5-6.7 c-11.1-4.7-21.7-10.6-32.4-16.1c-3.8-1.9-7.3-4.2-11.8-6.7c0.3,5.9,0.8,10.7,0.5,15.4c-0.1,1.6-1.9,4-3.3,4.4 c-10.4,2.6-20.4,1.2-30-3.5c-14.3-7.1-23.1-19.2-29.7-33.1c-1.5-3.2-3.2-4.6-6.7-4.3c-5.3,0.5-10.6,0.8-15.9,1.1 c-2.2,0.1-4.5-0.7-6.5-0.1c-5.9,1.8-11.7,4-17.4,6.2c-0.9,0.3-1.6,1.2-2.4,1.9c3.2,0.6,6.1,0.1,9,0c3.2-0.2,6.3-0.1,9.5,0 c9.3,0.3,15.5,5,16.9,13.1c0.4,2,0.1,4.2,0.1,6.3c0.8,0.3,1.5,0.7,2.3,1c9.5,4.1,12.3,8.6,11.8,19.1c0,0.8,0.3,1.6,0.5,2.3 c0.8,3.7,1.6,7.4,2.7,12.2c6.9,4.9,7.7,10.8,0.2,14.3c-6.7,3.2-14.3,6.1-21.6,6.4c-20.9,0.7-36.4-10.8-49.9-25.2 c-5.5-5.9-10.3-12.5-15.4-18.9c-3-3.8-5.5-4.4-8.9-0.2c-4.8,6-11.4,9.8-18.9,11.3c-3.4,0.7-5.1,2.2-6.6,5 c-7.1,13.9-17.8,23.5-33.3,26.8c-8,1.7-16.3,2.4-22.4,9c-0.6,0.7-1.7,1-2.6,1.4c-3.4,1.3-6.7,2.5-10,3.8 c1.6,6.7,8.7,14.3,14.2,13.7c5.4-0.6,10.9-2.6,15.6-5.4c5.4-3.3,10-8.1,15.3-12.7c0.6,1.9,1,3.2,1.8,6c2.1-2.4,4.4-3.9,4.6-5.6 c0.3-3.8,2.9-4.5,5.4-4.5c6.1-0.1,12.3,0.4,18.4,0.6c9.3,0.3,19.1,1.8,24.5-9.3c0,8.6-6.8,13.4-13.8,14.4 c-7.8,1.2-15.8,1.8-23.7,2.1c-5.2,0.2-9.8,1.4-13.7,4.9c-5.1,4.7-10.4,9.2-16.3,14.4c-0.5-4.4-2.7-5.1-5.2-2.9 c-1,0.9-0.7,3.1-1.3,6c-0.9,0-3.3-0.2-5.6,0.1c-0.7,0.1-1.3,1.4-1.9,2.1c-0.7,0-1.3,0-2,0c-0.8-0.5-1.6-1.2-2.5-1.4 c-12.1-1.8-19.8-8.5-22.9-20.4c-0.4-1.5-2-3.2-3.4-3.8c-10.5-4.4-17.6-11-17.8-23.3c0-1.3-2-3.2-3.5-3.8 c-8.9-4-14.2-10.5-15.4-20.3c-0.1-1-0.9-2-1.4-3C0,209,0,208,0,207z M165,175.1c4.5-1.9,8.9-3.8,13.4-5.8c7-3,14.7-4.5,20.8-9.5 c4.1-3.3,6.6-9.3,5-13.7c-1.9-5.1-6.3-5.9-11.1-5.7c-6.3,0.3-12.6,0.8-18.9,0.9c-1.3,0-2.7-1.3-4.1-2.1c0.9-1,1.7-2.6,2.8-3 c4.8-1.8,9.7-3.2,14.5-4.9c2.7-0.9,5.3-2.1,9.2-3.6c-2.8-1.9-4.3-3.5-6-4c-8.1-2.3-16.3-4.5-24.9-2.5c-4.8,1.1-9.7,2.6-14.6,2.7 c-4.7,0.1-7.4,2.5-10.3,5.5c-2.9,2.9-6.1,5.7-9.6,7.8c-6.7,4-13.8,4.5-21.3,0.7c7.2-11.9,14.7-23.1,19.4-36.2 c-1.5,0-1.9-0.1-2.1,0c-24.1,10.6-43.4,26.7-56.6,49.7c-0.9,1.6-0.7,3.8-1.1,5.8c-13.2,0.4-15.7,2.7-19.9,15.3 c-1.6,4.9-4.7,9.4-7.6,13.8c-3,4.5-7.7,8.2-7.5,14.2c0.5,10.9-1.7,21.4-3.8,32c-1.1,5.4-1.5,11.5,4.3,15.3c6,4,12.4,6.2,20.6,2.4 c-2.8-1.2-4.7-2-7.5-3.2c10.1-2.1,19.3-3.9,28.4-5.8c16.8-3.5,29.4-12.6,36.9-28.3c4.4-9.1,2.2-15.7-6.6-20.4 c-3.9-2.1-8-3.9-12.6-6.2c17.9,0.2,24.8,5.1,30.3,21c6.8-1.7,12.3-5,16.2-11.5c-2.2-1.3-3.9-2.4-5.8-3.5 c7.8-3.8,21.6,2.1,28.5,10.2c6.3,7.4,12.6,15.1,19.9,21.5c10.6,9.4,22.9,16.1,37.8,15c3.9-0.3,7.6-1.6,11.5-2.5 c0-0.6-0.1-1.3-0.1-1.9c-12.6-3.1-26.2-4-35.6-15.9c12,2.3,22.5,7.4,34.1,6.1c1.5-5-1.4-7.2-4.6-8.6c-6.9-2.9-14-5.1-20.8-8.1 c-5.6-2.4-10.8-5.5-16.3-8.3c0.2-0.3,0.4-0.5,0.5-0.8c13.3,3.3,26.7,6.7,40.5,10.1c-1.5-7.8-7-10.1-12.8-12 c-4.9-1.6-9.9-3-14.8-4.5c2.3-0.7,4.2,0.1,6.2,0c2-0.1,3.9-1.1,5.9-1.7c-0.8-2.3-1.2-4.9-2.5-6.9c-0.7-1.1-2.9-1.7-4.5-1.8 c-6.6-0.5-13.2-0.8-19.8-1.1C179.7,181.2,171.8,179.7,165,175.1z M309.8,132.6c-4.1-6-7.3-11.7-11.5-16.4 c-22.1-25.2-49.3-39.3-83.6-37.8c-4.4,0.2-9-0.5-13.3-1.5c-9.2-2.1-18.2-5.2-27.4-6.9c-9-1.6-18.2-2-24.3,7 c-2.5,3.7-4.3,7.9-6.1,11.9c-5.5,12.1-10.9,24.2-16.2,36.3c-0.5,1.1-0.7,2.3-1,3.5c3-0.8,5.4-2.1,6.9-4c5.9-7.4,11.5-15,17.3-22.5 c3.4-4.4,6.1-9.7,12.7-11.6c-3.8,7.9-7.4,15.4-11,22.8c0.5,0.5,1,1.1,1.5,1.6c6-2.6,12.4-4.6,17.8-8.1c5.6-3.6,10.2-8.6,15.3-13 c0.5,0.3,1.1,0.6,1.6,0.9c-2.1,5-4.2,10-6.5,15.4c1.7,0.3,3.4,0.9,5.1,1c10.4,0.1,19.4-3.5,27.5-9.8c2.5-1.9,5.2-3.5,7.8-5.2 c-0.5,6.2-1.9,11.4-10.4,11.7c2.8,1.7,4.1,3.2,5.4,3.1c9.4-0.7,18.8-1.7,27.2-6.8c1.8-1.1,4-1.5,5.9-2.2c0.2,0.4,0.5,0.8,0.7,1.2 c-1.2,2.4-2.4,4.8-4,8.1c9.1,0,17.3,0,26,0c-1.2,1.7-2.6,3.6-4.3,5.9c8.2,5.2,16.5,5.3,25.4,3.8c-2.2,1.3-4.4,2.6-6.6,3.9 C292.2,131.7,299.1,134.3,309.8,132.6z M89,76.5c-0.5-3.2-1.5-6.5-1.4-9.7c0.1-8.2,0.4-16.3,1-24.5c0.6-7.6,2.1-15.2,2.7-22.8 c0.2-2.5-1.2-5.1-2-8C80.1,17.8,74.7,26,72.7,35.7c-2.6,12.7-1.6,25.5,2,38c1.3,4.6,3.5,9,4.3,13.7c1.3,7.9,1.9,15.9,2.8,23.8 c0.5,0.1,0.9,0.2,1.4,0.3c1.4-3.5,2.7-6.9,4.2-10.6c0.4,2.4,0.8,4.6,1.1,6.8c0.7,4.5,3.2,5.6,6.8,3.1c2.9-2,6-3.7,8.5-6 c6.2-5.7,13.9-10.4,15.5-19.8c0.5-2.8,1.4-5.5,2.1-8.5c-3.5-1.7-2.6-1.9-3.7-6.8c-1.9-8.7,3-18.9-6.6-26.9 c-1.9,8.7-3.7,16.9-5.6,25.7c-0.4-5.3-2.7-9.4-1.5-14.9c1.9-8.2,1.7-16.9,2.3-25.4c0.3-4.2-2.6-7.3-6.7-7.3 C98.2,39.7,87.8,56.7,89,76.5z M419.1,147c0.5-0.9,1.4-2,1.5-3.1c0.2-6.3,1.5-12.8,0.1-18.7c-2.3-9.2-6.1-18.2-9.9-27 c-6.1-14.1-10.7-28.6-10.3-44.2c0-1.5-0.2-3-0.3-4.5c-0.5,0-0.9-0.1-1.4-0.1c-8.8,12.4-14.3,25.9-10.5,41.6 c3.6,14.9,8.1,29.7,11.8,44.6c1.5,6.2,2,12.8,3,19.1c0.6,0,1.1,0.1,1.7,0.1c1-4.8,2.3-9.5,2.8-14.3c0.5-5,0.1-10,0.1-15 c0.6-0.2,1.2-0.4,1.8-0.5C412.5,132.4,415.7,139.5,419.1,147z M364.4,210c7,8.4,30.2,7.3,43.5-4.5c13.1-11.6,19.3-35.4,13.9-44.2 c-8.2,6.1-16.5,12.1-25.8,19c5.9,0,10.6,0,16.3,0C396.8,192.3,382.9,204.5,364.4,210z M247.5,154.3c0,0.6-0.1,1.1-0.1,1.7 c-1.7-1-3.4-2.4-5.2-2.7c-1.9-0.4-4,0.2-6,0.4c0.2,1.8-0.1,4,0.8,5.5c2.9,4.8,6,9.5,9.4,14.1c7,9.5,15,17.8,26.3,22.2 c2.6,1,5.4,1.5,8.1,2.2c0.2-0.4,0.4-0.9,0.6-1.3c-7-7.1-13.9-14.3-20.9-21.4c0.2-0.3,0.5-0.5,0.7-0.8c8.8,5.8,17.6,11.6,26.4,17.3 c0.3-0.3,0.7-0.6,1-0.8c-0.5-1.6-0.8-3.4-1.5-4.9c-7.1-15-20.6-23.5-33.7-32.1C252,152.7,249.4,154,247.5,154.3z M381.7,106.1 c0.9-5.1-1-10.8-3.8-11.5c-9.1-2.3-17.9-5-23.4-13.6c-0.6-0.9-2.3-1-4.1-1.7c0.9,15.6,8.2,26.7,18.9,35.9c1.8,1.5,4.3,1.7,5.7,4.2 c1,1.8,3.7,2.7,5.6,4c0.5-0.3,1-0.6,1.4-0.8c-1.4-3.1-2.7-6.4-4.4-9.4c-1.7-2.9-3.8-5.5-6.3-8.9 C375.4,104.9,378.6,105.5,381.7,106.1z M298.1,147.6c-4.3-0.2-7,3.3-5.7,7.5c2,6.7,12.2,14.4,19,14.3c4.4,0,6.8-3.5,5.3-7.8 C314.4,155.1,304.9,147.8,298.1,147.6z M330.7,167.6c-6.5-0.3-8.3,2.5-5.9,7.4c2.7,5.3,7.5,7.8,12.9,9.2c1.8,0.5,5,0,5.9-1.3 c1-1.5,1-4.6,0.1-6.4C340.9,170.8,335.5,168.6,330.7,167.6z M364.7,196c3.5-0.8,6.8-1.2,9.8-2.3c1.2-0.4,2.7-2.2,2.7-3.5 c0.1-1.2-1.3-3.1-2.5-3.5c-6.4-2.4-13.1-4.3-19.5-0.1c-1.1,0.7-2.5,2.2-2.4,3.2c0.1,1.3,1.2,3.2,2.4,3.7 C358.2,194.7,361.5,195.2,364.7,196z M340.5,203.3c2.2-1.3,4.5-1.9,5.3-3.3c0.6-1-0.2-3.9-1.2-4.6c-3.3-2.2-7-4.1-10.8-5.5 c-1.2-0.4-3.8,0.9-4.5,2.1c-0.7,1.2-0.3,4.1,0.7,4.9C333.1,199.3,336.8,201.1,340.5,203.3z M309,179.9c4.1,3,7.5,5.7,11.2,8.1 c0.9,0.6,2.7,0.4,3.7-0.1c0.6-0.3,0.7-2.1,0.5-3.1C323.6,179.2,315.2,176.1,309,179.9z"/> <path class="st0" d="M69,286c0.6-0.7,1.2-2,1.9-2.1c2.3-0.3,4.7-0.1,5.6-0.1c0.5-2.9,0.3-5.1,1.3-6c2.4-2.2,4.6-1.4,5.2,2.9 c5.9-5.2,11.2-9.7,16.3-14.4c3.9-3.6,8.4-4.7,13.7-4.9c7.9-0.3,15.9-0.9,23.7-2.1c7-1.1,13.8-5.9,13.8-14.4 c-5.4,11.2-15.1,9.6-24.5,9.3c-6.1-0.2-12.3-0.7-18.4-0.6c-2.5,0-5.1,0.8-5.4,4.5c-0.2,1.7-2.5,3.2-4.6,5.6c-0.8-2.7-1.2-4-1.8-6 c-5.4,4.6-9.9,9.4-15.3,12.7c-4.6,2.8-10.2,4.8-15.6,5.4c-5.5,0.6-12.6-7-14.2-13.7c3.3-1.2,6.7-2.5,10-3.8c0.9-0.4,2-0.7,2.6-1.4 c6-6.6,14.3-7.3,22.4-9c15.5-3.3,26.2-13,33.3-26.8c1.5-2.9,3.2-4.4,6.6-5c7.5-1.5,14.1-5.2,18.9-11.3c3.4-4.2,5.9-3.7,8.9,0.2 c5,6.4,9.8,13,15.4,18.9c13.5,14.4,29,25.9,49.9,25.2c7.3-0.2,14.9-3.2,21.6-6.4c7.5-3.5,6.6-9.4-0.2-14.3 c-1.1-4.8-1.9-8.5-2.7-12.2c-0.2-0.8-0.5-1.6-0.5-2.3c0.5-10.5-2.2-14.9-11.8-19.1c-0.7-0.3-1.5-0.7-2.3-1c0-2.2,0.3-4.3-0.1-6.3 c-1.4-8.1-7.6-12.8-16.9-13.1c-3.2-0.1-6.3-0.1-9.5,0c-2.9,0.1-5.8,0.6-9,0c0.8-0.6,1.5-1.5,2.4-1.9c5.8-2.2,11.5-4.4,17.4-6.2 c2-0.6,4.3,0.2,6.5,0.1c5.3-0.3,10.6-0.6,15.9-1.1c3.5-0.3,5.2,1.1,6.7,4.3c6.6,13.9,15.4,26,29.7,33.1c9.6,4.7,19.6,6.1,30,3.5 c1.4-0.4,3.2-2.8,3.3-4.4c0.2-4.7-0.3-9.5-0.5-15.4c4.4,2.5,8,4.8,11.8,6.7c10.7,5.5,21.3,11.5,32.4,16.1c4.7,2,9.4,3.6,13.5,6.7 c17.7,13.4,40,9.4,55.5-3.5c11.9-9.9,18-22.9,19.6-38.2c0.1-0.9,0.9-1.6,1.4-2.5c0,38,0,75.9,0,114C311.7,286,190.3,286,69,286z M170.4,247.9c-0.6,0.4-1.2,0.9-1.9,1.3c3.4,5.7,6.5,11.6,10.4,17c2.2,3.1,5.8,3.2,8.8,0.4c2.7-2.5,2.5-6.1-1-8.5 C181.4,254.5,175.8,251.3,170.4,247.9z M163.9,257c-0.3-0.1-0.7-0.1-1-0.2c-2.2,3.1-4.6,6-6.3,9.4c-0.6,1.3,0.6,3.6,1,5.4 c1.6-0.9,4.4-1.4,4.7-2.6C163.3,265.1,163.4,261,163.9,257z"/> <path class="st0" d="M0,210c0.5,1,1.3,1.9,1.4,3c1.2,9.8,6.5,16.3,15.4,20.3c1.5,0.7,3.5,2.5,3.5,3.8c0.3,12.2,7.4,18.9,17.8,23.3 c1.4,0.6,3,2.3,3.4,3.8c3.2,11.9,10.8,18.6,22.9,20.4c0.9,0.1,1.7,0.9,2.5,1.4c-22.3,0-44.5,0-67,0C0,260.7,0,235.3,0,210z"/> <path d="M322.9,75.6c-5.8-7.9-8.2-15.9-9.2-24.3c-0.3-2.5,1.8-6.1,3.9-7.8c1.5-1.2,5.9-1,7.1,0.3c1.8,1.9,3,5.5,2.6,8.1 C326.4,59.5,324.6,67,322.9,75.6z"/> <path d="M309.5,79.4c-7.1-1.5-13.4-2.7-19.5-4.3c-3.5-0.9-5.5-3.7-4.1-7.2c1.3-3.3,4.4-5,7.8-3.3 C300.1,67.8,305.4,72.4,309.5,79.4z"/> <path d="M54.7,117.4c-4.6-4.2-9.4-8.3-13.7-12.8c-1.4-1.4-2.4-4.2-2-6c0.3-1.6,2.9-3.9,4.4-3.8c2.1,0.1,5.1,1.6,5.9,3.3 c2.8,6,4.8,12.4,7.1,18.6C55.8,116.9,55.2,117.2,54.7,117.4z"/> <path class="st0" d="M165,175.1c6.9,4.6,14.7,6.1,22.9,6.4c6.6,0.2,13.2,0.5,19.8,1.1c1.6,0.1,3.7,0.7,4.5,1.8 c1.3,2,1.7,4.6,2.5,6.9c-2,0.6-3.9,1.6-5.9,1.7c-1.9,0.1-3.9-0.6-6.2,0c4.9,1.5,9.9,2.9,14.8,4.5c5.8,1.9,11.2,4.3,12.8,12 c-13.8-3.4-27.1-6.8-40.5-10.1c-0.2,0.3-0.4,0.5-0.5,0.8c5.4,2.8,10.7,5.9,16.3,8.3c6.8,3,14,5.2,20.8,8.1 c3.3,1.4,6.2,3.6,4.6,8.6c-11.5,1.3-22.1-3.8-34.1-6.1c9.4,11.9,23,12.9,35.6,15.9c0,0.6,0.1,1.3,0.1,1.9 c-3.8,0.9-7.6,2.2-11.5,2.5c-14.9,1-27.2-5.6-37.8-15c-7.3-6.4-13.5-14.1-19.9-21.5c-6.9-8.1-20.7-14-28.5-10.2 c1.9,1.1,3.6,2.2,5.8,3.5c-3.9,6.5-9.4,9.8-16.2,11.5c-5.5-15.9-12.4-20.8-30.3-21c4.6,2.3,8.7,4.1,12.6,6.2 c8.8,4.7,11,11.3,6.6,20.4c-7.5,15.6-20.1,24.7-36.9,28.3c-9.2,1.9-18.4,3.8-28.4,5.8c2.8,1.2,4.7,2,7.5,3.2 c-8.2,3.8-14.5,1.7-20.6-2.4c-5.8-3.8-5.4-9.9-4.3-15.3c2.1-10.6,4.3-21.1,3.8-32c-0.2-6,4.5-9.7,7.5-14.2c2.9-4.4,6-8.9,7.6-13.8 c4.2-12.7,6.7-14.9,19.9-15.3c0.3-2,0.2-4.2,1.1-5.8c13.2-23,32.5-39.1,56.6-49.7c0.3-0.1,0.6,0,2.1,0 c-4.6,13.2-12.2,24.3-19.4,36.2c7.4,3.8,14.5,3.3,21.3-0.7c3.5-2.1,6.8-4.9,9.6-7.8c2.9-3,5.6-5.4,10.3-5.5 c4.9-0.1,9.8-1.6,14.6-2.7c8.6-2,16.8,0.2,24.9,2.5c1.7,0.5,3.2,2.1,6,4c-3.9,1.5-6.5,2.7-9.2,3.6c-4.8,1.7-9.8,3.1-14.5,4.9 c-1.2,0.4-1.9,2-2.8,3c1.4,0.7,2.7,2.1,4.1,2.1c6.3-0.1,12.6-0.6,18.9-0.9c4.7-0.2,9.2,0.6,11.1,5.7c1.6,4.4-0.9,10.4-5,13.7 c-6.1,5-13.8,6.4-20.8,9.5C173.9,171.3,169.4,173.2,165,175.1z M76.7,193.4c-11.5,0-20.2,8.4-20.3,19.4 c-0.1,11.9,8.5,20.7,20.1,20.7c11.1,0,21.3-9.2,20.7-20C96.7,201.6,88,193.4,76.7,193.4z M136.2,177c10.3,5.3,20.6,10.6,30.9,15.8 C159.3,182.8,149.4,176.5,136.2,177z"/> <path class="st0" d="M309.8,132.6c-10.7,1.7-17.6-0.9-22-7.5c2.2-1.3,4.4-2.6,6.6-3.9c-8.9,1.5-17.2,1.4-25.4-3.8 c1.7-2.3,3-4.2,4.3-5.9c-8.7,0-16.9,0-26,0c1.6-3.3,2.8-5.7,4-8.1c-0.2-0.4-0.5-0.8-0.7-1.2c-2,0.7-4.2,1.1-5.9,2.2 c-8.4,5.1-17.7,6.1-27.2,6.8c-1.2,0.1-2.6-1.4-5.4-3.1c8.6-0.4,9.9-5.5,10.4-11.7c-2.6,1.7-5.4,3.3-7.8,5.2 c-8.1,6.4-17.2,9.9-27.5,9.8c-1.7,0-3.4-0.6-5.1-1c2.3-5.4,4.4-10.4,6.5-15.4c-0.5-0.3-1.1-0.6-1.6-0.9c-5,4.4-9.7,9.5-15.3,13 c-5.4,3.5-11.8,5.4-17.8,8.1c-0.5-0.5-1-1.1-1.5-1.6c3.6-7.4,7.2-14.9,11-22.8c-6.6,1.9-9.3,7.1-12.7,11.6 c-5.8,7.5-11.4,15.1-17.3,22.5c-1.5,1.9-4,3.1-6.9,4c0.3-1.2,0.6-2.4,1-3.5c5.4-12.1,10.8-24.3,16.2-36.3 c1.8-4.1,3.7-8.2,6.1-11.9c6-9,15.3-8.6,24.3-7c9.2,1.7,18.2,4.8,27.4,6.9c4.3,1,8.9,1.7,13.3,1.5c34.3-1.6,61.5,12.6,83.6,37.8 C302.5,120.9,305.7,126.6,309.8,132.6z"/> <path class="st0" d="M89,76.5c-1.2-19.8,9.2-36.8,10.7-55.4c4.1,0,7,3.1,6.7,7.3c-0.5,8.5-0.4,17.2-2.3,25.4 c-1.3,5.4,1.1,9.5,1.5,14.9c1.9-8.8,3.7-17,5.6-25.7c9.6,8,4.7,18.2,6.6,26.9c1.1,4.8,0.3,5,3.7,6.8c-0.7,2.9-1.6,5.7-2.1,8.5 c-1.6,9.4-9.3,14.1-15.5,19.8c-2.5,2.3-5.7,4-8.5,6c-3.6,2.5-6.1,1.4-6.8-3.1c-0.3-2.2-0.7-4.5-1.1-6.8c-1.5,3.7-2.8,7.2-4.2,10.6 c-0.5-0.1-0.9-0.2-1.4-0.3c-0.9-7.9-1.4-15.9-2.8-23.8c-0.8-4.7-3-9.1-4.3-13.7c-3.5-12.5-4.6-25.4-2-38c2-9.7,7.3-17.9,16.6-24.1 c0.8,2.9,2.2,5.5,2,8c-0.6,7.6-2.1,15.2-2.7,22.8c-0.7,8.1-1,16.3-1,24.5C87.5,70,88.5,73.3,89,76.5z"/> <path class="st0" d="M419.1,147c-3.4-7.5-6.6-14.7-9.8-21.9c-0.6,0.2-1.2,0.4-1.8,0.5c0,5,0.4,10-0.1,15 c-0.5,4.8-1.8,9.5-2.8,14.3c-0.6,0-1.1-0.1-1.7-0.1c-1-6.4-1.4-12.9-3-19.1c-3.7-14.9-8.1-29.7-11.8-44.6 c-3.8-15.7,1.7-29.2,10.5-41.6c0.5,0,0.9,0.1,1.4,0.1c0.1,1.5,0.4,3,0.3,4.5c-0.4,15.6,4.2,30,10.3,44.2c3.8,8.8,7.6,17.7,9.9,27 c1.5,5.9,0.2,12.5-0.1,18.7C420.5,145.1,419.6,146.1,419.1,147z"/> <path class="st0" d="M364.4,210c18.5-5.6,32.4-17.7,47.8-29.7c-5.7,0-10.4,0-16.3,0c9.4-6.9,17.6-12.9,25.8-19 c5.4,8.8-0.8,32.6-13.9,44.2C394.6,217.4,371.4,218.5,364.4,210z"/> <path class="st0" d="M247.5,154.3c2-0.3,4.6-1.5,5.8-0.7c13.2,8.7,26.6,17.1,33.7,32.1c0.7,1.5,1,3.3,1.5,4.9 c-0.3,0.3-0.7,0.6-1,0.8c-8.8-5.8-17.6-11.6-26.4-17.3c-0.2,0.3-0.5,0.5-0.7,0.8c7,7.1,13.9,14.3,20.9,21.4 c-0.2,0.4-0.4,0.9-0.6,1.3c-2.7-0.7-5.5-1.2-8.1-2.2c-11.2-4.4-19.3-12.7-26.3-22.2c-3.3-4.6-6.5-9.3-9.4-14.1 c-0.9-1.5-0.5-3.6-0.8-5.5c2-0.2,4.1-0.8,6-0.4c1.8,0.4,3.5,1.8,5.2,2.7C247.4,155.4,247.5,154.9,247.5,154.3z"/> <path class="st0" d="M381.7,106.1c-3.1-0.6-6.3-1.2-10.4-1.9c2.4,3.4,4.6,6,6.3,8.9c1.7,3,2.9,6.2,4.4,9.4c-0.5,0.3-1,0.6-1.4,0.8 c-1.9-1.3-4.6-2.2-5.6-4c-1.4-2.5-3.9-2.7-5.7-4.2c-10.8-9.2-18-20.3-18.9-35.9c1.8,0.7,3.6,0.8,4.1,1.7 c5.5,8.6,14.3,11.3,23.4,13.6C380.7,95.2,382.7,101,381.7,106.1z"/> <path class="st0" d="M298.1,147.6c6.8,0.3,16.4,7.5,18.6,14.1c1.5,4.2-0.9,7.7-5.3,7.8c-6.8,0-17-7.7-19-14.3 C291.1,150.8,293.7,147.4,298.1,147.6z"/> <path class="st0" d="M330.7,167.6c4.8,1.1,10.2,3.2,13,8.9c0.9,1.8,0.9,4.9-0.1,6.4c-0.8,1.2-4,1.7-5.9,1.3 c-5.4-1.3-10.3-3.8-12.9-9.2C322.4,170.1,324.2,167.3,330.7,167.6z"/> <path class="st0" d="M364.7,196c-3.2-0.8-6.5-1.3-9.5-2.5c-1.2-0.5-2.3-2.4-2.4-3.7c-0.1-1,1.3-2.5,2.4-3.2 c6.5-4.3,13.1-2.4,19.5,0.1c1.2,0.4,2.6,2.4,2.5,3.5c-0.1,1.2-1.5,3.1-2.7,3.5C371.4,194.8,368.1,195.2,364.7,196z"/> <path class="st0" d="M340.5,203.3c-3.7-2.2-7.4-4-10.5-6.5c-1-0.8-1.4-3.7-0.7-4.9c0.7-1.2,3.4-2.6,4.5-2.1 c3.8,1.4,7.4,3.3,10.8,5.5c1.1,0.7,1.8,3.6,1.2,4.6C345,201.3,342.7,202,340.5,203.3z"/> <path class="st0" d="M309,179.9c6.2-3.8,14.6-0.7,15.4,4.8c0.1,1,0,2.8-0.5,3.1c-1,0.5-2.8,0.7-3.7,0.1 C316.6,185.6,313.1,182.9,309,179.9z"/> <path d="M170.4,247.9c5.4,3.4,11,6.6,16.3,10.3c3.5,2.5,3.7,6.1,1,8.5c-3,2.7-6.6,2.6-8.8-0.4c-3.9-5.4-7-11.3-10.4-17 C169.1,248.8,169.8,248.3,170.4,247.9z"/> <path d="M163.9,257c-0.5,4-0.5,8.1-1.6,12c-0.3,1.2-3.1,1.8-4.7,2.6c-0.4-1.8-1.6-4.1-1-5.4c1.6-3.3,4.1-6.3,6.3-9.4 C163.2,256.8,163.6,256.9,163.9,257z"/> <path d="M76.7,193.4c11.3,0,19.9,8.2,20.5,20.1c0.5,10.8-9.6,20-20.7,20c-11.7,0-20.2-8.8-20.1-20.7 C56.5,201.8,65.3,193.4,76.7,193.4z M86.8,218.1c3-4.6,1.9-10.4-2.3-13.7c-5.7-4.4-12.5-3.6-17.2,1.9c-3.4,4-3.5,8.3-0.3,11.5 c1-1.5,2-3,3.2-4.7c4.1,3.1,7.6,2.3,10.9-2C83,213.6,84.8,215.7,86.8,218.1z"/> <path d="M136.2,177c13.2-0.6,23.1,5.8,30.9,15.8C156.8,187.6,146.5,182.3,136.2,177z"/> <path class="st0" d="M86.8,218.1c-2-2.4-3.7-4.5-5.8-7.1c-3.2,4.3-6.8,5.1-10.9,2c-1.2,1.8-2.2,3.3-3.2,4.7 c-3.2-3.2-3.1-7.5,0.3-11.5c4.7-5.6,11.6-6.3,17.2-1.9C88.7,207.7,89.7,213.5,86.8,218.1z"/> </g> </g> </svg> </figure>';
}

/*
* Create a header/navigation where the <prototype-headr> tag is present
*/
function prototypeHeader () {
  document.querySelector('prototype-header').innerHTML = '<section class="hero"><div class="hero-body header-body"><div class="container"><nav class="level"><div class="level-left"><div class="level-item has-text-centered"><nav class="level"><div class="level-item"><a href="/" class="logo-link"><prototype-koi></prototype-koi></div><div class="level-item has-text-centered"><h1 class="has-text-grey-dark has-text-weight-bold logo">' + siteTitle + '</h1></a></div></nav></div></div><div class="level-right"><nav class="level" id="nav-links"></nav></div></nav></div></div></section>' ;
}

/*
* The <prototype> tag is more powerful than indidvudal elements
* It allows more custom uses for the indidvual prototype funcitons
*/
if (document.querySelector('prototype'))
{
  prototypeBoxes();
  prototypeKoi();
  prototypeNavLinks(links);
}

/*
* Call the three functions that make up the header
*/
if (document.querySelector('prototype-header'))
{
  prototypeHeader();
  prototypeKoi();
  prototypeNavLinks(links);
}

/*
* Call the footer function
*/
if (document.querySelector('prototype-footer'))
{
  prototypeFooter();
}
console.log(hadena.extractColourPalette('https://today.tamu.edu/wp-content/uploads/sites/4/2017/01/year-of-rooster-2.jpg-small.jpg', 1))
// if (params.has('q')) {
//   search(params.get('q'));
// }

},{"hadenajs":3}]},{},[5]);
