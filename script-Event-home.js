let slideIndex = 1;
let slideshowInterval = setInterval(showSlides, 5000);
const slides = document.getElementsByClassName("mySlides");
const dots = document.getElementsByClassName("dot");

function plusSlides(n) {
  clearInterval(slideshowInterval);
  showSlides(slideIndex += n);
  slideshowInterval = setInterval(showSlides, 5000);
}

function currentSlide(n) {
  clearInterval(slideshowInterval);
  showSlides(slideIndex = n);
  slideshowInterval = setInterval(showSlides, 5000);
}

function pauseSlideshow() {
if (slideshowInterval) {
clearInterval(slideshowInterval);
slideshowInterval = null;
} else {
slideshowInterval = setInterval(showSlides, 5000);
}
}

function showSlides(n) {
if (n === undefined) {
slideIndex++;
} else {
slideIndex = n;
}
if (slideIndex > slides.length) {
slideIndex = 1;
}
if (slideIndex < 1) {
slideIndex = slides.length;
}
for (let i = 0; i < slides.length; i++) {
slides[i].style.display = "none";
dots[i].className = dots[i].className.replace(" active", "");
}
slides[slideIndex - 1].style.display = "block";
dots[slideIndex - 1].className += " active";
}



// Función para manejar el menú de hamburguesas
function handleBurgerMenu(cheeseburger, NavList) {
  cheeseburger.addEventListener("click", () => {
    cheeseburger.classList.toggle("active");
    NavList.classList.toggle("active");
  });

  document.querySelectorAll(".Top-Options").forEach(n => n.addEventListener("click", () => {
    cheeseburger.classList.remove("active");
    //NavList.classList.remove("active");
  }));
}

// cheeseburger
const cheeseburger = document.querySelector(".cheeseburger");
const NavList = document.querySelector(".Nav-list");
handleBurgerMenu(cheeseburger, NavList);

// cheeseburger-Racimos
//const cheeseburgerR = document.querySelector(".cheeseburger-Racimos");
//const NavListR = document.querySelector(".Nav-list-Racimos");
//handleBurgerMenu(cheeseburgerR, NavListR);






// Random Background header 1
window.onload = function() {
  // Random Background header 1
  var randomBG = document.getElementsByClassName("fancy-header")[0];
  //var images = ['sources/home-img-purple.png', 'sources/beaver.jpg', 'sources/web-vid1.gif', 'sources/home-img-green.png'];
  var images = ['games/dark-light/DL-TRAILER.gif'];
  var imgCount = images.length;
  var number = Math.floor(Math.random() * imgCount);
  randomBG.style.backgroundImage = 'url(' + images[number] + ')';
};



// ANIMATION
const observer = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    if (entry.isIntersecting){
      entry.target.classList.add('show');
    } else {
      entry.target.classList.remove('show');
    }
  });
});

const hiddenElements = document.querySelectorAll('.members');
hiddenElements.forEach((el)=>observer.observe(el));


//document.body.onscroll



// Gallery

document.querySelectorAll('.gallery-image img').forEach(image =>
  {
      image.onclick = () =>
      {
          document.querySelector('.gallery-popup').style.display = 'block';
          document.querySelector('.gallery-popup img').src = image.getAttribute('src');
      }
  });
  
  document.querySelector('.gallery-popup span').onclick = () =>
  {
      document.querySelector('.gallery-popup').style.display = 'none';    
  }
  
  document.querySelector('.gallery-popup').onclick = () =>
  {
      document.querySelector('.gallery-popup').style.display = 'none';    
  }
