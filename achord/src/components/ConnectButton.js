import React, { Component } from "react";
import styled from "styled-components";
// import Spotify from "spotify-web-api-js";

const StyledButton = styled.button`
    border: 0.1px solid #1DB954;
    border-radius: 30px;
    background-color: #1DB954;
    color: white;
    font-family: "Lato", sans-serif;
    font-size: 20px;
    font-weight: 400;
    height: 60px;
`

class SaveButton extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  submit = () => {
    this.props.handleSave();
  };

  render() {
    return (
      <StyledButton type="button" onClick={this.submit}>
        CONNECT
      </StyledButton>
    );
  }
}

export default SaveButton;