const header = document.querySelector(".dl-header");
const menuButton = document.querySelector(".dl-menu");
const links = document.querySelector(".dl-nav ul");
const island = document.querySelector(".dl-hero");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const LOGICAL_SCENE_WIDTH = 288;
const LOGICAL_SCENE_HEIGHT = 162;

if (menuButton && links) {
  menuButton.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    menuButton.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      menuButton.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open menu");
    });
  });
}

if (header) {
  const updateHeader = () => header.classList.toggle("scrolled", scrollY > 24);
  updateHeader();
  addEventListener("scroll", updateHeader, { passive: true });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: .1 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const year = document.getElementById("dl-year");
if (year) year.textContent = new Date().getFullYear();

const getScenePixelScale = () => {
  const mobile = window.innerWidth <= 760;
  const desiredWidth = mobile
    ? window.innerWidth * 1.55
    : Math.min(window.innerWidth * .76, 1500);
  const heightLimit = mobile
    ? Number.POSITIVE_INFINITY
    : Math.max(1, window.innerHeight - 76) * (LOGICAL_SCENE_WIDTH / LOGICAL_SCENE_HEIGHT);
  const availableWidth = Math.min(desiredWidth, heightLimit);
  return Math.max(2, Math.round(availableWidth / LOGICAL_SCENE_WIDTH));
};

const starField = document.querySelector(".pixel-stars");
if (starField) {
  let starResizeTimer;

  const buildPixelStars = () => {
    const starPixel = getScenePixelScale();
    const columns = Math.ceil(window.innerWidth / starPixel);
    const rows = Math.ceil(window.innerHeight / starPixel);
    const firstRow = Math.ceil(88 / starPixel);
    const minimumDistance = Math.max(5, Math.ceil(40 / starPixel));
    const desiredCount = Math.max(32, Math.min(68, Math.round((window.innerWidth * window.innerHeight) / 30000)));
    const positions = [];
    const fragment = document.createDocumentFragment();
    const colors = ["#ffffff", "#a9c3ff", "#6678d9", "#d9e5ff"];
    let seed = (columns * 73856093) ^ (rows * 19349663) ^ 0x5f3759df;
    let attempts = 0;

    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    while (positions.length < desiredCount && attempts < desiredCount * 80) {
      attempts += 1;
      const x = 2 + Math.floor(random() * Math.max(1, columns - 5));
      const y = firstRow + 2 + Math.floor(random() * Math.max(1, rows - firstRow - 5));
      const clear = positions.every((position) => {
        const dx = position.x - x;
        const dy = position.y - y;
        return dx * dx + dy * dy >= minimumDistance * minimumDistance;
      });

      if (!clear) continue;
      positions.push({ x, y });

      const star = document.createElement("span");
      const shapeRoll = random();
      if (shapeRoll > .93) star.classList.add("cross");
      else if (shapeRoll > .79) star.classList.add("pair");
      star.classList.add("pixel-star");
      star.style.setProperty("--star-x", `${x * starPixel}px`);
      star.style.setProperty("--star-y", `${y * starPixel}px`);
      star.style.setProperty("--star-color", colors[Math.floor(random() * colors.length)]);
      star.style.setProperty("--star-opacity", (.38 + random() * .55).toFixed(2));
      star.style.setProperty("--star-duration", `${4 + Math.floor(random() * 7)}s`);
      star.style.setProperty("--star-delay", `${(-random() * 8).toFixed(2)}s`);
      fragment.appendChild(star);
    }

    starField.style.setProperty("--scene-pixel", `${starPixel}px`);
    starField.replaceChildren(fragment);
  };

  buildPixelStars();
  addEventListener("resize", () => {
    clearTimeout(starResizeTimer);
    starResizeTimer = setTimeout(buildPixelStars, 160);
  }, { passive: true });
}

if (island) {
  const livingLayers = [
    { element: island.querySelector(".moon"), pointerX: -1, pointerY: -.7, idleX: .7, idleY: .5, period: 9400, phase: .2 },
    { element: island.querySelector(".castle"), pointerX: -2, pointerY: -1.2, idleX: 1.1, idleY: .8, period: 8200, phase: 1.1 },
    { element: island.querySelector(".trees-back"), pointerX: -3, pointerY: -1.7, idleX: 1.5, idleY: 1, period: 7600, phase: 2.2 },
    { element: island.querySelector(".cliff"), pointerX: -4, pointerY: -2.2, idleX: 2, idleY: 1.2, period: 6900, phase: 3.4 },
    { element: island.querySelector(".john"), pointerX: -5, pointerY: -2.7, idleX: 2.2, idleY: .9, period: 6400, phase: 4.1 }
  ].filter((layer) => layer.element);
  let pixelScale = 1;

  const syncSceneScale = () => {
    pixelScale = getScenePixelScale();
    const sceneWidth = LOGICAL_SCENE_WIDTH * pixelScale;
    const sceneHeight = LOGICAL_SCENE_HEIGHT * pixelScale;
    island.dataset.pixelScale = String(pixelScale);

    livingLayers.forEach((layer) => {
      layer.element.style.width = `${sceneWidth}px`;
      layer.element.style.height = `${sceneHeight}px`;
    });
  };

  syncSceneScale();
  addEventListener("resize", syncSceneScale, { passive: true });

  if (!reduceMotion.matches) {
    let pointerTargetX = 0;
    let pointerTargetY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let lastPointerMove = 0;

    island.addEventListener("pointermove", (event) => {
      pointerTargetX = (event.clientX / window.innerWidth - .5) * 2;
      pointerTargetY = (event.clientY / window.innerHeight - .5) * 2;
      lastPointerMove = performance.now();
    });

    island.addEventListener("pointerleave", () => {
      pointerTargetX = 0;
      pointerTargetY = 0;
    });

    const animateLivingScene = (time) => {
      if (time - lastPointerMove > 900) {
        pointerTargetX *= .965;
        pointerTargetY *= .965;
      }

      pointerX += (pointerTargetX - pointerX) * .045;
      pointerY += (pointerTargetY - pointerY) * .045;

      livingLayers.forEach((layer) => {
        const primaryWave = time / layer.period + layer.phase;
        const secondaryWave = time / (layer.period * 1.73) + layer.phase * .6;
        const idleX = Math.sin(primaryWave) * layer.idleX +
          Math.sin(secondaryWave) * layer.idleX * .3;
        const idleY = Math.cos(primaryWave * .82) * layer.idleY +
          Math.sin(secondaryWave * 1.2) * layer.idleY * .25;
        const logicalX = Math.round(pointerX * layer.pointerX + idleX);
        const logicalY = Math.round(pointerY * layer.pointerY + idleY);
        const x = logicalX * pixelScale;
        const y = logicalY * pixelScale;

        layer.element.style.setProperty("--px", `${x}px`);
        layer.element.style.setProperty("--py", `${y}px`);
      });

      requestAnimationFrame(animateLivingScene);
    };

    requestAnimationFrame(animateLivingScene);
  }
}

const trailer = document.querySelector("[data-trailer]");
if (trailer) {
  const playTrailer = trailer.querySelector(".trailer-play");
  const trailerMedia = trailer.querySelector(".trailer-media");

  playTrailer.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube.com/embed/GKxuPGD6U3o?autoplay=1&playsinline=1";
    iframe.title = "Dark Light official trailer on YouTube";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    trailerMedia.replaceChildren(iframe);
  }, { once: true });
}

