// import { render } from "@testing-library/react";
import React from "react";
import "./Track.css";
// import TrackList from "../TrackList/TrackList";

function Track({ track, addTrack, removeTrack, isRemoval}) {

  const handleAddClick = () => {
    addTrack(track);
  };

  const handleRemoveClick = () => {
    removeTrack(track);
  };

  const renderAction = () => {
    if (isRemoval) {
      return <button onClick={handleRemoveClick} className="remove">&ndash;</button>
    } else {
      return <button onClick={handleAddClick} className="add">+</button>
    }
  }

  return (
    <div className="track" key={track.id}>
      <img src={track.album.images[2].url} alt="album cover" />
      <div>
        <h3>{track.name}</h3>
        <p>
          {track.album.name} | {track.artists[0].name}
        </p>
      </div>
      {renderAction()}
    </div>
  );
}

export default Track;

