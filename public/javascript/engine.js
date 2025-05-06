import { metadataRet } from "./server.js";
import { autoIdx, formation } from "./utils.js";

// Targeting elements for manipulation
const forMain = document.querySelector("#main-panel");
const forLite = document.querySelector("#lite-panel");
const forExtend = document.querySelector("#extend-panel");
const forSonic = document.querySelector("#sound-track");
const forMenu = document.querySelector("#menu-box");
const forScreen = document.querySelector("#screen");
const forIdata = document.querySelector("#info-data");
const forNite = document.querySelector("#next-lite");
const forNexo = document.querySelector("#next-extend");
const forDepth = document.querySelector("#depth");
const forNoDepth = document.querySelector("#no-depth");
const forInDet = document.querySelector("#detail-info");
const forText = document.querySelector("#screen-text");
const forInSeen = document.querySelector("#info-screen");

// Targeting elements for manipulation (batch)
const forFocus = document.querySelectorAll("#focus");
const forInfoBox = document.querySelectorAll("#info-box");
const forTrack = document.querySelectorAll("#track");
const forProg = document.querySelectorAll("#progress");
const forLicBox = document.querySelectorAll("#lyric-box");
const forSearch = document.querySelectorAll("#search input");
const forMotion = document.querySelectorAll("#motion-box");

// Targeting buttons for manipulation
const forSoundBtn = document.querySelector("[aria-label='sound']");
const forMenuBtn = document.querySelector("[aria-label='menu']");
const forExpBtn = document.querySelector("[aria-label='expand']");
const forColBtn = document.querySelector("[aria-label='collapse']");
const forPlayAllBtn = document.querySelector("[aria-label='play-all']");
const forNiteBtn = document.querySelector("[aria-label='next-lite']");
const forNexoBtn = document.querySelector("[aria-label='next-extend']");
const forInfoBtn = document.querySelector("[aria-label='info']");
const forLoad2Btn = document.querySelector("[aria-label='load-video']");
const forFunBtn = document.querySelector("[aria-label='fun']");

// Targeting buttons for manipulation (batch)
const forPlayBtns = document.querySelectorAll("[aria-label='play-pause']");
const forNextBtns = document.querySelectorAll("[aria-label='next']");
const forPrevBtns = document.querySelectorAll("[aria-label='previous']");
const forShulBtns = document.querySelectorAll("[aria-label='shuffle']");
const forReptBtns = document.querySelectorAll("[aria-label='repeat']");
const forLoad1Btns = document.querySelectorAll("[aria-label='load-audio']");
const forLyricBtns = document.querySelectorAll("[aria-label='lyric']");
const forSearchBtns = document.querySelectorAll("[aria-label='search']");
const forFavBtns = document.querySelectorAll("[aria-label='favorite']");

// Initial variable
let beta = [];
let batch = [];
let file = null;
let vfile = null;
let dataPath = null;
let audioPath = null;
let videoPath = null;
let alpha = {
  title: "Favorite Songs",
  target: "Gabriel Studio Playlist",
  status: "Verified Playlist",
  description:
    "This playlist is for saving only my favorite songs. It includes tracks that resonate with me emotionally, inspire creativity during studio sessions, and represent the music I enjoy the most across different genres and moods. From chill lo-fi beats and atmospheric instrumentals to powerful vocals and high-energy anthems, each song holds personal significance. This collection evolves over time as I discover new music that fuels my passion, helps me focus, or simply makes me feel alive.",
  picture: "./template.webp",
  content: [],
};

const forAudio = new Audio(); // Audio object
const pathway = ["/", "/folder", "/search"]; // Pathway object

