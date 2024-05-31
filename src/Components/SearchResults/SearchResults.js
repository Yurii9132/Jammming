import React from "react";
import Tracklist from "../TrackList/TrackList";
import "./SearchResults.css";

function SearchResults({ searchResult, addTrack}) {
  return (
    <div className="searchResult">
      <h2>Search Result</h2>
      <Tracklist addTrack={addTrack} searchResult={searchResult}/>
    </div>
  );
}

export default SearchResults;