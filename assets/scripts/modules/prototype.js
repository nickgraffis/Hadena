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
