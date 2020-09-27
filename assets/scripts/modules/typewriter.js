const math = require('matematik');

/*
* Variables for typeWrite function
* words array of example words and colors for action
* speed to identify in miliseconds how long after each char to wait
* IintervalTypeWrite to tell the window how often in miliseconds to run typeWriter
*/
var i = 0; //Keep "i" counter variable outside of typeWrite function to preserve it
var words = [["flamingo", "#F45F87"],
["spring time", "#D04127"],
["koi fish", "#E1621A"],
["bumble bee", "#FCCC05"],
["atlantic ocean", "#78A3C7"],
["lavender", "#A085D8"],
["fall in new england", "#D67D25"],
"pride", "#FF0000",
["humback whale", "#B4D4DC"]];
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
  if (i < txt[0].length)
  {
      document.querySelector("#imagesHome").placeholder += txt[0][i];
      i++;
      setTimeout(typeWriter, speed);
  }
  if (i === txt[0].length)
  {
    document.querySelector("#koi").style.fill = txt[1];
    await sleep(1000);
    await sleep(3000);
    i = 0;
    txt = words[math.getRandomInt(words.length - 1)];
    document.querySelector("#imagesHome").placeholder = ""; //Use placeholder not value so user can still begin typing
    return;
  }
}
if (document.querySelector('#imagesHome') != null) {
  typeWriter(); //Start the function immediatly, without waiting the interval time
}
