const audio = document.getElementById("audio");
const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const trackTitle = document.getElementById("track-title");
const trackList = document.querySelectorAll(".track-list li");

let currentTrackIndex = 0;

function loadTrack(index) {
  const track = trackList[index];
  audio.src = track.getAttribute("data-src");
  trackTitle.textContent = track.textContent;
}

function playTrack() {
  audio.play();
}

function pauseTrack() {
  audio.pause();
}

function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % trackList.length;
  loadTrack(currentTrackIndex);
  playTrack();
}

function prevTrack() {
  currentTrackIndex =
    (currentTrackIndex - 1 + trackList.length) % trackList.length;
  loadTrack(currentTrackIndex);
  playTrack();
}

// Event listeners
playBtn.addEventListener("click", playTrack);
pauseBtn.addEventListener("click", pauseTrack);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

trackList.forEach((track, index) => {
  track.addEventListener("click", () => {
    currentTrackIndex = index;
    loadTrack(index);
    playTrack();
  });
});

// Load the first track by default
loadTrack(currentTrackIndex);
