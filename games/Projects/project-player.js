addEventListener('load',()=>{
  const player=document.getElementById('player');
  if(!player)return;

  if(player.shadowRoot){
    const verticalStyle=document.createElement('style');
    verticalStyle.textContent='#player{display:flex;flex-direction:column;width:256px}canvas{display:block;width:256px;height:192px}';
    player.shadowRoot.appendChild(verticalStyle);
  }

  if(player.dataset.rom)player.loadURL(player.dataset.rom);
});
