import { metadataRet } from "./server.js";
import { audioInit } from "./engine.js";
import { counter, formation } from "./utils.js";

// Retrieve data from storage
const dataPath = localStorage.getItem("data-path");
const audioPath = localStorage.getItem("audio-path");
const videoPath = localStorage.getItem("video-path");

// Targeting elements for manipulation
const forNotch = document.querySelector("#fol-notch");
const forTable = document.querySelector("#fol-data");
const forDesc = document.querySelector("#fol-desc");
const forInHead = document.querySelector("#info-nav");
const forInDet = document.querySelector("#detail-info");
const forMotion = document.querySelector("#motion-box");
const forLibBox = document.querySelector("#lite-lib");
const forInfoBox = document.querySelector("#lite-info");
const forFolBox = document.querySelector("#fol-box");
const forViewBox = document.querySelector("#view-box");
const forGrid = document.querySelector("#grid");
const forCompact = document.querySelector("#compact");

// Targeting buttons for manipulation
const forELibBtn = document.querySelector("[aria-label='lite-lib']");
const forCLibBtn = document.querySelector("[aria-label='lib-hidden']");
const forEInfoBtn = document.querySelector("[aria-label='lite-info']");
const forCInfoBtn = document.querySelector("[aria-label='info-hidden']");
const forFreshBtn = document.querySelector("[aria-label='refresh']");
const forViewBtn = document.querySelector("[aria-label='lib-view']");
const forBookBtn = document.querySelector("[aria-label='bookmark']");

// Function to display data and audio
const objective = async (object) => {
  try {
    if (!object && typeof object !== "object") return; // Validation

    // Retrieve data from object
    const batch = object.content ?? [];
    const title = object.title ?? "Not Available";
    const status = object.status ?? "Not Available";
    const target = object.target ?? "Not Available";
    const description = object.description ?? "Not Available";
    const picture = object.picture ?? "/public/template.webp";

    localStorage.setItem("batch", JSON.stringify(batch)); // Store batch in storage
    window.dispatchEvent(new Event("storage")); // Trigger storage event

    // Elements interface cover and data (fol notch)
    forNotch.children[0].setAttribute("src", picture); // Set picture
    forDesc.children[0].children[1].textContent = status; // Set status
    forDesc.children[1].textContent = title; // Set title

    const content = batch.map((audio) => audioPath + audio + ".mp3"); // Getting content

    const metadata = await Promise.all(
      content.map((source) => metadataRet(source))
    ); // Retrieve metadata

    let count = null; // Initial state
    let total = null; // Initial state

    const frag = document.createDocumentFragment();

    metadata.forEach((data, index) => {
      // Retrieve data from metadata
      const duration = data.duration ?? 0;
      const title = data.title ?? "Not Available";
      const artist = data.artist ?? "Not Available";
      const picture = data.picture ?? "/public/template.webp";

      const temp = forTable.children[0].cloneNode(true); // Clone template
      temp.children[0].textContent = index + 1; // Set index
      temp.children[1].setAttribute("src", picture); // Set picture
      temp.children[2].textContent = title; // Set title
      temp.children[3].textContent = artist; // Set artist
      temp.children[4].textContent = formation(duration); // Set duration

      count = index + 1; // Increment counts
      total = total + duration; // Increment duration
      frag.appendChild(temp); // Append template to fragment
    });

    forTable.innerHTML = ""; // Clean element
    forTable.appendChild(frag); // Append fragment to element
    forTable.style.display = "block"; // Show element
    forMotion.style.display = "none"; // Hide motion

    // Elements interface data (fol notch, info nav, detail info)
    const bullet = `Gabriel · ${count} Songs · About ${counter(total)}`;
    forDesc.children[2].children[1].textContent = bullet; // Set bullet
    forInHead.children[0].textContent = title; // Set title
    forInDet.children[0].children[0].textContent = target; // Set target
    forInDet.children[0].children[1].textContent = title; // Set title
    forInDet.children[0].children[2].textContent = description; // Set description
  } catch (error) {
    console.log(error);
  }
};

// Function to display alpha and beta
const libInit = async (beta = [], isGrid = false) => {
  try {
    const frag = document.createDocumentFragment();

    if (isGrid) {
      beta.forEach((data) => {
        // Retrieve data from object
        const title = data.title ?? "Not Available";
        const artist = data.target ?? "Not Available";
        const picture = data.picture ?? "/public/template.webp";

        const temp = forGrid.children[0].children[0].cloneNode(true); // Clone template
        temp.children[0].setAttribute("src", picture); // Set picture
        temp.children[1].textContent = title; // Set title
        temp.children[2].textContent = artist; // Set artist
        frag.appendChild(temp); // Append template to fragment
      });

      forGrid.children[0].innerHTML = ""; // Clean element
      forGrid.children[0].appendChild(frag); // Append fragment to element
    } else {
      beta.forEach((data) => {
        // Retrieve data from object
        const title = data.title ?? "Not Available";
        const artist = data.target ?? "Not Available";
        const picture = data.picture ?? "/public/template.webp";

        const temp = forCompact.children[0].cloneNode(true); // Clone template
        temp.children[0].setAttribute("src", picture); // Set picture
        temp.children[1].children[0].textContent = title; // Set title
        temp.children[1].children[1].textContent = artist; // Set artist
        frag.appendChild(temp); // Append template to fragment
      });

      forCompact.innerHTML = ""; // Clean element
      forCompact.appendChild(frag); // Append fragment to element
    }
  } catch (error) {
    console.log(error);
  }
};

