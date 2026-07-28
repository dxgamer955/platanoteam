(()=>{
  document.body.classList.add('synthwave-site');
  const scriptSrc=document.currentScript?.src||location.href;
  const modelUrl=new URL('sources/3d/platano-lowpoly.glb',scriptSrc).href;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero=document.querySelector('.archive-hero,.games-hero,.projects-hero,.gallery-hero,.about-hero,.history-hero,.ds-hero');
  if(hero){
    const stage=document.createElement('div');stage.className='synth-stage';stage.setAttribute('aria-hidden','true');
    stage.innerHTML='<svg class="synth-mountains" viewBox="0 0 1200 240" preserveAspectRatio="none"><path class="back" d="M0 220 120 122 210 174 340 72 455 169 585 105 700 175 830 58 950 164 1060 104 1200 220Z"/><path class="front" d="M0 220 165 145 275 205 430 119 570 208 755 132 910 204 1055 137 1200 220Z"/></svg>';
    hero.prepend(stage);
    const hud=document.createElement('div');hud.className='synth-hud';hud.setAttribute('aria-hidden','true');hud.innerHTML='<span>PLAYER 01</span><span>HIGH SCORE 2015</span><span>STAGE PR</span>';hero.prepend(hud);
    if(document.body.classList.contains('archive-home')){
      const canvas=document.createElement('canvas');canvas.className='synth-banana';canvas.width=900;canvas.height=650;canvas.dataset.model=modelUrl;canvas.setAttribute('aria-hidden','true');hero.prepend(canvas);renderBanana(canvas);
    }
    if(document.body.matches('.page-history,.page-projects,.page-ds')){
      const canvas=document.createElement('canvas');canvas.className='hero-side-banana';canvas.width=560;canvas.height=420;canvas.dataset.model=modelUrl;canvas.setAttribute('aria-hidden','true');hero.prepend(canvas);renderBanana(canvas);
    }
    if(!reduced)hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();hero.style.setProperty('--pt-x',((e.clientX-r.left)/r.width-.5).toFixed(3));hero.style.setProperty('--pt-y',((e.clientY-r.top)/r.height-.5).toFixed(3))},{passive:true});
  }
  const footer=document.querySelector('footer');
  if(footer){
    const canvas=document.createElement('canvas');canvas.className='footer-banana';canvas.width=300;canvas.height=210;canvas.dataset.model=modelUrl;canvas.setAttribute('aria-hidden','true');footer.append(canvas);renderBanana(canvas);
  }
  function proceduralMesh(){
    const rings=12,sides=8,R=1.55,P=[],I=[];
    for(let i=0;i<rings;i++){const u=i/(rings-1),th=(205+130*u)*Math.PI/180,cx=R*Math.cos(th),cy=R*Math.sin(th)+1.1,taper=Math.pow(Math.sin(Math.PI*u),.45),radius=.12+.34*taper;
      for(let j=0;j<sides;j++){const ph=2*Math.PI*j/sides,n=Math.cos(ph);P.push(cx+radius*n*Math.cos(th),cy+radius*n*Math.sin(th),radius*Math.sin(ph))}}
    for(let i=0;i<rings-1;i++)for(let j=0;j<sides;j++){const a=i*sides+j,b=i*sides+(j+1)%sides,c=(i+1)*sides+j,d=(i+1)*sides+(j+1)%sides;I.push(a,c,b,b,c,d)}
    return{P:new Float32Array(P),I:new Uint16Array(I)};
  }
  async function loadMesh(url){
    try{const raw=await fetch(url).then(r=>{if(!r.ok)throw Error(r.status);return r.arrayBuffer()}),dv=new DataView(raw),jl=dv.getUint32(12,true),json=JSON.parse(new TextDecoder().decode(new Uint8Array(raw,20,jl)).trim()),bin=raw.slice(28+jl);
      const access=n=>{const a=json.accessors[n],v=json.bufferViews[a.bufferView],off=(v.byteOffset||0)+(a.byteOffset||0),T=a.componentType===5123?Uint16Array:Float32Array,K=a.type==='VEC3'?3:1;return new T(bin,off,a.count*K)};return{P:access(0),I:access(2)}
    }catch(e){return proceduralMesh()}
  }
  async function renderBanana(c){
    if(reduced){c.hidden=true;return}
    const {P,I}=await loadMesh(c.dataset.model),x=c.getContext("2d"),side=c.classList.contains("hero-side-banana"),footer=c.classList.contains("footer-banana"),compact=side||footer,lab=side&&document.body.classList.contains("page-projects"),history=side&&document.body.classList.contains("page-history"),ds=side&&document.body.classList.contains("page-ds"),projection=footer?430:lab?560:history?780:ds?650:side?350:650;
    const frameBudget=(compact||matchMedia("(max-width:800px)").matches)?(1000/30-1):1000/60;
    let t=.5,last=0,raf=0,visible=false,running=false,observer;
    function stop(){running=false;last=0;if(raf){cancelAnimationFrame(raf);raf=0}}
    function start(){if(running||!visible||document.hidden||!c.isConnected)return;running=true;last=0;raf=requestAnimationFrame(frame)}
    function frame(ms){
      if(!running||!c.isConnected||document.hidden||!visible){stop();return}
      if(last&&ms-last<frameBudget){raf=requestAnimationFrame(frame);return}
      const delta=last?Math.min(ms-last,80):0;last=ms;t+=delta*(compact?0.00058:0.00042);x.clearRect(0,0,c.width,c.height);const pts=[];
      for(let i=0;i<P.length;i+=3){let a=P[i],b=P[i+1],d=P[i+2],cy=Math.cos(t),sy=Math.sin(t),cx=Math.cos(compact?-.18:-.28),sx=Math.sin(compact?-.18:-.28),xx=a*cy+d*sy,zz=-a*sy+d*cy,yy=b*cx-zz*sx;zz=b*sx+zz*cx;const q=projection/(4.8-zz);pts.push({x:c.width/2+xx*q,y:c.height/2-yy*q,z:zz})}
      const faces=[];for(let i=0;i<I.length;i+=3){const a=pts[I[i]],b=pts[I[i+1]],d=pts[I[i+2]],z=(a.z+b.z+d.z)/3,cross=(b.x-a.x)*(d.y-a.y)-(b.y-a.y)*(d.x-a.x);faces.push({a,b,d,z,cross})}
      faces.sort((a,b)=>a.z-b.z).forEach(f=>{x.beginPath();x.moveTo(f.a.x,f.a.y);x.lineTo(f.b.x,f.b.y);x.lineTo(f.d.x,f.d.y);x.closePath();x.globalAlpha=Math.max(.2,Math.min(.96,.48+f.z*.16));x.strokeStyle="#53f27a";x.lineWidth=compact?(f.cross<0?.72:1.35):(f.cross<0?1.35:2.7);x.shadowColor="#48cf61";x.shadowBlur=compact?(f.cross<0?3:8):(f.cross<0?5:14);x.stroke();x.shadowBlur=0;x.globalAlpha=1});
      raf=requestAnimationFrame(frame)
    }
    document.addEventListener("visibilitychange",()=>document.hidden?stop():start());
    if("IntersectionObserver" in window){observer=new IntersectionObserver(entries=>{visible=Boolean(entries[0]&&entries[0].isIntersecting);visible?start():stop()},{rootMargin:"160px 0px"});observer.observe(c)}else{visible=true;start()}
  }
})();
