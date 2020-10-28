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
