import { audioRet, fileRet, metadataRet } from "./server.js";

// Retrieve data from storage
const dataPath = localStorage.getItem("data-path");
const audioPath = localStorage.getItem("audio-path");
const videoPath = localStorage.getItem("video-path");

// Function to select subset of an array
export const subset = (array, range = 10) => {
  try {
    if (!Array.isArray(array) && array.length <= 0) return; // Validation check

    const check = Math.min(range, array.length); // Range check

    // Shuffle the array using Fisher-Yates algorithm
    for (let index = array.length - 1; index > 0; index--) {
      const randomIdx = Math.floor(Math.random() * (index + 1));
      [array[index], array[randomIdx]] = [array[randomIdx], array[index]];
    }

    return array.slice(0, check); // Return subset
  } catch (error) {
    console.log(error);
  }
};

// Function to select random index of an array
export const autoIdx = (array) => {
  try {
    if (!Array.isArray(array) && array.length <= 0) return; // Validation check

    const index = Math.floor(Math.random() * array.length); // Getting random index

    return array[index]; // Return element
  } catch (error) {
    console.log(error);
  }
};

// Function to format seconds into time string
export const formation = (sec) => {
  try {
    if (isNaN(sec) || sec < 0) return "00:00"; // Validation check

    let hours = Math.floor(sec / 3600); // Calculate hours
    let minutes = Math.floor((sec % 3600) / 60); // Calculate minutes
    let seconds = Math.floor(sec % 60); // Calculate seconds

    // Format time components
    const formatHours = hours.toString().padStart(2, "0");
    const formatMinutes = minutes.toString().padStart(2, "0");
    const formatSeconds = seconds.toString().padStart(2, "0");

    // Return formatted time string
    if (hours > 0) {
      return `${formatHours}:${formatMinutes}:${formatSeconds}`;
    } else {
      return `${formatMinutes}:${formatSeconds}`;
    }
  } catch (error) {
    console.error(error);
  }
};

// Function to format seconds into a human-readable string
export const counter = (sec) => {
  try {
    if (isNaN(sec) || sec < 0) return "0 Seconds"; // Validation check

    // Calculate hours, minutes, and seconds
    if (sec >= 3600) {
      const hrs = Math.floor(sec / 3600);
      return `${hrs} Hour${hrs !== 1 ? "s" : ""}`;
    } else if (sec >= 60) {
      const min = Math.floor(sec / 60);
      return `${min} Minute${min !== 1 ? "s" : ""}`;
    } else {
      const secs = Math.floor(sec);
      return `${secs} Second${secs !== 1 ? "s" : ""}`;
    }
  } catch (error) {
    console.error(error);
  }
};

// Function to retrieve data from server
export const retrieve = async (data) => {
  try {
    if (!data || typeof data !== "string" || data.trim().length === 0)
      return []; // Validation check

    const unit = data.toLocaleLowerCase(); // Convert to lowercase
    const lib = ["artists.json", "albums.json", "playlists.json"]; // Library for data
    const keyword = ["artists", "albums", "playlists", "audio", "all songs"]; // Keywords for data

    // Method I - Searching for data in keywords
    const keyIdx = keyword.findIndex((key) => key.toLowerCase().includes(unit)); // Find index

    if (keyIdx >= 0 && keyIdx < 3) {
      const object = await fileRet(dataPath + lib[keyIdx]); // Retrieve object
      if (object && typeof object === "object") return object; // Return object
    }

    const content = await audioRet(audioPath); // Retrieve audio
    if (keyIdx > 2 && keyIdx < keyword.length) {
      if (Array.isArray(content) && content.length > 0)
        return content.slice(0, content.length / 2); // Return array
    }

    // Method II - Searching for data in objects
    const batch = await Promise.all(lib.map((idx) => fileRet(dataPath + idx))); // Retrieve batches

    for (let index = 0; index < batch.length; index++) {
      const keys = Object.keys(batch[index] || {}); // Collect keys
      const match = keys.filter((key) => key.toLowerCase().includes(unit)); // Match data
      const key = match[0];
      if (key && typeof batch[index][key] === "object") {
        return batch[index][key]; // Return object
      }
    }

    // Method III - Searching for data in audio titles
    const decoded = content ? content.map((audio) => decodeURI(audio)) : []; // Decode content
    const match = decoded.filter((key) => key.toLowerCase().includes(unit)); // Match data
    if (Array.isArray(match) && match.length > 0) return match; // Return array

    // Method IV - Searching for data in audio metadata
    const metadata = await Promise.all(
      content.map((audio) => metadataRet(audioPath + audio))
    ); // Retrieve metadata

    const matched = content.filter((audio, index) => {
      const meta = metadata[index];
      if (!meta) return false; // Skip if no metadata

      // Collect metadata tokens
      const tokens = [
        meta.title,
        meta.artist,
        meta.album,
        meta.artists,
        meta.composer,
        meta.language,
        meta.genre,
        meta.year,
        meta.duration,
        meta.comment,
      ];

      //
      const flat = tokens.flatMap((token) => {
        if (Array.isArray(token)) {
          return token.map((val) => val?.toString().toLowerCase());
        } else if (token !== undefined && token !== null) {
          return [token.toString().toLowerCase()];
        } else {
          return [];
        }
      });

      return flat.some((val) => val.includes(unit));
    });

    if (Array.isArray(matched) && matched.length > 0) return matched; // Return array

    return []; // Fallback
  } catch (error) {
    console.log(error);
    return [];
  }
};

// Function to count length of object and array
export const lenCount = (batch) => {
  if (Array.isArray(batch)) return batch.length;

  if (batch && typeof batch === "object") {
    const values = Object.values(batch);
    const count = values.filter(
      (item) => item !== null && typeof item === "object"
    ).length;

    return count || Object.keys(batch).length;
  }

  return 0;
};
