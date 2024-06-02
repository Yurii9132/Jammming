import React from "react";
import "./Playlist.css";
import Track from "../Track/Track";

function Playlist({ playlist, removeTrack, playlistName, setPlaylistName, onSavePlaylist, showSuccess }) {
  return (
    <div className="playlist">
      <form onSubmit={(e) => {
        e.preventDefault();
        onSavePlaylist();
      }}>
        <input type="text"
        value={playlistName} 
        onChange={e => setPlaylistName(e.target.value)}/>
        <button value="Submit" className="save">Save to Spotify</button>
      </form>
      <div className="playlistList">
        {playlist.map((track) => (
          <Track
          key={track.id}
          track={track}
          removeTrack={removeTrack}
          isRemoval={true} 
        />
        ))}
      </div>
      {showSuccess && (
        <h2 className="alert alert-success" role="alert">
          Playlist saved successfully!
        </h2>
      )}
    </div>
  );
}

export default Playlist;