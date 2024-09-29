  // ANIMATION ON HOME
const observerC = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
      entry.target.classList.toggle('attack', entry.isIntersecting);
  });
});

const AttackElement = document.querySelectorAll('.jumpscare');
AttackElement.forEach((Move)=>observerC.observe(Move));

/*


  // ANIMATION ON HOME
const observerC = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    const isAttacking = entry.isIntersecting;
    entry.target.classList.toggle('attack', isAttacking);

    // audio play
    if (isAttacking){
      playMusic();
    }

  });
});

const AttackElement = document.querySelectorAll('.jumpscare');
AttackElement.forEach((Move)=>observerC.observe(Move));



    // Audio
    let play = document.getElementByClassName(".jumpscare");
    
    
    function playMusic(){
      let audio = new Audio("others/rommy.mp3");
      audio.play();
    }
  



*/