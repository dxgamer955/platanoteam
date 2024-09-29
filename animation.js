  // ANIMATION ON HOME
const observerB = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
      entry.target.classList.toggle('move', entry.isIntersecting);
  });
});

const MoveElements = document.querySelectorAll('.prueba, .imgs-img-M, .imgs-img-M2, .gallery-image, .gallery-container, .game-image');
MoveElements.forEach((Move)=>observerB.observe(Move));
