import { audioRet, fileRet, metadataRet } from "./server.js";
import { audioInit } from "./engine.js";
import { subset } from "./utils.js";

// Path declaration for data, audio and video
const dataPath = "./database/data/";
const audioPath = "./database/audio/";
const videoPath = "./database/video/";

// Store paths in storage
localStorage.setItem("data-path", dataPath);
localStorage.setItem("audio-path", audioPath);
localStorage.setItem("video-path", videoPath);

// Targeting elements for manipulation (batch)
const forPanel = document.querySelectorAll("#temp-box");
const forMotion = document.querySelectorAll("#motion-box");
const forTextBox = document.querySelectorAll("#text-box");

// Function to display audio
const fileBit = async (target, motion, batch) => {
  try {
    if (!target && !motion && !Array.isArray(batch)) return; // Validation check

    const frag = document.createDocumentFragment();
    const panel = target.children[0];

    const metadata = await Promise.all(
      batch.map((audio) => metadataRet(audioPath + audio))
    ); // Retrieve metadata

    metadata.forEach((data) => {
      // Retrieve data from metadata
      const title = data.title ?? "Not Available";
      const artist = data.artist ?? "Not Available";
      const picture = data.picture ?? "./template.webp";

      const temp = panel.children[0].cloneNode(true); // Clone template
      temp.children[0].setAttribute("src", picture); // Set picture
      temp.children[1].textContent = title; // Set title
      temp.children[2].textContent = artist; // Set artist
      temp.dataset.label = "audio"; // Set label

      frag.appendChild(temp); // Append template to fragment
    });

    panel.innerHTML = ""; // Clean element
    panel.appendChild(frag); // Append fragment to element

    target.style.display = "block"; // Show element
    motion.style.display = "none"; // Hide motion
  } catch (error) {
    console.log(error);
  }
};

// Function to handle audio touch event
const fileTouch = (target, batch) => {
  try {
    if (!target && !Array.isArray(batch)) return; // Validation check

    target.addEventListener("click", async (event) => {
      const temp = event.target.closest("li"); // Get closest element
      const audio = temp.children[1].textContent.trim(); // Get audio title

      if (!audio) return; // Validation check

      localStorage.setItem("batch", JSON.stringify(batch)); // Store batch in storage
      window.dispatchEvent(new Event("storage")); // Trigger storage event

      await audioInit(audio); // Initialize audio
    });
  } catch (error) {
    console.log(error);
  }
};

// Function to display artists, albums and playlists
const folBit = async (target, motion, file) => {
  try {
    if (!target && !motion && !file) return; // Validation check

    const frag = document.createDocumentFragment();
    const panel = target.children[0];

    const object = await fileRet(dataPath + file); // Retrieve object
    const keys = Object.keys(object); // Collect keys

    keys.slice(0, 20).forEach((key) => {
      // Retrieve data from metadata
      const title = object[key].title ?? "Not Available";
      const target = object[key].target ?? "Not Available";
      const picture = object[key].picture ?? "./template.webp";

      const temp = panel.children[0].cloneNode(true); // Clone template
      temp.children[0].setAttribute("src", picture); // Set picture
      temp.children[1].textContent = title; // Set title
      temp.children[2].textContent = target; // Set artist
      temp.dataset.label = target; // Set label

      frag.appendChild(temp); // Append template to fragment
    });

    panel.innerHTML = ""; // Clean element
    panel.appendChild(frag); // Append fragment to element

    target.style.display = "block"; // Show element
    motion.style.display = "none"; // Hide motion

    return object; // Return object
  } catch (error) {
    console.log(error);
  }
};

// Function to handle artists, albums and playlists touch event
const folTouch = (target, object) => {
  try {
    if (!target && typeof object !== "object") return; // Validation check

    target.addEventListener("click", async (event) => {
      const temp = event.target.closest("li"); // Get closest element
      const title = temp.children[1].textContent.trim(); // Get title

      if (!title && typeof object[title] !== "object") return; // Validation check

      localStorage.setItem("object", JSON.stringify(object[title])); // Store object in storage
      window.location.href = "/folder.html"; // Redirect to folder page
    });
  } catch (error) {
    console.log(error);
  }
};

// Function to initialize process (main)
const main = async () => {
  try {
    const batch = await audioRet(audioPath); // Retrieve batch
    const piece = batch.slice(batch.length / 2); // Half batch

    const artists = await folBit(forPanel[0], forMotion[0], "artists.json"); // Display artists
    const albums = await folBit(forPanel[1], forMotion[1], "albums.json"); // Display albums
    const playlists = await folBit(forPanel[2], forMotion[2], "playlists.json"); // Display playlists

    folTouch(forPanel[0].children[0], artists); // Artists touch event
    folTouch(forPanel[1].children[0], albums); // Albums touch event
    folTouch(forPanel[2].children[0], playlists); // Playlists touch event

    await fileBit(forPanel[3], forMotion[3], subset(piece, 15)); // Display audio
    await fileBit(forPanel[4], forMotion[4], subset(piece, 15)); // Display audio

    fileTouch(forPanel[3].children[0], batch); // Audio touch event
    fileTouch(forPanel[4].children[0], batch); // Audio touch event

    // Elements interface touch event (text box)
    forTextBox.forEach((target) => {
      target.children[1].addEventListener("click", () => {
        const label = target.dataset.label ?? ""; // Retrieve label
        sessionStorage.setItem("query", label); // Store query in session storage
        window.location.href = "/search.html"; // Redirect to search page
      });
    });
  } catch (error) {
    console.log(error);
  }
};

main(); // Initialize process
