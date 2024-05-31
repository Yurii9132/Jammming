import React from "react";
import "./TrackList.css";
import Track from "../Track/Track";

function TrackList({ addTrack, searchResult }) {

  return (
    <div className="tracklist">
      {searchResult.map((track) => (
        <Track
          key={track.id}
          track={track}
          addTrack={addTrack}
        />
      ))}
    </div>
  );
}

export default TrackList;
