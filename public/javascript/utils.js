import { fileRet, metadataRet } from "./server.js";

// Retrieve data from storage
const dataPath = localStorage.getItem("data-path");
const audioPath = localStorage.getItem("audio-path");

// Model for audio
export const ultra = [
  "Aankh.mp3",
  "Aaye Haaye.mp3",
  "Ajab Si (Om Shanti Om).mp3",
  "Ajj Din Chadheya (Love Aaj Kal).mp3",
  "Ajnabi Hawaayein Bekrara Bahein (Shaapit).mp3",
  "Akhiyaan (Tuesdays And Fridays).mp3",
  "Akhiyan (Mirza The Untold Story).mp3",
  "Allah Duhai Hai (Race 2).mp3",
  "Angaaron (Pushpa 2 The Rule).mp3",
  "Apna Bana Le Song (Bhediya).mp3",
  "Bairiyaa (Ramaiya Vastavaiya).mp3",
  "Be Intehaan (Race 2).mp3",
  "Bol Kaffara Kya Hoga.mp3",
  "Bol Na Halke Halke (Jhoom Barabar Jhoom).mp3",
  "Chaar Kadam (PK).mp3",
  "Chalao Na Naino Se (Bol Bachchan).mp3",
  "Chand Sifarish (Fanaa).mp3",
  "Chanda Chamke (Fanaa).mp3",
  "Chaudhary.mp3",
  "Cheez Badi (Machine).mp3",
  "Chikni Chameli (Agneepath).mp3",
  "Chor Bazari (Love Aaj Kal).mp3",
  "Dastaan-E-Om Shanti Om (Om Shanti Om).mp3",
  "Deewangi Deewangi (Om Shanti Om).mp3",
  "Deewani Mastani (Bajirao Mastani).mp3",
  "Dekho Na (Fanaa).mp3",
  "Deva Deva (Brahmastra).mp3",
  "Dhating Naach (Phata Poster Nikhla Hero).mp3",
  "Dil Chahte Ho.mp3",
  "Dil Diyan Gallan (Tiger Zinda Hai).mp3",
  "Dil Ibaadat (Tum Mile).mp3",
  "Dil Ko Karaar Aaya (Sukoon).mp3",
  "Door Na Ja (Jannat).mp3",
  "Dooriyan (Love Aaj Kal).mp3",
  "Gaadi Kaali.mp3",
  "Haan Tu Hain (Jannat).mp3",
  "Hum Mar Jayenge (Aashiqui 2).mp3",
  "Jag Soona Soona Lage (Om Shanti Om).mp3",
  "Jamna Paar.mp3",
  "Janam Janam (Phata Poster Nikhla Hero).mp3",
  "Jeene Laga Hoon (Ramaiya Vastavaiya).mp3",
  "Judai (Jannat).mp3",
  "Kaash Tu Mila Hota (Code Blue).mp3",
  "Kala Chashma (Baar Baar Dekho).mp3",
  "Khairiyat (Chhichhore).mp3",
  "Kinna Sona (Marjaavaan).mp3",
  "Kuch To Hua Hai (Kal Ho Naa Ho).mp3",
  "Labon Ko (Bhool Bhulaiyaa).mp3",
  "Lat Lag Gayee (Race 2).mp3",
  "Lut Gaye.mp3",
  "Lutt Putt Gaya (Dunki).mp3",
  "Maahi Ve (Wajah Tum Ho).mp3",
  "Main Agar Kahoon (Om Shanti Om).mp3",
  "Main Jahaan Rahoon (Namastey London).mp3",
  "Main Jis Din Bhulaa Du.mp3",
  "Main Kya Hoon (Love Aaj Kal).mp3",
  "Main Rang Sharbaton Ka (Phata Poster Nikhla Hero).mp3",
  "Main Tera Dhadkan Teri (Ajab Prem Ki Ghazab Kahani).mp3",
  "Mast Aankhein.mp3",
  "Mast Nazron Se.mp3",
  "Mere Bina Tu (Phata Poster Nikhla Hero).mp3",
  "Mere Haath Mein (Fanaa).mp3",
  "Mere Yaaraa (Sooryavanshi).mp3",
  "Meri Aashiqui (Aashiqui 2).mp3",
  "Meri Aashiqui.mp3",
  "Milne Hai Mujhse Aayi (Aashiqui 2).mp3",
  "O Rangrez (Bhaag Milkha Bhaag).mp3",
  "O Re Piya (Aaja Nachle).mp3",
  "Oh By God (Ajab Prem Ki Ghazab Kahani).mp3",
  "Party On My Mind (Race 2).mp3",
  "Peecha Chhute (Ramaiya Vastavaiya).mp3",
  "Pehli Nazar Mein (Race).mp3",
  "Phir Aur Kya Chahiye (Zara Hatke Zara Bachke).mp3",
  "Piya Aaye Na (Aashiqui 2).mp3",
  "Piya O Re Piya (Tere Naal Love Ho Gaya).mp3",
  "Rang Jo Lagyo (Ramaiya Vastavaiya).mp3",
  "Sach Keh Raha Hai Deewana (Rehnaa Hai Terre Dil Mein).mp3",
  "Sajda (My Name Is Khan).mp3",
  "Sajde (Khatta Meetha).mp3",
  "Satranga (Animal).mp3",
  "Sawan Mein Lag Gayi Aag (Ginny Weds Sunny).mp3",
  "Shayad (Love Aaj Kal).mp3",
  "Soulmate (Ek Tha Raja).mp3",
  "Taaron Ke Shehar.mp3",
  "Tera Hone Laga Hoon (Ajab Prem Ki Ghazab Kahani).mp3",
  "Thoda Thoda Pyar (Love Aaj Kal).mp3",
  "Tu Hi Meri Shab Hai (Gangster).mp3",
  "Tu Jaane Na (Ajab Prem Ki Ghazab Kahani).mp3",
  "Tu Jo Mila (Bajrangi Bhaijaan).mp3",
  "Tu Mere Agal Bagal Hai (Phata Poster Nikhla Hero).mp3",
  "Tum Hi Ho (Aashiqui 2).mp3",
  "Tum Jo Aaye Jindagi (Once Upon A Time In Mumbaai).mp3",
  "Tumse Bhi Zyada (Tadap).mp3",
  "Woh Ladki Hai Kahan (Dil Chahta Hai).mp3",
  "Zara Sa (Jannat).mp3",
  "Zihaal E Miskin.mp3",
];

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

    if (keyIdx > 2 && keyIdx < keyword.length) {
      if (Array.isArray(ultra) && ultra.length > 0)
        return ultra.slice(0, ultra.length / 2); // Return array
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
    const decoded = ultra ? ultra.map((audio) => decodeURI(audio)) : []; // Decode content
    const match = decoded.filter((key) => key.toLowerCase().includes(unit)); // Match data
    if (Array.isArray(match) && match.length > 0) return match; // Return array

    // Method IV - Searching for data in audio metadata
    const metadata = await Promise.all(
      ultra.map((audio) => metadataRet(audioPath + audio))
    ); // Retrieve metadata

    const matched = ultra.filter((audio, index) => {
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
