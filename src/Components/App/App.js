import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, InputGroup, FormControl, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { CLIENT_id, CLIENT_SECRET } from "../../config/apikeys";



function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    //API Access Token
    const authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_id}&client_secret=${CLIENT_SECRET}`,
    };
    try {
      fetch("https://accounts.spotify.com/api/token", authParams)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setAccessToken(data.access_token);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  async function searchTrack() {
    // console.log(`Search for ${searchInput}`);
    const searchParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${searchInput}&type=track`,
        searchParams
      );
      const data = await response.json();
      setSearchResult(data.tracks.items);
      console.log(data.tracks.items[0].name);
      console.log(data.tracks.items[0].album.name);
      console.log(data.tracks.items[0].artists[0].name);
    } catch (error) {
      console.log(error);
    }    
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchTrack();
    }
  };

  return (
    <div className="App">
      <Container>
        <h1>Search for a track</h1>
        <InputGroup className="mb-3">
          <FormControl
            type="input"
            placeholder="Search for a track"
            aria-label="Search for a track"
            onKeyDown={handleKeyDown}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button
            onClick={searchTrack}
            value="Submit"
            variant="outline-secondary"
            id="button-addon2"
          >
            Search
          </Button>
        </InputGroup>
      </Container>
      <div className="App-playlist">
        <div className="searchResult">
          <h2>Search Result</h2>
          <ul>
            {searchResult.map((track) => (
              <li key={track.id}>
                <img src={track.album.images[2].url} alt="album cover" />
                <div>
                  <h3>{track.name}</h3>
                  <p>{track.album.name} | {track.artists[0].name}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="playlist"></div>
      </div>
    </div>
  );
}

export default App;
