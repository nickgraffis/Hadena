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