// Function to handle storage changes
export const shift = () => {
  try {
    batch = Array.from(JSON.parse(localStorage.getItem("batch"))) || []; // Retrieve batch
    batch = batch.map((audio) => decodeURI(audio).replace(".mp3", "").trim()); // Decode batch

    const isAlpha = localStorage.getItem("favorite"); // Retrieve favorite
    if (isAlpha) alpha = JSON.parse(isAlpha); // Parsing alpha
    else localStorage.setItem("favorite", JSON.stringify(alpha)); // Store favorite in storage

    const isBeta = localStorage.getItem("bookmark"); // Retrieve bookmark
    if (isBeta) {
      beta = Array.from(JSON.parse(isBeta));
      beta = beta.filter((data) => data.title !== alpha.title); // Retrieve all data (except alpha)
      beta.unshift(alpha); // Insert alpha
      localStorage.setItem("bookmark", JSON.stringify(beta)); // Store beta in storage
    } else {
      beta.unshift(alpha); // Insert alpha
      localStorage.setItem("bookmark", JSON.stringify(beta)); // Store beta in storage
    }

    dataPath = localStorage.getItem("data-path") || null; // Retrieve data path
    audioPath = localStorage.getItem("audio-path") || null; // Retrieve audio path
    videoPath = localStorage.getItem("video-path") || null; // Retrieve video path
  } catch (error) {
    console.log(error);
  }
};

window.addEventListener("storage", shift); // Listen for storage changes

// Function to initialize audio process
export const audioInit = async (audio) => {
  try {
    if (!audio) return; // Validation check

    file = audio; // Set file
    const source = audioPath + audio + ".mp3"; // Source file

    if (forAudio.src !== source) {
      forAudio.src = source; // Set source
      forAudio.preload = "auto"; // Preload audio
      forAudio.load(); // Load audio
    }

    await forAudio.play(); // Play audio
    await updateUI(source); // Interface update
  } catch (error) {
    console.log(error);
  }
};

