import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, InputGroup, FormControl, Button } from "react-bootstrap";
import { useState } from "react";
import Playlist from "../Playlist/Playlist";
import SearchResults from "../SearchResults/SearchResults";
import { currentToken } from "../../util/SpotifyPKCE_OAuth";
import { searchTrack, savePlaylist } from "../../util/SpotifyInteraction";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [searchResult, setSearchResult] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  const args = new URLSearchParams(window.location.search);
  const code = args.get("code");

  const addTrack = (track) => {
    if (!playlist.includes(track)) {
      setPlaylist((prev) => [...prev, track]);
    }
  };

  const removeTrack = (track) => {
    setPlaylist(playlist.filter((item) => item.id !== track.id));
  }

  async function handleSavePlaylist() {
    const trackUris = playlist.map((track) => track.uri);
    currentToken.getAccessToken(code).then((token) => {
      return savePlaylist(token, trackUris, playlistName);
    })
    .then((object) => {
      console.log(`Playlist saved:`);
      for(let property in object) {
        console.log(`${property}: ${object[property]}`);
      }
    });
  }

  
  const handleSearchClick = () => {
    currentToken.getAccessToken(code).then((token) => {
      return searchTrack(searchInput, token)
    })
    .then((data) => {
        setSearchResult(data.tracks.items);
    });    
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      currentToken.getAccessToken(code).then((token) => {
        return searchTrack(searchInput, token);
      })
      .then((data) => {
        setSearchResult(data.tracks.items);
      });
    }
  };


  return (
    <div className="App">
      <Container>
        <h1>Search for a track</h1>
        <InputGroup className="mb-3">
          <FormControl
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="input"
            placeholder="Search for a track"
            aria-label="Search for a track"
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={handleSearchClick}
            value="Submit"
            variant="outline-secondary"
            id="button-addon2"
          >
            Search
          </Button>
        </InputGroup>
      </Container>
      <div className="App-playlist">
        <SearchResults
          addTrack={addTrack}
          searchResult={searchResult}
        />
        <Playlist 
          onSavePlaylist={handleSavePlaylist}
          playlistName={playlistName}
          setPlaylistName={setPlaylistName}
          playlist={playlist}
          removeTrack={removeTrack}
        />
      </div>
    </div>
  );
}

export default App;