// Function to initialize process (main)
const main = async () => {
  try {
    const object = JSON.parse(localStorage.getItem("object" || {})); // Retrieve object
    const alpha = JSON.parse(localStorage.getItem("favorite" || {})); // Retrieve favorite
    const beta = Array.from(JSON.parse(localStorage.getItem("bookmark" || []))); // Retrieve bookmark
    const isIdx = beta.findIndex((data) => data.title === object.title); // Find index

    await libInit(beta, false); // Display lite lib
    await objective(object); // Display data and audio

    // Button interface (bookmark)
    if (isIdx !== -1) {
      forBookBtn.children[0].style.display = "none"; // Active state
      forBookBtn.children[1].style.display = "block";
    } else {
      forBookBtn.children[0].style.display = "block"; // Inactive state
      forBookBtn.children[1].style.display = "none";
    }

    // Elements interface touch event (table)
    forTable.addEventListener("click", async (event) => {
      const temp = event.target.closest("li"); // Get closest element
      const audio = temp.children[2].textContent.trim(); // Get audio title

      if (!audio) return; // Validation check

      await audioInit(audio); // Initialize audio
    });

    // Elements interface touch event (compact)
    forCompact.addEventListener("click", (event) => {
      const temp = event.target.closest("li"); // Get closest element
      const title = temp.children[1].children[0].textContent.trim(); // Get title
      const touch = beta.find((data) => data.title === title); // Find title

      if (!title && !touch && typeof touch !== "object") return; // Validation check

      localStorage.setItem("object", JSON.stringify(touch)); // Store object in storage
      window.location.href = "/folder.html"; // Redirect to folder page
    });

    // Elements interface touch event (grid)
    forGrid.addEventListener("click", (event) => {
      const temp = event.target.closest("li"); // Get closest element
      const title = temp.children[1].textContent.trim(); // Get title
      const touch = beta.find((data) => data.title === title); // Find title

      if (!title && !touch && typeof touch !== "object") return; // Validation check

      localStorage.setItem("object", JSON.stringify(touch)); // Store object in storage
      window.location.href = "/folder.html"; // Redirect to folder page
    });

    // Elements interface touch event (view box)
    forViewBox.addEventListener("click", (event) => {
      const temp = event.target.closest("li"); // Get closest element
      const label = temp.children[1]?.textContent.trim(); // Get label

      if (!label) return; // Validation check

      switch (label) {
        case "Compact": // Compact active
          libInit(beta, false); // Display lite lib
          forViewBtn.children[0].style.display = "block";
          forViewBtn.children[1].style.display = "none";
          forGrid.style.display = "none";
          forCompact.style.display = "block";
          break;

        case "Grid": // Grid active
          libInit(beta, true); // Display lite lib
          forViewBtn.children[0].style.display = "none";
          forViewBtn.children[1].style.display = "block";
          forGrid.style.display = "block";
          forCompact.style.display = "none";
          break;
      }
    });

    // Button functionality (lite info)
    forEInfoBtn.addEventListener("click", () => {
      forInfoBox.classList.replace("hidden", "block");
      forFolBox.classList.replace("flex", "hidden");
      forLibBox.classList.replace("flex", "hidden");
    });

    // Button functionality (lite info)
    forCInfoBtn.addEventListener("click", () => {
      forInfoBox.classList.replace("block", "hidden");
      forFolBox.classList.replace("hidden", "flex");
      forLibBox.classList.replace("flex", "hidden");
    });

    // Button functionality (lite lib)
    forELibBtn.addEventListener("click", () => {
      forLibBox.classList.replace("hidden", "flex");
      forFolBox.classList.replace("flex", "hidden");
      forInfoBox.classList.replace("block", "hidden");
    });

    // Button functionality (lite lib)
    forCLibBtn.addEventListener("click", () => {
      forLibBox.classList.replace("flex", "hidden");
      forFolBox.classList.replace("hidden", "flex");
      forInfoBox.classList.replace("block", "hidden");
    });

    // Button functionality (refresh)
    forFreshBtn.addEventListener("click", () => {
      window.location.href = "/folder.html"; // Reload the same page
    });

    // Button functionality (view)
    forViewBtn.addEventListener("click", () => {
      forViewBox.classList.toggle("hidden"); // Toggle element
    });

    // Button functionality (bookmark)
    forBookBtn.addEventListener("click", () => {
      const updateIdx = beta.findIndex((data) => data.title === object.title); // Find index

      if (updateIdx !== -1) {
        beta.splice(updateIdx, 1); // Discard object in beta
        forBookBtn.children[0].style.display = "block"; // Inactive state
        forBookBtn.children[1].style.display = "none";
      } else {
        beta.push(object); // Append object in beta
        forBookBtn.children[0].style.display = "none"; // Active state
        forBookBtn.children[1].style.display = "block";
      }

      localStorage.setItem("bookmark", JSON.stringify(beta)); // Store bookmark in storage
      window.dispatchEvent(new Event("storage")); // Trigger storage event
    });
  } catch (error) {
    console.log(error);
  }
};

main(); // Initialize process
