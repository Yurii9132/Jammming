import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, InputGroup, FormControl, Button } from "react-bootstrap";


function SearchBar({ searchInput, setSearchInput, handleSearchClick, handleKeyDown }) {
  return (
    <Container >
      <h2 className="searchBarHeader" style={{color: "#fff"}}>Search for a track</h2>
      <InputGroup className="mb-3">
        <FormControl
          size="lg"
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
          variant="primary"
          id="button-addon2"
          size="lg"
        >
          Search
        </Button>
      </InputGroup>
    </Container>
  );  
}

export default SearchBar;