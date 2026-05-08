const pageAudio = document.querySelector(".page-audio");
const pageVideo = document.querySelector(".hero-video");
const oldSoundButton = document.querySelector("[data-sound]");
let soundChoice = localStorage.getItem("sound-choice");
let soundAllowed = soundChoice === "yes";

if (oldSoundButton) {
  oldSoundButton.remove();
}

function playPageMedia() {
  const jobs = [];

  if (pageAudio) {
    pageAudio.muted = !soundAllowed;
    jobs.push(pageAudio.play());
  }

  if (pageVideo) {
    jobs.push(pageVideo.play());
  }

  return Promise.allSettled(jobs);
}

function updateMuteButton(button) {
  if (!button) return;
  const muted = pageAudio ? pageAudio.muted : pageVideo?.muted;
  button.textContent = muted ? "unmute" : "mute";
}

if (pageAudio || pageVideo) {
  const mediaBar = document.createElement("div");
  mediaBar.className = "media-bar";

  const muteButton = document.createElement("button");
  muteButton.className = "btn btn-small";
  muteButton.type = "button";

  mediaBar.append(muteButton);
  document.body.prepend(mediaBar);

  muteButton.addEventListener("click", () => {
    soundAllowed = pageAudio ? pageAudio.muted : pageVideo?.muted;
    soundChoice = soundAllowed ? "yes" : "no";
    localStorage.setItem("sound-choice", soundChoice);

    if (pageAudio) {
      pageAudio.muted = !soundAllowed;
    }

    if (pageVideo && !pageAudio) {
      pageVideo.muted = !soundAllowed;
    }

    playPageMedia();
    updateMuteButton(muteButton);
  });

  playPageMedia().then(() => updateMuteButton(muteButton));

  if (!soundChoice && pageAudio) {
    const disclaimer = document.createElement("div");
    disclaimer.className = "sound-disclaimer";
    disclaimer.innerHTML = `
      <div class="sound-box">
        <p>Wear earphones?</p>
        <button class="btn btn-primary" type="button">start</button>
        <button class="btn btn-soft" type="button">silent</button>
      </div>
    `;

    document.body.append(disclaimer);

    const [startButton, silentButton] = disclaimer.querySelectorAll("button");

    startButton.addEventListener("click", () => {
      soundAllowed = true;
      soundChoice = "yes";
      localStorage.setItem("sound-choice", soundChoice);
      pageAudio.muted = false;
      playPageMedia();
      updateMuteButton(muteButton);
      disclaimer.remove();
    });

    silentButton.addEventListener("click", () => {
      soundAllowed = false;
      soundChoice = "no";
      localStorage.setItem("sound-choice", soundChoice);
      pageAudio.muted = true;
      playPageMedia();
      updateMuteButton(muteButton);
      disclaimer.remove();
    });
  }
}

document.querySelectorAll("[data-dodge]").forEach((button) => {
  let taps = 0;
  const messages = ["sure?", "last chance", "okay fine"];
  const fallback = button.dataset.fallback;

  button.addEventListener("click", () => {
    taps += 1;

    if (taps >= messages.length && fallback) {
      window.location.href = fallback;
      return;
    }

    button.textContent = messages[Math.min(taps - 1, messages.length - 1)];
  });
});

const dateInput = document.querySelector('input[type="date"]');

if (dateInput) {
  dateInput.min = new Date().toISOString().split("T")[0];
}

const dateForm = document.querySelector("[data-date-form]");

if (dateForm) {
  const status = dateForm.querySelector(".form-status");

  dateForm.addEventListener("submit", () => {
    status.textContent = "sending...";
  });
}