// Function to update interface and process
const updateUI = async (source) => {
  try {
    if (!forAudio.src) return; // Validation check

    // Elements interface (main, lite)
    forMain.classList.replace("lg:hidden", "lg:flex");
    forLite.classList.replace("hidden", "block");

    const metadata = await metadataRet(source); // Retrieve metadata

    // Retrieve data from metadata
    const picture = metadata.picture ?? "./template.webp";
    const title = metadata.title ?? "Not Available";
    const artist = metadata.artist ?? "Not Available";
    const composer = metadata.composer ?? "Not Available";
    const album = metadata.album ?? "Not Available";
    const artists = metadata.artists ?? "Not Available";
    const year = metadata.year ?? "Not Available";
    const language = metadata.language ?? "Not Available";
    const duration = metadata.duration ?? "Not Available";

    // Elements interface cover (focus, screen)
    forScreen.children[0].setAttribute("src", picture); // Set picture
    forFocus.forEach((target) => (target.children[0].src = picture)); // Set picture

    // Elements interface data (info box)
    forInfoBox.forEach((target) => {
      target.children[0].textContent = title; // Set title
      target.children[1].textContent = artist; // Set artist
    });

    // Comment retrieval
    const comment =
      typeof metadata.comment === "object"
        ? Object.values(metadata.comment)[0]
        : metadata.comment;

    // Lyric processing
    const lyric = String(comment || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Elements interface data (lyric box)
    forLicBox.forEach((target) => {
      target.children[0].textContent = title; // Set title
      target.children[1].textContent = artist; // Set artist

      const frag = document.createDocumentFragment();

      lyric.forEach((text) => {
        const temp = document.createElement("li"); // Create template
        temp.textContent = text; // Set text
        frag.appendChild(temp); // Append template to fragment
      });

      target.children[2].innerHTML = ""; // Clean element
      target.children[2].appendChild(frag); // Append fragment to element
    });

    // Elements interface data and cover (info data)
    forIdata.children[0].setAttribute("src", picture); // Set picture
    forIdata.children[1].textContent = title; // Set title
    forIdata.children[2].textContent = `Artist: ${artist}`; // Set artist
    forIdata.children[3].textContent = `Composer: ${composer}`; // Set composer
    forIdata.children[4].textContent = `Album: ${album}`; // Set album
    forIdata.children[5].textContent = `Album Artist: ${artists}`; // Set album artist
    forIdata.children[6].textContent = `Language: ${language}`; // Set language
    forIdata.children[7].textContent = `Year: ${year}`; // Set year
    forIdata.children[8].textContent = `Duration: ${formation(duration)}`; // Set duration

    // Buttons interface (favorite)
    forFavBtns.forEach((button) => {
      if (alpha.content.includes(file)) {
        button.children[0].style.display = "none"; // Active state
        button.children[1].style.display = "block";
      } else {
        button.children[0].style.display = "block"; // Inactive state
        button.children[1].style.display = "none";
      }
    });

    // Location based interface update (folder)
    if (location.pathname === "/folder") {
      // Elements interface (depth, no depth)
      forDepth.style.display = "block";
      forNoDepth.style.display = "none";

      // Elements interface data (screen text, detail info)
      forText.children[0].textContent = title; // Set title
      forText.children[1].textContent = artist; // Set artist
      forInDet.children[1].children[1].textContent = artist; // Set artist
      forInDet.children[1].children[3].textContent = composer; // Set composer
      forInDet.children[1].children[5].textContent = artists; // Set album artist

      vfile = "./database/video/Sawan Mein Lag Gayi Aag (Ginny Weds Sunny).mp4";

      if (vfile) {
        // Elements interface (info screen)
        forInSeen.children[0].style.display = "none";
        forInSeen.children[1].style.display = "block";
        forInSeen.children[1].setAttribute("src", vfile); // Set video
      } else {
        // Elements interface (info screen)
        forInSeen.children[1].style.display = "none";
        forInSeen.children[0].style.display = "block";
        forInSeen.children[0].setAttribute("src", picture); // Set picture
      }
    }

    // Width based interface update
    if (window.innerWidth > 1024) {
      await upcoming(forNite, file); // Upcoming for lite
    } else {
      await upcoming(forNexo, file, false); // Upcoming for extend
    }
  } catch (error) {
    console.log(error);
  }
};

// Function to update upcoming and process
const upcoming = async (target, audio, isFast = true) => {
  try {
    if (!target && !audio) return; // Validation check

    const index = batch.indexOf(audio) + 1; // Next index

    if (index < batch.length) {
      if (isFast) {
        // Elements interface (target)
        target.children[1].style.display = "flex";
        target.children[2].style.display = "none";

        const source = audioPath + batch[index] + ".mp3"; // Set source
        const metadata = await metadataRet(source); // Retrieve metadata

        // Retrieve data from metadata
        const title = metadata.title ?? "Not Available";
        const artist = metadata.artist ?? "Not Available";
        const picture = metadata.picture ?? "./template.webp";

        // Elements interface data and cover (template)
        const temp = target.children[1]; // Create template
        temp.children[0].setAttribute("src", picture); // Set picture
        temp.children[1].children[0].textContent = title; // Set title
        temp.children[1].children[1].textContent = artist; // Set artist
      } else {
        // Elements interface (target)
        target.children[1].style.display = "block";
        target.children[2].style.display = "none";

        // Retrieve content only 10 or length
        const content = batch
          .slice(index, index + 10)
          .map((audio) => audioPath + audio + ".mp3");

        const metadata = await Promise.all(
          content.map((source) => metadataRet(source))
        ); // Retrieve metadata

        const frag = document.createDocumentFragment();

        metadata.forEach((data) => {
          // Retrieve data from metadata
          const title = data.title ?? "Not Available";
          const artist = data.artist ?? "Not Available";
          const picture = data.picture ?? "./template.webp";

          const temp = target.children[1].children[0].cloneNode(true); // Clone template
          temp.children[0].setAttribute("src", picture); // Set picture
          temp.children[1].children[0].textContent = title; // Set title
          temp.children[1].children[1].textContent = artist; // Set artist

          frag.appendChild(temp); // Append template to fragment
        });

        target.children[1].innerHTML = ""; // Clean element
        target.children[1].appendChild(frag); // Append fragment to element
      }
    } else {
      if (isFast) {
        // Elements interface (target)
        target.children[1].style.display = "none";
        target.children[2].style.display = "block";
      } else {
        // Elements interface (target)
        target.children[1].style.display = "none";
        target.children[2].style.display = "block";
      }
    }
  } catch (error) {
    console.log(error);
  }
};

let playIdx = 0; // Initial state
let isPlaying = false; // Initial state

// Function to initiate playback
const starter = async () => {
  try {
    if (!batch && !Array.isArray(batch)) return; // Validation check
    else if (file) playIdx = batch.indexOf(file) + 1; // Next index
    else playIdx += 1; // Increment index

    if (playIdx < batch.length) {
      await audioInit(batch[playIdx]); // Initialize audio
    } else stopper(); // Terminate playback
  } catch (error) {
    console.log(error);
  }
};

// Function to initiate playback
const stopper = () => {
  try {
    if (forAudio.src) {
      forAudio.pause(); // Pause audio
      forAudio.currentTime = 0; // Reset current time
      if (vfile) forInSeen.children[1].currentTime = 0; // Reset current time
      forAudio.removeEventListener("ended", starter); // Eventlistener removed
    }

    playIdx = 0; // Reset index
    isPlaying = false; // Inactive state

    // Elements interface (play all, play pause)
    forPlayAllBtn.children[0].style.display = "block";
    forPlayAllBtn.children[1].style.display = "none";
    forPlayBtns.forEach((button) => {
      button.children[0].style.display = "block";
      button.children[1].style.display = "none";
    });
  } catch (error) {
    console.log(error);
  }
};

// Location based interface update (index, folder, search)
if (pathway.includes(location.pathname)) {
  try {
    // Interface update if audio play
    forAudio.addEventListener("playing", () => {
      forPlayBtns.forEach((button) => {
        button.children[0].style.display = "none";
        button.children[1].style.display = "block";
      });

      // Location based interface update (folder)
      if (location.pathname === "/folder" && vfile) {
        forInSeen.children[1].play(); // Play video
      }
    });

    // Interface update if audio pause
    forAudio.addEventListener("pause", () => {
      forPlayBtns.forEach((button) => {
        button.children[0].style.display = "block";
        button.children[1].style.display = "none";
      });

      // Location based interface update (folder)
      if (location.pathname === "/folder" && vfile) {
        forInSeen.children[1].pause(); // Pause video
      }
    });

    // Interface update if audio timeupdate
    forAudio.addEventListener("timeupdate", () => {
      const percent = (forAudio.currentTime / forAudio.duration) * 100; // Calculate percentage

      // Elements interface data (track)
      forTrack.forEach((target) => {
        target.children[0].textContent = formation(forAudio.currentTime); // Set current time
        target.children[2].textContent = formation(forAudio.duration); // Set duration
      });

      // Elements interface (progress)
      forProg.forEach((target) => {
        target.children[0].style.width = percent + "%";
        target.children[1].style.left = percent + "%";
      });
    });

    // Buttons functionality (play, pause)
    forPlayBtns.forEach((button) => {
      button.addEventListener("click", () => {
        if (!forAudio.src) return; // Validation check
        else if (forAudio.paused) forAudio.play(); // Play audio
        else forAudio.pause(); // Pause audio
      });
    });

    // Buttons functionality (previous)
    forPrevBtns.forEach((button) => {
      button.addEventListener("click", async () => {
        if (!forAudio.src) return; // Validation check

        const index = batch.indexOf(file) - 1; // Get previous index

        if (index >= 0) await audioInit(batch[index]); // Initialize audio
      });
    });

    // Buttons functionality (next)
    forNextBtns.forEach((button) => {
      button.addEventListener("click", async () => {
        if (!forAudio.src) return; // Validation check

        const index = batch.indexOf(file) + 1; // Get previous index

        if (index < batch.length) await audioInit(batch[index]); // Initialize audio
      });
    });

    // Buttons functionality (shuffle)
    forShulBtns.forEach((button) => {
      button.addEventListener("click", async () => {
        if (!forAudio.src) return; // Validation check

        await audioInit(autoIdx(batch)); // Initialize audio
      });
    });

    // Function to repeat audio
    const repeater = () => forAudio.play();

    // Buttons functionality (repeat)
    forReptBtns.forEach((button) => {
      button.dataset.repeat = "false"; // Initial state
      button.children[0].setAttribute("color", "#ffffff");

      button.addEventListener("click", () => {
        if (!forAudio.src) return; // Validation check

        if (button.dataset.repeat === "true") {
          button.dataset.repeat = "false"; // Inactive state

          button.children[0].setAttribute("color", "#ffffff");
          forAudio.removeEventListener("ended", repeater);

          if (isPlaying) forAudio.addEventListener("ended", starter); // Eventlistener added
        } else {
          button.dataset.repeat = "true"; // Active

          button.children[0].setAttribute("color", "#ed254e");
          forAudio.addEventListener("ended", repeater);

          if (isPlaying) forAudio.removeEventListener("ended", starter); // Eventlistener removed
        }
      });
    });

    // Buttons functionality (load audio)
    forLoad1Btns.forEach((button) => {
      button.addEventListener("click", () => {
        if (!forAudio.src) return; // Validation check

        const link = document.createElement("a"); // Create link
        link.href = forAudio.src; // Set source
        link.download = `Gabriel Studio - ${file}`; // Set download
        link.click(); // Trigger download
      });
    });

    // Buttons functionality (lyric)
    forLyricBtns.forEach((button) => {
      button.addEventListener("click", () => {
        if (!forAudio.src) return; // Validation check

        if (forLicBox[0].classList.contains("hidden")) {
          // Elements interface (lyric box)
          forLicBox.forEach((target) =>
            target.classList.replace("hidden", "block")
          );
          button.children[0].setAttribute("color", "#ed254e"); // Active state

          // Elements interface (next lite)
          forNite.classList.replace("block", "hidden");
          forNiteBtn.children[0].setAttribute("color", "#ffffff"); // Inactive state

          // Elements interface (info data)
          forIdata.classList.replace("block", "hidden");
          forInfoBtn.children[0].setAttribute("color", "#ffffff"); // Inactive state

          // Elements interface (next extend)
          forNexo.classList.replace("block", "hidden");
          forNexoBtn.children[0].setAttribute("color", "#ffffff"); // Inactive state
        } else {
          // Elements interface (lyric box)
          forLicBox.forEach((target) =>
            target.classList.replace("block", "hidden")
          );
          button.children[0].setAttribute("color", "#ffffff"); // Inactive state
        }
      });
    });

    // Buttons functionality (favorite)
    forFavBtns.forEach((button) => {
      button.addEventListener("click", () => {
        if (!forAudio.src) return; // Validation check
        else if (alpha.content.includes(file)) {
          const updateIdx = alpha.content.findIndex((data) => data === file);
          alpha.content.splice(updateIdx, 1); // Remove file in alpha

          forFavBtns.forEach((button) => {
            button.children[0].style.display = "block"; // Inactive
            button.children[1].style.display = "none";
          });
        } else {
          alpha.content.push(file); // Append file in alpha

          forFavBtns.forEach((button) => {
            button.children[0].style.display = "none"; // Active
            button.children[1].style.display = "block";
          });
        }

        localStorage.setItem("favorite", JSON.stringify(alpha)); // Store favorite in storage
        window.dispatchEvent(new Event("storage")); // Trigger storage event
      });
    });

    // Button functionality (next lite)
    forNiteBtn.addEventListener("click", () => {
      if (!forAudio.src) return; // Validation check
      else if (forNite.classList.contains("hidden")) {
        // Elements interface (next lite)
        forNite.classList.replace("hidden", "block");
        forNiteBtn.children[0].setAttribute("color", "#ed254e"); // Active state

        // Elements interface (info data)
        forIdata.classList.replace("block", "hidden");
        forInfoBtn.children[0].setAttribute("color", "#ffffff"); // Inactive state

        // Elements interface (lyric box)
        forLicBox.forEach((target) =>
          target.classList.replace("block", "hidden")
        );
        forLyricBtns.forEach((target) =>
          target.children[0].setAttribute("color", "#ffffff")
        ); // Inactive state
      } else {
        // Elements interface (next lite)
        forNite.classList.replace("block", "hidden");
        forNiteBtn.children[0].setAttribute("color", "#ffffff"); // Inactive state
      }
    });

    // Button functionality (info data)
    forInfoBtn.addEventListener("click", () => {
      if (!forAudio.src) return; // Validation check
      else if (forIdata.classList.contains("hidden")) {
        // Elements interface (info data)
        forIdata.classList.replace("hidden", "block");
        forInfoBtn.children[0].setAttribute("color", "#ed254e"); // Active state

        // Elements interface (next lite)
        forNite.classList.replace("block", "hidden");
        forNiteBtn.children[0].setAttribute("color", "#ffffff"); // Inactive state

        // Elements interface (lyric box)
        forLicBox.forEach((target) =>
          target.classList.replace("block", "hidden")
        );
        forLyricBtns.forEach((target) =>
          target.children[0].setAttribute("color", "#ffffff")
        ); // Inactive state
      } else {
        // Elements interface (info data)
        forIdata.classList.replace("block", "hidden");
        forInfoBtn.children[0].setAttribute("color", "#ffffff"); // Inactive state
      }
    });

    // Button functionality (next extend)
    forNexoBtn.addEventListener("click", () => {
      if (!forAudio.src) return; // Validation check
      else if (forNexo.classList.contains("hidden")) {
        // Elements interface (next extend)
        forNexo.classList.replace("hidden", "block");
        forNexoBtn.children[0].setAttribute("color", "#ed254e"); // Active state

        // Elements interface (lyric box)
        forLicBox.forEach((target) =>
          target.classList.replace("block", "hidden")
        );
        forLyricBtns.forEach((target) =>
          target.children[0].setAttribute("color", "#ffffff")
        ); // Inactive state
      } else {
        // Elements interface (next extend)
        forNexo.classList.replace("block", "hidden");
        forNexoBtn.children[0].setAttribute("color", "#ffffff"); // Inactive state
      }
    });

    // Button functionality (sound)
    forSoundBtn.addEventListener("click", () => {
      if (forAudio.volume > 0) {
        forAudio.volume = 0; // Muted
        forSoundBtn.children[0].style.display = "none";
        forSoundBtn.children[1].style.display = "block";

        forSonic.children[0].style.width = "0%";
        forSonic.children[1].style.left = "0%";
      } else {
        forAudio.volume = 1; // Unmuted
        forSoundBtn.children[0].style.display = "block";
        forSoundBtn.children[1].style.display = "none";

        forSonic.children[0].style.width = "100%";
        forSonic.children[1].style.left = "100%";
      }
    });

    // Button functionality (expand)
    forExpBtn.addEventListener("click", () => {
      forLite.classList.replace("block", "hidden");
      forExtend.classList.replace("hidden", "flex");
    });

    // Button functionality (collapse)
    forColBtn.addEventListener("click", () => {
      forLite.classList.replace("hidden", "block");
      forExtend.classList.replace("flex", "hidden");
    });

    // Elements interface touch event (progress)
    forProg.forEach((target) => {
      target.addEventListener("click", (event) => {
        if (!forAudio.src) return; // Validation check

        const range = event.currentTarget.getBoundingClientRect(); // Range check
        const click = event.clientX - range.left; // Calculate position
        const percent = Math.min(100, Math.max(0, (click / range.width) * 100)); // Calculate percent

        forAudio.currentTime = (percent / 100) * forAudio.duration; // Set current time

        // Location based interface update (folder)
        if (location.pathname === "/folder" && vfile) {
          const data = (percent / 100) * forInSeen.children[1].duration; // Set current time
          forInSeen.children[1].currentTime = data;
        }

        target.children[0].style.width = percent + "%";
        target.children[1].style.left = percent + "%";
      });
    });

    // Elements interface touch event (sound)
    forSonic.addEventListener("click", (event) => {
      const range = event.currentTarget.getBoundingClientRect(); // Range check
      const click = event.clientX - range.left; // Calculate position
      const percent = Math.min(100, Math.max(0, (click / range.width) * 100)); // Calculate percent

      forAudio.volume = percent / 100; // Set volume

      forSonic.children[0].style.width = percent + "%";
      forSonic.children[1].style.left = percent + "%";

      if (percent === 0) {
        forSoundBtn.children[0].style.display = "none";
        forSoundBtn.children[1].style.display = "block";
      } else {
        forSoundBtn.children[0].style.display = "block";
        forSoundBtn.children[1].style.display = "none";
      }
    });

    // Elements interface touch event (next lite)
    forNite.addEventListener("click", async (event) => {
      if (!forAudio.src) return; // Validation check

      const temp = event.target.closest("#card-lite"); // Get closest element
      const audio = temp.children[1].children[0].textContent.trim(); // Get audio title

      if (!audio) return; // Validation check

      await audioInit(audio); // Initialize audio
    });

    // Elements interface touch event (next extend)
    forNexo.addEventListener("click", async (event) => {
      if (!forAudio.src) return; // Validation check

      const temp = event.target.closest("li"); // Get closest element
      const audio = temp.children[1].children[0].textContent.trim(); // Get audio title

      if (!audio) return; // Validation check

      await audioInit(audio); // Initialize audio
    });
  } catch (error) {
    console.log(error);
  }
}

// Location based interface update (folder)
if (location.pathname === "/folder") {
  try {
    // Button functionality (play all)
    forPlayAllBtn.addEventListener("click", async () => {
      if (isPlaying) stopper(); // Terminate playback
      else {
        isPlaying = true; // Active state

        forAudio.addEventListener("ended", starter); // Eventlistener added
        await audioInit(batch[playIdx]); // Initialize audio

        // Elements interface (play all)
        forPlayAllBtn.children[0].style.display = "none";
        forPlayAllBtn.children[1].style.display = "block";
      }
    });

    // Button functionality (load video)
    forLoad2Btn.addEventListener("click", () => {
      if (!forAudio.src) return; // Validation check
      else if (vfile) {
        const link = document.createElement("a"); // Create link
        link.href = vfile; // Set source
        link.download = `Gabriel Studio - ${file}`; // Set download
        link.click(); // Trigger download
      } else {
        window.alert("Sorry, the video is not available for this content!");
      }
    });
  } catch (error) {
    console.log(error);
  }
}

// Interface functionalities (global)
try {
  // Button functionality (menu)
  forMenuBtn.addEventListener("click", () => {
    forMenu.classList.toggle("hidden");
    forMenuBtn.children[0].classList.toggle("hidden");
    forMenuBtn.children[1].classList.toggle("hidden");
  });

  // Button functionality (recommend)
  if (forFunBtn) {
    forFunBtn.addEventListener("click", () => {
      sessionStorage.setItem("query", ""); // Reset query in session storage
      window.location.href = "/search"; // Redirect to search page
    });
  }

  // Buttons functionality (search)
  forSearchBtns.forEach((button) => {
    button.addEventListener("click", () => {
      const target = Array.from(forSearch).find((input) => input.value.trim()); // Find input
      const query = target ? target.value.trim() : ""; // Get query

      sessionStorage.setItem("query", query); // Store query in session storage
      window.location.href = "/search"; // Redirect to search page
    });
  });

  // Element interface touch event (menu box)
  forMenu.children[3].addEventListener("click", () => {
    sessionStorage.setItem("query", ""); // Reset query in session storage
    window.location.href = "/search"; // Redirect to search page
  });

  // Element interface touch event (menu box)
  forMenu.children[0].addEventListener("click", () => {
    window.location.href = "/"; // Redirect to index page
  });

  // Elements interface data (motion box)
  forMotion.forEach((target) => {
    const text = [
      "Initializing request...",
      "Searching indexed data...",
      "Contacting server nodes...",
      "Compiling relevant records...",
      "Analyzing query parameters...",
      "Processing data stream...",
      "Verifying response integrity...",
      "Filtering and organizing results...",
      "Preparing display output...",
      "Stand by, results incoming...",
    ];

    let index = 0; // Initial index
    target.children[1].textContent = text[index]; // Set text

    setInterval(() => {
      if (target.style.display !== "none") {
        index = (index + 1) % text.length; // Increment index
        target.children[1].textContent = text[index]; // Set text
      } else return; // Terminate interval
    }, 1500);
  });
} catch (error) {
  console.log(error);
}
