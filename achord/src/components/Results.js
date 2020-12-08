import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { authorize } from "../SpotifyUtils.js";
import Spotify from "spotify-web-api-js";

const spotifyApi = new Spotify();
authorize(spotifyApi);
const axios = require("axios");

const CenteredDiv = styled.div`
    margin: 30px 0px;
    display: flex;
    flex-direction: column;
    justify-contents: space-evenly;
    align-items: center;
`

const SmallerCenteredDiv = styled.div`
    margin: 15px 0px;
    display: flex;
    flex-direction: column;
    justify-contents: space-evenly;
    align-items: center;
    width: 200px;
`

const CenteredSpan = styled.span`
    display: flex;
    flex-direction: row;
    justify-contents: space-evenly;
    align-items: center;
    margin: 0px 30px;
`

const StyledImage = styled.img`
    width: 150px;
    height: 150px;
    border: 0.1px solid #000000;
    border-radius: 100%;
    margin: 0px 30px 30px 30px;
`

const SmallerStyledImage = styled.img`
    width: 100px;
    height: 100px;
    border: 0.1px solid #000000;
    border-radius: 100%;
    margin: 0px 30px 30px 5px;
`

const ResultsSubmit = styled.input`
    border: 0.1px solid #1DB954;
    border-radius: 30px;
    background-color: #1DB954;
    color: white;
    font-family: "Lato", sans-serif;
    font-size: 20px;
    font-weight: 400;
    height: 60px;
    width: 180px;
    margin: 0px 30px;
`

const StyledH2 = styled.h2`
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-size: 25px
    text-align: center;
`

const StyledP = styled.p`
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-size: 15px;
    text-align: center;
`

const Results = (props) => {
    const [successVars, modifier] = useState([-1, [], [], [], []]);
    let history = useHistory();
    useEffect(() => {
        return axios({
            method: "GET",
            url: "http://localhost:5000",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            console.log(res.data.message);
        });
    })

    const setupSuccessVars = () => {
        axios({
            method: "GET",
            url: "http://localhost:5000/result",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            var p = res.data[0].path.split(";"); 
            p.shift(); 
            var tp = res.data[0].trackPath.split(";"); 
            tp.shift(); 
            if (tp.length !== 1) {
                tp.shift(); 
            }
            modifier([res.data[0].success, p, [], tp, []]);
        });
    }
    
    const displayConnectStatus = () => {
        if (successVars[0] === 1) {
            return( <StyledH2>Yay! Connection successful! 💡</StyledH2> )
        } else if (successVars[0] === 0) {
            return( <StyledH2>Sorry! Could not find a connection within 3 degrees. 😅</StyledH2> )
        } else {
            return(<StyledH2>Click bottom-left to prepare results.</StyledH2> )
        }
    }

    // is associated with button used to see all past searches
    const disp = () => {
        history.push("/all_searches");
    }

    const handleClick = (event) => {
        var allNames = successVars[1];
        for (var i = 0; i < allNames.length; i++) {
            getArtistImageURL(allNames[i]);
        }
        var allTrackPaths = successVars[3];
        for (var j = 0; j < successVars[3].length; j++) {
            getTrackDetails(allTrackPaths[j]);
        }
    }

    const getTrackDetails = (trackID) => {
        spotifyApi.getTrack(trackID, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                let s = successVars[4];
                s.push([data.name, data.album.images[0].url]);
                modifier([successVars[0], successVars[1], successVars[2], successVars[3], s]);
            }
        });
    }

    const produceImages = () => {
        var imageList = [];
        var path = successVars[1];
        console.log(successVars);
        for (var i = 0; i < successVars[2].length; i++) {
            imageList.push(<CenteredDiv><StyledImage src={successVars[2][i]} /><StyledH2>{path[i]}</StyledH2></CenteredDiv>);
            if (i < successVars[4].length) {
                imageList.push(
                <SmallerCenteredDiv>
                    <SmallerStyledImage src={successVars[4][i][1]} /><StyledP>{successVars[4][i][0]}</StyledP>
                </SmallerCenteredDiv>);    
            } 
        }
        return ( 
        <CenteredSpan>
            { imageList }    
        </CenteredSpan> )
    }

    const getArtistImageURL = (artistName) => {
        spotifyApi.search(artistName, ["artist"], function (err, data) {
            if (err) {
                console.log(err);
            } else {
                let s = successVars[2];
                s.push(data.artists.items[0].images[0].url);
                modifier([successVars[0], successVars[1], s, successVars[3], []]);
            }
        });
    }

    return (
        <CenteredDiv>
            <CenteredSpan>{displayConnectStatus()}</CenteredSpan>
            {produceImages()}
            <form>
                <CenteredSpan>
                    <ResultsSubmit type="button" value="See Results!" onClick={setupSuccessVars} />
                    <ResultsSubmit type="button" value="See Path Tracks!" onClick={handleClick} />
                    <ResultsSubmit type="button" value="See All Searches!" onClick={disp} />
                </CenteredSpan>
            </form>
        </CenteredDiv>
    )
}

export default Results;