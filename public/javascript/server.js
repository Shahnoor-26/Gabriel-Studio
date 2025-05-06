import * as metadata from "https://cdn.jsdelivr.net/npm/music-metadata-browser/+esm";

// Function to fetch object from given path
export const fileRet = async (path) => {
  try {
    if (!path) return; // Validation check

    const request = await fetch(path); // Fetch request

    if (!request.ok) console.log(request.statusText); // Check status

    const response = await request.json(); // Getting response

    return response ? response : {}; // Return response
  } catch (error) {
    console.log(error);
  }
};

// Function to fetch metadata from the given path
export const metadataRet = async (path) => {
  try {
    if (!path) return; // Validation check

    const request = await fetch(path); // Fetch request

    if (!request.ok) console.log(request.statusText); // Check status

    const response = await request.blob(); // Getting response
    const file = await metadata.parseBlob(response); // Parsing the blob

    let source = "./template.webp"; // Initial source

    // Conversion of picture into source
    if (file.common.picture?.length) {
      const picture = file.common.picture[0];
      const blob = new Blob([new Uint8Array(picture.data)], {
        type: picture.format,
      });

      // Creation of URL for source
      source = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }

    // Return Object
    return {
      picture: source,
      format: file.format,
      year: file.common.year || "Not Available",
      title: file.common.title || "Not Available",
      album: file.common.album || "Not Available",
      artist: file.common.artist || "Not Available",
      genre: file.common.genre || ["Not Available"],
      composer: file.common.composer || "Not Available",
      duration: file.format.duration || "Not Available",
      lyrics: file.common.lyric || "Not Available",
      artists: file.common.albumartist || "Not Available",
      language: file.common.language || ["Not Available"],
      comment: file.common.comment || "Not Available",
      disk: file.common.disk ? file.common.disk.no : "Not Available",
      track: file.common.track ? file.common.track.no : "Not Available",
    };
  } catch (error) {
    console.log(error);
  }
};

// Function to compress given picture
export const compressor = async (path, size = 300, quality = 75) => {
  try {
    if (!path) return; // Validation check

    return new Promise((resolve) => {
      const picture = new Image(); // Picture creation
      picture.crossOrigin = "anonymous"; // Cross-Origin
      picture.decoding = "async"; // Decoding

      picture.onload = () => {
        // Calculate the scale and dimensions
        const scale = Math.min(size / picture.width, size / picture.height, 1);
        const height = Math.floor(picture.height * scale);
        const width = Math.floor(picture.width * scale);

        // Create a canvas element
        const canvas = document.createElement("canvas");
        canvas.height = height;
        canvas.width = width;

        // Set the canvas dimensions
        const context = canvas.getContext("2d", { willReadFrequently: false }); // Adjust context
        context.drawImage(picture, 0, 0, width, height);

        try {
          const source = canvas.toDataURL("image/webp", quality); // Source conversion
          resolve(source);
        } catch (error) {
          console.log("Compression Failed: ", error);
          resolve(path);
        }
      };
      picture.onerror = () => {
        console.log("Picture Loading Failed:", path); // Handle errors
        resolve(path);
      };

      picture.src = path; // Set the source
    });
  } catch (error) {
    console.log(error);
  }
};
