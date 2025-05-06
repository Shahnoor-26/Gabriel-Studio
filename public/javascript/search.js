import { compressor, fileRet, metadataRet } from "./server.js";
import { audioInit } from "./engine.js";
import { lenCount, retrieve } from "./utils.js";

// Retrieve data from storage
const dataPath = localStorage.getItem("data-path");
const audioPath = localStorage.getItem("audio-path");
const videoPath = localStorage.getItem("video-path");

// Targeting elements for manipulation
const forResult = document.querySelector("#result");
const forCollect = document.querySelector("#collection");
const forRestBox = document.querySelector("#result-box");
const forColBox = document.querySelector("#col-box");
const forMargin = document.querySelector("#margin");
const forNoRest = document.querySelector("#no-result");
const forFilBox = document.querySelector("#filter-box");

// Targeting elements for manipulation (batch)
const forMotion = document.querySelectorAll("#motion-box");
const forSelect = document.querySelectorAll("select");

// Targeting buttons for manipulation
const forFilBtn = document.querySelector("[aria-label='filter']");
const forFindBtn = document.querySelector("[aria-label='find']");
const forResetBtn = document.querySelector("[aria-label='reset']");

let batch = [] || {}; // Initial variable

// Function to display stock
const stock = async (target, motion, file = "stock.json") => {
  try {
    if (!target && !motion) return; // Validation check

    const object = await fileRet(dataPath + file); // Retrieve object
    const keys = Object.keys(object || []); // Collect keys

    const content = []; // Initial variable
    const frag = document.createDocumentFragment();

    for (let index = 0; index < keys.length; index++) {
      const path = object[keys[index]].picture; // Retrieve picture
      const source = path ? await compressor(path) : "./template.webp"; // Picture compression
      content.push({ label: keys[index], picture: source }); // Append object to content
    }

    content.forEach((data) => {
      // Retrieve data from object
      const label = data.label ?? "Not Available";
      const color = object[label].color ?? "#ED254E";
      const title = object[label].title ?? "Not Available";
      const picture = data.picture ?? "./template.webp";

      const temp = target.children[0].cloneNode(true); // Clone template
      temp.dataset.label = label; // Set label
      temp.style.backgroundColor = color; // Set color
      temp.children[0].textContent = title; // Set title
      temp.children[1].setAttribute("src", picture); // Set picture

      frag.appendChild(temp); // Append template to fragment
    });

    target.innerHTML = ""; // Clean element
    target.appendChild(frag); // Append fragment to element
    target.style.display = "flex"; // Show element
    motion.style.display = "none"; // Hide motion
  } catch (error) {
    console.log(error);
  }
};

