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