const characterDialog = document.querySelector(".character-dialog");
if (characterDialog) {
  const characterProfiles = {
    john: {
      intro: "Meet John",
      name: "John Sánchez",
      epithet: "Every journey begins with a single unanswered question.",
      summary: "John Sánchez never imagined that returning to Terra Custodes would change his life forever. What begins as an ordinary night soon turns into a journey filled with forgotten legends, impossible encounters and mysteries hidden beneath the island's history.",
      facts: [
        ["Role", "Protagonist"],
        ["Current location", "Terra Custodes"],
        ["Public Profile", "A young magician whose ordinary life ends the night lightning strikes near his home."]
      ],
      traits: ["Curious", "Compassionate", "Determined"],
      noteLabel: "A little about John",
      note: "John believes every person deserves a second chance, even when the truth says otherwise."
    },
    cleo: {
      intro: "Meet Cleo",
      name: "Cleo Nesiha",
      epithet: "The guardian whose silence speaks louder than words.",
      summary: "Few people dare to approach the forgotten ruins where Cleo resides. Calm, composed and impossible to intimidate, she watches every visitor with the confidence of someone who has witnessed centuries of history.",
      facts: [
        ["Species", "Human"],
        ["Origin", "Great Pyramid, Terra Custodes"],
        ["Public Profile", "A mysterious woman who watches over forgotten ruins deep within the desert."]
      ],
      traits: ["Fearless", "Observant", "Noble"],
      noteLabel: "Extra note",
      note: "Some legends are not forgotten. They are simply waiting for someone worthy to uncover them."
    },
    clare: {
      intro: "Meet Clare",
      name: "Clare Moreau",
      epithet: "Not every lonely soul wishes to be found.",
      summary: "Hidden far from civilization, Clare has chosen a life of solitude. Behind her quiet smile lies a story few have ever heard, and fewer still have taken the time to understand.",
      facts: [
        ["Species", "Ghost"],
        ["Origin", "Abandoned Mansion, Terra Custodes"],
        ["Public Profile", "A quiet soul who prefers the company of silence over the noise of the outside world."]
      ],
      traits: ["Shy", "Curious", "Gentle"],
      noteLabel: "Extra note",
      note: "Sometimes the scariest place is also the loneliest."
    },
    claudia: {
      intro: "Meet Claudia",
      name: "Claudia Rodríguez",
      epithet: "Even the brightest smile can hide the deepest scars.",
      summary: "Claudia's cheerful performances have made her a familiar face to many, but few know the story hidden behind her smile. Beneath the colorful costumes lies a young woman who refuses to give up, no matter how difficult life becomes.",
      facts: [
        ["Species", "Human"],
        ["Origin", "Circus, Terra Custodes"],
        ["Public Profile", "Claudia is a young circus performer whose colorful personality has made her one of the island's most recognizable faces. Behind every performance lies an unwavering determination to keep smiling, even when life refuses to make it easy."]
      ],
      traits: ["Optimistic", "Determined", "Kind-hearted"],
      noteLabel: "Extra note",
      note: "Not every performance happens on a stage."
    }
  };

  const portrait = characterDialog.querySelector(".spotlight-art > img");
  const characterName = characterDialog.querySelector("#selected-character-name");
  const intro = characterDialog.querySelector(".profile-intro");
  const epithet = characterDialog.querySelector(".profile-epithet");
  const summary = characterDialog.querySelector(".profile-summary");
  const facts = characterDialog.querySelector(".profile-facts");
  const traits = characterDialog.querySelector(".profile-traits");
  const noteLabel = characterDialog.querySelector(".profile-note span");
  const note = characterDialog.querySelector(".profile-note p");

  const characterCards = [...document.querySelectorAll(".character-select")];
  characterCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (!window.matchMedia("(pointer: fine)").matches) return;

      const bounds = card.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
      const y = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
      card.style.setProperty("--card-tilt-x", `${x * 2.6}deg`);
      card.style.setProperty("--card-tilt-y", `${y * -2.2}deg`);
      card.style.setProperty("--portrait-shift-x", `${x * 8}px`);
      card.style.setProperty("--portrait-shift-y", `${y * 5}px`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--card-tilt-x");
      card.style.removeProperty("--card-tilt-y");
      card.style.removeProperty("--portrait-shift-x");
      card.style.removeProperty("--portrait-shift-y");
    });

    card.addEventListener("click", () => {
      const profile = characterProfiles[card.dataset.characterTheme];

      intro.textContent = profile.intro;
      characterName.textContent = profile.name;
      epithet.textContent = profile.epithet;
      summary.textContent = profile.summary;
      facts.replaceChildren(...profile.facts.map(([label, value]) => {
        const row = document.createElement("div");
        const term = document.createElement("dt");
        const description = document.createElement("dd");
        term.textContent = label;
        description.textContent = value;
        row.append(term, description);
        return row;
      }));
      traits.replaceChildren(...profile.traits.map((trait) => {
        const item = document.createElement("li");
        item.textContent = trait;
        return item;
      }));
      noteLabel.textContent = profile.noteLabel;
      note.textContent = profile.note;
      portrait.src = card.dataset.characterImage;
      portrait.alt = profile.name;
      characterDialog.dataset.theme = card.dataset.characterTheme;
      characterDialog.showModal();
      requestAnimationFrame(() => characterDialog.scrollTo({ top: 0, left: 0 }));
    });
  });

  const requestedProfile = new URLSearchParams(window.location.search).get("character");
  const requestedCard = characterCards.find((card) => card.dataset.characterTheme === requestedProfile);
  if (requestedCard) requestedCard.click();
}

