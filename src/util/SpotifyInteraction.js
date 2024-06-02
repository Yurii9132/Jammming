const searchEndpoint = "https://api.spotify.com/v1/search";
const meEndpoint = "https://api.spotify.com/v1/me";

async function searchTrack(searchInput, token) {
  // search endpoint
  const endpointUrl = new URL(searchEndpoint);
  // search parameters
  const params = {
    q: searchInput,
    type: "track",
    limit: 20,
  };
  // add search parameters to the endpoint
  endpointUrl.search = new URLSearchParams(params).toString();
  const searchUrl = endpointUrl.toString();
  try {
    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

async function savePlaylist(token, trackUris, playlistName) {
  const userId = await getUserId(token);
  const playlistId = await createPlaylist(token, userId, playlistName);
  return await addTracksToPlaylist(token, playlistId, trackUris);
}

async function addTracksToPlaylist(token, playlistId, trackUris) {
  const addTraksEndpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  const payload = {
    uris: trackUris,
    position: 0,
  };
  try {
    const response = await fetch(addTraksEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Request was aborted:", error);
    } else if (error.name === "TypeError") {
      console.error("Network error or CORS issue:", error);
    } else {
      console.error("An error occurred:", error);
    }
  }
}

async function createPlaylist(token, userId, playlistName) {
  const playlistEndpoint = `https://api.spotify.com/v1/users/${userId}/playlists`;
  const payload = {
    name: playlistName,
    public: false,
  };
  try {
    const response = await fetch(playlistEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    // return playlist ID
    return data.id;
  } catch (error) {
    console.log(error);
  }
}

async function getUserId(token) {
  try {
    const response = await fetch(meEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.log(error);
  }
}

export { searchTrack, savePlaylist };
