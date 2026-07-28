const header=document.querySelector('.dl-header');
const menuButton=document.querySelector('.dl-menu');
const links=document.querySelector('.dl-nav ul');
const updateHeader=()=>header.classList.toggle('scrolled',scrollY>24);
menuButton.addEventListener('click',()=>{const open=links.classList.toggle('open');menuButton.classList.toggle('open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close menu':'Open menu')});
links.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{links.classList.remove('open');menuButton.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));
document.getElementById('dl-year').textContent=new Date().getFullYear();
updateHeader();addEventListener('scroll',updateHeader,{passive:true});

const characterDialog=document.querySelector('.character-dialog');
if(characterDialog){
  const portrait=characterDialog.querySelector('.spotlight-art img');
  const characterName=characterDialog.querySelector('.spotlight-name h2');
  document.querySelectorAll('.character-select').forEach(card=>card.addEventListener('click',()=>{
    characterName.textContent=card.dataset.characterName;
    portrait.src=card.dataset.characterImage;
    portrait.alt=card.dataset.characterName;
    characterDialog.dataset.theme=card.dataset.characterTheme;
    characterDialog.showModal();
  }));
}

const musicPlayer=document.querySelector('[data-player]');
if(musicPlayer){
  const audio=musicPlayer.querySelector('#dl-audio');
  const toggle=musicPlayer.querySelector('.player-toggle');
  const toggleIcon=toggle.querySelector('span');
  const mute=musicPlayer.querySelector('.player-mute');
  const title=musicPlayer.querySelector('.now-playing h3');
  const seek=musicPlayer.querySelector('.player-seek');
  const current=musicPlayer.querySelector('.player-current');
  const duration=musicPlayer.querySelector('.player-duration');
  const tracks=[...musicPlayer.querySelectorAll('.track')];
  const formatTime=value=>{
    if(!Number.isFinite(value)) return '0:00';
    const minutes=Math.floor(value/60);
    const seconds=Math.floor(value%60).toString().padStart(2,'0');
    return `${minutes}:${seconds}`;
  };
  const updatePlayState=()=>{
    const playing=!audio.paused;
    toggle.classList.toggle('playing',playing);
    toggleIcon.textContent=playing?'Ⅱ':'▶';
    toggle.setAttribute('aria-label',`${playing?'Pause':'Play'} ${title.textContent}`);
  };
  const selectTrack=(button,shouldPlay=true)=>{
    const changed=audio.getAttribute('src')!==button.dataset.src;
    tracks.forEach(track=>{
      const active=track===button;
      track.classList.toggle('active',active);
      track.querySelector('small').textContent=active?'Selected':'Play track';
    });
    title.textContent=button.dataset.title;
    if(changed){audio.src=button.dataset.src;audio.load();seek.value=0;current.textContent='0:00';duration.textContent='0:00'}
    if(shouldPlay) audio.play().catch(()=>updatePlayState());
    else updatePlayState();
  };
  toggle.addEventListener('click',()=>audio.paused?audio.play().catch(()=>updatePlayState()):audio.pause());
  tracks.forEach(track=>track.addEventListener('click',()=>selectTrack(track,true)));
  mute.addEventListener('click',()=>{
    audio.muted=!audio.muted;
    mute.classList.toggle('muted',audio.muted);
    mute.querySelector('span').textContent=audio.muted?'MUTED':'VOL';
    mute.setAttribute('aria-label',audio.muted?'Unmute audio':'Mute audio');
  });
  seek.addEventListener('input',()=>{if(Number.isFinite(audio.duration)) audio.currentTime=(Number(seek.value)/100)*audio.duration});
  audio.addEventListener('loadedmetadata',()=>duration.textContent=formatTime(audio.duration));
  audio.addEventListener('durationchange',()=>duration.textContent=formatTime(audio.duration));
  audio.addEventListener('timeupdate',()=>{
    current.textContent=formatTime(audio.currentTime);
    seek.value=Number.isFinite(audio.duration)&&audio.duration?String((audio.currentTime/audio.duration)*100):'0';
  });
  audio.addEventListener('play',updatePlayState);
  audio.addEventListener('pause',updatePlayState);
  audio.addEventListener('ended',()=>{
    const activeIndex=tracks.findIndex(track=>track.classList.contains('active'));
    const next=tracks[(activeIndex+1)%tracks.length];
    selectTrack(next,true);
  });
}