const requestedSection = new URLSearchParams(window.location.search).get("section");
const sectionTarget = requestedSection ? document.getElementById(requestedSection) : null;
if (sectionTarget) {
  sectionTarget.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
  requestAnimationFrame(() => sectionTarget.scrollIntoView({ block: "start" }));
}

const musicPlayer = document.querySelector("[data-player]");
if (musicPlayer) {
  const audio = musicPlayer.querySelector("#dl-audio");
  const toggle = musicPlayer.querySelector(".player-toggle");
  const toggleIcon = toggle.querySelector("span");
  const mute = musicPlayer.querySelector(".player-mute");
  const title = musicPlayer.querySelector(".now-playing h3");
  const seek = musicPlayer.querySelector(".player-seek");
  const current = musicPlayer.querySelector(".player-current");
  const duration = musicPlayer.querySelector(".player-duration");
  const tracks = [...musicPlayer.querySelectorAll(".track")];

  const formatTime = (value) => {
    if (!Number.isFinite(value)) return "0:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const updatePlayState = () => {
    const playing = !audio.paused;
    toggle.classList.toggle("playing", playing);
    toggleIcon.textContent = playing ? "II" : "\u25b6";
    toggle.setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${title.textContent}`);
  };

  const selectTrack = (button, shouldPlay = true) => {
    const changed = audio.getAttribute("src") !== button.dataset.src;
    tracks.forEach((track) => {
      const active = track === button;
      track.classList.toggle("active", active);
      track.querySelector("small").textContent = active ? "Selected" : "Play track";
    });

    title.textContent = button.dataset.title;
    if (changed) {
      audio.src = button.dataset.src;
      audio.load();
      seek.value = 0;
      current.textContent = "0:00";
      duration.textContent = "0:00";
    }

    if (shouldPlay) audio.play().catch(updatePlayState);
    else updatePlayState();
  };

  toggle.addEventListener("click", () => {
    if (audio.paused) audio.play().catch(updatePlayState);
    else audio.pause();
  });

  tracks.forEach((track) => {
    track.addEventListener("click", () => selectTrack(track, true));
  });

  mute.addEventListener("click", () => {
    audio.muted = !audio.muted;
    mute.classList.toggle("muted", audio.muted);
    mute.querySelector("span").textContent = audio.muted ? "MUTED" : "VOL";
    mute.setAttribute("aria-label", audio.muted ? "Unmute audio" : "Mute audio");
  });

  seek.addEventListener("input", () => {
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = (Number(seek.value) / 100) * audio.duration;
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
  });
  audio.addEventListener("durationchange", () => {
    duration.textContent = formatTime(audio.duration);
  });
  audio.addEventListener("timeupdate", () => {
    current.textContent = formatTime(audio.currentTime);
    seek.value = Number.isFinite(audio.duration) && audio.duration
      ? String((audio.currentTime / audio.duration) * 100)
      : "0";
  });
  audio.addEventListener("play", updatePlayState);
  audio.addEventListener("pause", updatePlayState);
  audio.addEventListener("ended", () => {
    const activeIndex = tracks.findIndex((track) => track.classList.contains("active"));
    const next = tracks[(activeIndex + 1) % tracks.length];
    selectTrack(next, true);
  });
}
