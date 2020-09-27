const typewriter = require('./modules/typewriter.js');

/* Get a file from directory and return it as a string*/
function getFile(file) {
  var x = new XMLHttpRequest();
  x.open('GET', file, false);
  x.send();
  return x.responseText;
}

/*
* Fill in the footer where the <prototype-header> tag is present
*/
function prototypeHero () {
  document.getElementsByTagName('prototype-hero')[0].innerHTML = getFile('templates/hero.html');
}

/*
* Fill in the footer where the <prototype-footer> tag is present
*/
function prototypeFooter () {

  document.querySelector('prototype-footer').innerHTML = getFile('components/footer.html');

}

if (document.getElementsByTagName('prototype-hero')) {
  prototypeHero();
}

if (document.getElementsByTagName('prototype-footer')) {
  prototypeFooter();
}
