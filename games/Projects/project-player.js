addEventListener('load', async () => {
  const player = document.getElementById('player');
  if (!player) return;

  const note = player.closest('.emulator-column')?.querySelector('.emulator-note');

  if (player.shadowRoot) {
    const verticalStyle = document.createElement('style');
    verticalStyle.textContent = '#player{display:flex;flex-direction:column;width:256px}canvas{display:block;width:256px;height:192px}';
    player.shadowRoot.appendChild(verticalStyle);
  }

  if (!player.dataset.rom || typeof player.loadURL !== 'function') {
    if (note) {
      note.textContent = 'The emulator could not be initialized. Please reload the page.';
      note.classList.add('player-error');
    }
    return;
  }

  const mobileDevice = matchMedia('(pointer: coarse)').matches && innerWidth <= 1024;
  if (mobileDevice) {
    if (note) {
      note.textContent = 'Warning: The emulator does not work on mobile devices. Please use a desktop or laptop computer.';
      note.classList.add('player-error');
    }
    return;
  }

  if (location.protocol === 'file:') {
    if (note) {
      note.textContent = 'The game can only be loaded from the published website or through localhost.';
      note.classList.add('player-error');
    }
    return;
  }

  const romURL = new URL(player.dataset.rom, document.baseURI).href;

  try {
    const response = await fetch(romURL, { method: 'HEAD', cache: 'no-store' });
    if (!response.ok) throw new Error('ROM request failed with status ' + response.status);

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('ROM loading timed out')), 20000);
      try {
        player.loadURL(romURL, () => {
          clearTimeout(timeout);
          resolve();
        });
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  } catch (error) {
    console.error('Nintendo DS emulator:', error);
    if (note) {
      note.textContent = 'The game could not be loaded. Reload the page or try again from the published website.';
      note.classList.add('player-error');
    }
  }
});
