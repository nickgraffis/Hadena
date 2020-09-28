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
