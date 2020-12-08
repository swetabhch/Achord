import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import ArtistInputForm from "./components/ArtistInputForm.js";
import Results from "./components/Results.js";
import SearchesDisplay from "./components/SearchesDisplay.js";

const StyledLink = styled.a`
  color: inherit;
`

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header role="banner">
              <section className="container-fluid layout">
                  <span className="title">
                      <img src="spotify_logo.png" className="logo" alt="Spotify Logo" />
                      <span className="verticalLine"></span>
                      ACHORD
                      <img src="achord-icon-updated.png" className="logo" alt="Achord Logo" />
                  </span>
                  <span className="subtitle">Connecting Your Favorite Artists</span>
                  <span id="login">
                    <StyledLink href="/">
                      <img id="github-logo" src="git-black.png" height="50px" alt="Github Logo" />
                      Home
                    </StyledLink>
                  </span> 
              </section>
          </header>
          
          <div className="artist-info">
              <span className="container-fluid layout artist-images">
                <Switch>
                  <Route exact path="/" component={ArtistInputForm} />
                  <Route exact path="/result" component={Results} />
                  <Route exact path="/all_searches" component={SearchesDisplay} />
                </Switch>
              </span>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;