// Function to display founded result
const found = async (target, motion, batch) => {
  try {
    if (!target && !motion && !batch) {
      console.log("No Result Founded!");
      return;
    }

    const frag = document.createDocumentFragment();

    if (Array.isArray(batch) && batch.length > 0) {
      const metadata = await Promise.all(
        batch.map((audio) => metadataRet(audioPath + audio))
      ); // Retrieve metadata

      metadata.forEach((data) => {
        // Retrieve data from metadata
        const title = data.title ?? "Not Available";
        const artist = data.artist ?? "Not Available";
        const picture = data.picture ?? "./template.webp";

        const temp = target.children[0].cloneNode(true); // Clone template
        temp.dataset.label = "audio"; // Set label
        temp.children[0].setAttribute("src", picture); // Set picture
        temp.children[1].textContent = title; // Set title
        temp.children[2].textContent = artist; // Set artist

        frag.appendChild(temp); // Append template to fragment
      });

      target.innerHTML = ""; // Clean element
      target.appendChild(frag); // Append fragment to element
      forRestBox.style.display = "block"; // Show element
      motion.style.display = "none"; // Hide motion
    } else if (typeof batch === "object") {
      const isFlat = Object.values(batch).every(
        (val) => !val || typeof val !== "object" || Array.isArray(val)
      ); // Flat object checker

      if (isFlat) {
        // Retrieve data from object
        const title = batch.title ?? "Not Available";
        const label = batch.target ?? "Not Available";
        const picture = batch.picture ?? "./template.webp";

        const temp = target.children[0]; // Create template
        temp.dataset.label = label; // Set label
        temp.children[0].setAttribute("src", picture); // Set picture
        temp.children[1].textContent = title; // Set title
        temp.children[2].textContent = label; // Set target

        forRestBox.style.display = "block"; // Show element
        motion.style.display = "none"; // Hide motion
      } else {
        const keys = Object.keys(batch || []); // Collect keys

        keys.forEach((key) => {
          // Retrieve data from object
          const title = batch[key].title ?? "Not Available";
          const label = batch[key].target ?? "Not Available";
          const picture = batch[key].picture ?? "Not Available";

          const temp = target.children[0].cloneNode(true); // Clone template
          temp.dataset.label = label; // Set label
          temp.children[0].setAttribute("src", picture); // Set picture
          temp.children[1].textContent = title; // Set title
          temp.children[2].textContent = label; // Set target

          frag.appendChild(temp); // Append template to fragment
        });

        target.innerHTML = ""; // Clean element
        target.appendChild(frag); // Append fragment to element
        forRestBox.style.display = "block"; // Show element
        motion.style.display = "none"; // Hide motion
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Function to initialize process (main)
const main = async () => {
  try {
    const query = sessionStorage.getItem("query"); // Retrieve query

    if (!query) {
      // Elements interface (collection, result)
      forResult.style.display = "none"; // Inactive state
      forCollect.style.display = "block"; // Active state

      await stock(forColBox, forMotion[0]); // Display stock
    } else {
      // Elements interface (collection, result)
      forResult.style.display = "block"; // Active state
      forCollect.style.display = "none"; // Inactive state

      batch = await retrieve(query); // Retrieve batch

      const count = lenCount(batch); // Count length
      const text = `${count} result${count === 1 ? "" : "s"} for "${query}"`; // Create text

      if (count > 0) {
        await found(forRestBox.children[0], forMotion[1], batch); // Display result

        forMargin.children[0].textContent = text; // Set text
      } else {
        forNoRest.style.display = "flex"; // Active state
        forRestBox.style.display = "none"; // Inactive state
        forMotion[1].style.display = "none"; // Inactive state
        forMargin.children[0].textContent = text; // Set text
      }
    }

    // Elements interface touch event (result box)
    forRestBox.addEventListener("click", async (event) => {
      const temp = event.target.closest("li"); // Get closest element
      const label = temp.dataset.label.trim(); // Get label
      const data = temp.children[1].textContent.trim(); // Get data

      if (!temp && !label && !data) return; // Validation check
      else if (label === "audio" || Array.isArray(batch)) {
        localStorage.setItem("batch", JSON.stringify(batch)); // Store batch in storage
        window.dispatchEvent(new Event("storage")); // Trigger storage event

        await audioInit(data); // Initialize audio
      } else {
        const source = `${dataPath}${label.toLowerCase()}s.json`; // Set source
        const object = await fileRet(source); // Retrieve object

        if (!object || typeof object !== "object") return; // Validation check

        localStorage.setItem("object", JSON.stringify(object[data])); // Store batch in storage
        window.location.href = "/folder.html"; // Redirect to folder page
      }
    });

    // Elements interface touch event (select)
    forSelect.forEach((target) => {
      target.addEventListener("change", () => {
        if (target.value) {
          forSelect.forEach((s) => (s !== target ? (s.disabled = true) : null)); // Disable other
        } else forSelect.forEach((s) => (s.disabled = false)); // Enable other
      });
    });

    // Elements interface touch event (col box)
    forColBox.addEventListener("click", async (event) => {
      const temp = event.target.closest("li"); // Get closest element
      const label = temp.dataset.label.trim(); // Get label

      if (!temp && !label) return; // Validation check

      const object = await fileRet(dataPath + "stock.json"); // Retrieve object
      let content = object[label].content; // Get content

      if (Array.isArray(content) && content.length > 0) {
        // Elements interface (collection, result)
        forResult.style.display = "block"; // Active state
        forCollect.style.display = "none"; // Inactive state

        content = content.map((audio) => audio + ".mp3"); // Update content
        await found(forRestBox.children[0], forMotion[1], content); // Display result

        const count = lenCount(content); // Count length
        const text = `${count} result${count === 1 ? "" : "s"} for "${label}"`; // Create text

        forMargin.children[0].textContent = text; // Set text
      } else {
        sessionStorage.setItem("query", content); // Store query in session storage
        window.location.href = "/search.html"; // Redirect to same page
      }
    });

    // Button functionality (filter)
    forFilBtn.addEventListener("click", () => {
      if (forFilBox.classList.contains("hidden")) {
        forFilBox.classList.replace("hidden", "flex"); // Active state
        forFilBtn.children[0].style.color = "#ed254e";
      } else {
        forFilBox.classList.replace("flex", "hidden"); // Inactive state
        forFilBtn.children[0].style.color = "#ffffff";
      }
    });

    // Button functionality (reset)
    forResetBtn.addEventListener("click", () => {
      forSelect.forEach((target) => {
        target.value = ""; // Reset value
        target.disabled = false; // Reset state
      });
    });

    // Button functionality (find)
    forFindBtn.addEventListener("click", async () => {
      let data = null; // Initial variable

      forSelect.forEach((s) => (s.value ? (data = s.value) : "")); // Set data

      if (!data) return alert("Please select an option before searching!"); // Alert message

      sessionStorage.setItem("query", data); // Store query in session storage
      window.location.href = "/search.html"; // Redirect to same page
    });
  } catch (error) {
    console.log(error);
  }
};

main(); // Initialize process
