'use strict';

///////////////////////////////////////

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const buttonScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');

const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

///////////////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////////////
// Button scrolling

buttonScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();

  // window.scrollTo(
  //   // s1coords.left,
  //   // s1coords.top
  //   // soultion to this is 👇
  //   s1coords.left + window.scrollX,
  //   s1coords.top + window.scrollY
  // );

  // A better way of creating the scroll

  // window.scrollTo({
  //   left: s1coords.left + window.scrollX,
  //   top: s1coords.top + window.scrollY,
  //   behavior: 'smooth',
  // });

  // a modern way of implementing the above code
  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////////////////////////////
// Page navigation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sibling.forEach(el => {
      if (el !== link) el.style.opacity = this;
      logo.style.opacity = this;
    });
  }
};
// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });
// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// sticky navigation

// Intersection observer
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
// getting the position of section1
// const initialcoords = section1.getBoundingClientRect();

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Menu fade animation
// revealing section

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  // console.log(entries);

  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialcoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//     console.log(id);
//   });
// });

// Abetter solution for the code above is using event delegation. In event delegation we have two steps
// 1. attache an event listener to the common parent
// 2. determine the elemnet that originated the event

document.querySelector('.nav__links').addEventListener(
  'click',
  function (e) {
    e.preventDefault();

    if (e.target.classList.contains('nav__link')) {
      const id = e.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  }
  // console.log(e.target)
);

// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  console.log(clicked);
  console.log(clicked.dataset.tab);

  // guarding operator
  if (!clicked) return;

  // remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));

  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // Activate tab
  clicked.classList.add('operations__tab--active');
  // Activate Content Area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Lazy Loading image

const targetImage = document.querySelectorAll('img[data-src]');

const loading = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
targetImage.forEach(img => imageObserver.observe(img));

// slider

const slides = document.querySelectorAll('.slide');
console.log(slides);

const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length;

// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.2) translateX(-800px)';
// slider.style.overflow = 'visible';

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `
      <button class = 'dots__dot' data-slide=${i} ></button>`
    );
  });
};

createDots();

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

activateDot(0);

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

// slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
goToSlide(0);

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot'))
    curSlide = Number(e.target.dataset.slide);
  goToSlide(curSlide);
  activateDot(curSlide);
});
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

/*
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);
console.log(document.getElementById('section--1'));

const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

// Inserting elements

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookie to enhance functionality and analytics <button class="btn btn--close-cookie"> Got it!</button>';
// header.prepend(message);
header.append(message);
// header.after(message);
// header.before(message);

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

// Style

message.style.backgroundColor = '#37383d';
message.style.width = '120%';

// To get a syle from the style sheet
console.log(getComputedStyle(message));
console.log(getComputedStyle(message).height);

// Changing the height

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';

// Attribute
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src); // returns the absolute path
console.log(logo.getAttribute('src')); // returns the relative path

const link = document.querySelector('.twitter-link');
console.log(link.href);
console.log(link.getAttribute('href'));

// EVents
const h1 = document.querySelector('h1');
// h1.addEventListener('mouseenter', function () {
//   alert('You just hovered over an header');
// });

// Modifying the evnt listener above so that you can only listen to it once

const alertH1 = function () {
  alert('You hovered over the h1 element');

  h1.removeEventListener('mouseenter', alertH1);
};

// h1.addEventListener('mouseenter', alertH1);

// rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomcolor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)}, ${randomInt(0, 255)})`;

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)}) `;
console.log(randomColor);

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('Link', e.target);
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('container', e.target);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('nav', e.target);
});



// DOM transversing

// Going: upward child
const h1 = document.querySelector('h1');
console.log(h1.childNodes);
console.log(h1.children);
console.log(h1.childElementCount);

console.log(h1.firstChild);
console.log(h1.firstElementChild);

console.log(h1.lastChild);
console.log(h1.lastElementChild);

// Going: upward parent

console.log(h1.parentElement);
console.log(h1.parentNode);

console.log(h1.closest('.header'));
h1.closest('.header').style.background = 'var(--gradient-secondary)';
console.log(h1.closest);

const title = document.querySelector('.header__title');
console.log(title.childNodes);
console.log(title.children);

const buttonOperation = document.querySelector('.operations__tab--2');
console.log(buttonOperation.closest('.operations__tab'));
console.log(buttonOperation.childNodes);
console.log(buttonOperation.children);

*/
