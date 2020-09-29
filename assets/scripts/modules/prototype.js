const __ = require('./router.js');
const time = require('./typewriter.js');
const _s_ = require('./imagesearch.js');
const math = require('matematik');

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
  document.querySelector('prototype-navbar').innerHTML = getFile('components/navbar.html');
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

/*
* Fill in the footer where the <prototype-footer> tag is present
*/
function prototypeFooter () {

  document.querySelector('prototype-footer').innerHTML = '<div class="hero-foot"><div class="content has-text-centered"><p><strong>派手な HADENA</strong> by <a href="https://twitter.com/nickgraffistwit">Nick Graffis</a>. Learn about the project<a href="/code"> here</a>.</p></div></div>';

}

async function homeSearch (event) {
  var params = document.querySelector('#imagesHome').value;
  event.preventDefault();
  document.getElementsByClassName('demo-wrapper')[0].style.opacity = 0;
  document.getElementById('logo-wrapper').style.animation = 'move-logo 2s ease-in-out forwards';
  document.getElementById('level-logo').style.animation = 'scale-logo 2s ease-in-out forwards';
  document.getElementById('home-form-control').style.animation = 'move-search 2s ease-in-out forwards';
  document.getElementById('home-form-wrapper').style.animation = 'scale-search 2s ease-in-out forwards';
  document.getElementById('hero-body').classList += 'is-paddingless';
  await time.sleep(2000);
  prototypeResults();
  prototypeBoxes();
  _s_.search(params);
  document.getElementById('homesearchbody').style.height = '0px';
  window.history.pushState({page: 1}, "title 1", '/#/s/' + params);
}

router
  .add(/s\/(.*)/, (params) => {
    console.log(params);
    if (document.getElementById('imagesHome')) {
      if (document.getElementById('results')) {
        document.querySelector("#resultText").innerHTML = params;
      }
    } else {
      application.innerHTML = getFile('templates/search.html');
      if (document.getElementsByTagName('prototype-koi').length > 0) {
        prototypeKoi();
      }
      if (document.getElementsByTagName('prototype-navbar').length > 0) {
        prototypeNavbar();
      }
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
    if (document.getElementsByTagName('prototype-navbar').length > 0) {
      prototypeNavbar();
      document.getElementById('navigation-brand').style.opacity = 0;
      document.getElementById('navigation-search').style.opacity = 0;
    }
    const homeform = document.querySelector('#homeform');
    homeform.addEventListener("submit", homeSearch);
  });
