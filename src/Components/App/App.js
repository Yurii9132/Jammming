import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Container, InputGroup, FormControl, Button } from "react-bootstrap";
import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import Playlist from "../Playlist/Playlist";
import SearchResults from "../SearchResults/SearchResults";
import { currentToken } from "../../util/SpotifyPKCE_OAuth";
import { searchTrack, savePlaylist } from "../../util/SpotifyInteraction";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [searchResult, setSearchResult] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const args = new URLSearchParams(window.location.search);
  const code = args.get("code");

  const addTrack = (track) => {
    if (!playlist.includes(track)) {
      setPlaylist((prev) => [...prev, track]);
    }
  };

  const removeTrack = (track) => {
    setPlaylist(playlist.filter((item) => item.id !== track.id));
  };

  async function handleSavePlaylist() {
    if (playlist.length === 0) {
      return;
    }
    const trackUris = playlist.map((track) => track.uri);
    currentToken.getAccessToken(code).then((token) => {
      savePlaylist(token, trackUris, playlistName);
      setPlaylist([]);
      setPlaylistName("New Playlist");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    });
  }

  const handleSearchClick = () => {
    currentToken
      .getAccessToken(code)
      .then((token) => {
        return searchTrack(searchInput, token);
      })
      .then((data) => {
        setSearchResult(data.tracks.items);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      currentToken
        .getAccessToken(code)
        .then((token) => {
          return searchTrack(searchInput, token);
        })
        .then((data) => {
          setSearchResult(data.tracks.items);
        });
    }
  };

  return (
    <div className="background">
      <h1 className="header">
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <div className="App">
        <SearchBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleSearchClick={handleSearchClick}
          handleKeyDown={handleKeyDown}
        />
        <div className="App-playlist">
          <SearchResults addTrack={addTrack} searchResult={searchResult} />
          <Playlist
            onSavePlaylist={handleSavePlaylist}
            playlistName={playlistName}
            setPlaylistName={setPlaylistName}
            playlist={playlist}
            removeTrack={removeTrack}
            showSuccess={showSuccess}
          />          
        </div>
      </div>
    </div>
  );
}

export default App;
