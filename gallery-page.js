const items=[...document.querySelectorAll('.gallery-item')];
const lightbox=document.querySelector('.lightbox');
const lightboxImage=lightbox.querySelector('img');
const caption=lightbox.querySelector('figcaption');
let current=0;
function show(index){current=(index+items.length)%items.length;const source=items[current].querySelector('img');lightboxImage.src=source.src;lightboxImage.alt=source.alt;caption.textContent=items[current].dataset.title;lightbox.hidden=false;document.body.classList.add('lightbox-open');lightbox.querySelector('.lightbox-close').focus()}
function close(){lightbox.hidden=true;document.body.classList.remove('lightbox-open');items[current].focus()}
items.forEach((item,index)=>item.addEventListener('click',()=>show(index)));
lightbox.querySelector('.lightbox-close').addEventListener('click',close);
lightbox.querySelector('.prev').addEventListener('click',()=>show(current-1));
lightbox.querySelector('.next').addEventListener('click',()=>show(current+1));
lightbox.addEventListener('click',event=>{if(event.target===lightbox)close()});
addEventListener('keydown',event=>{if(lightbox.hidden)return;if(event.key==='Escape')close();if(event.key==='ArrowLeft')show(current-1);if(event.key==='ArrowRight')show(current+1)});
