import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import styled from "styled-components";
import Spotify from "spotify-web-api-js";
import { authorize, getCollabs } from "/Users/swetabhchangkakoti/Desktop/Code/achord_app/achord/src/utils/SpotifyUtils.js"

const axios = require("axios");
const spotifyApi = new Spotify();
require('dotenv').config();
authorize(spotifyApi);

// defining styled components for use in the rendered form

const CenteredDiv = styled.div`
    margin: 30px 0px;
    display: flex;
    flex-direction: column;
    justify-contents: space-evenly;
    align-items: center;
`

const StyledImage = styled.img`
    width: 250px;
    height: 250px;
    border: 0.1px solid #000000;
    border-radius: 100%;
    margin: 0px 30px 30px 30px;
`

const CenteredSpan = styled.span`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0px 30px;
`

const GreenDotSubmit = styled.input`
    margin: 0px 7.5px;
    height: 10px;
    width: 10px;
    border: 0.1px solid #1DB954;
    border-radius: 100%;
    background-color: #1DB954;
`

const ConnectSubmit = styled.input`
    border: 0.1px solid #1DB954;
    border-radius: 30px;
    background-color: #1DB954;
    color: white;
    font-family: "Lato", sans-serif;
    font-size: 20px;
    font-weight: 400;
    height: 60px;
    margin: 0px 10px;
`

const ArtistInputForm = (props) => {
    const [curr, modifier] = useState( 
        ['Enter artist 1 name', "https://cutewallpaper.org/21/white-screen-images/White-Screen-5-Seconds-YouTube.jpg", 
        "Enter artist 2 name", "https://cutewallpaper.org/21/white-screen-images/White-Screen-5-Seconds-YouTube.jpg",
        []]);

    let history = useHistory();

    useEffect(() => {
        //console.log("Functional component has mounted!");
        return axios({
            method: "GET",
            url: "http://localhost:5000",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            console.log(res.data.message)
        });
    })

    const moveToSearches = () => {
        history.push("/all_searches");
    }
    
    
    const getArtistImageURL = (artistName, val) => {
        spotifyApi.search(artistName, ["artist"], function (err, data) {
            if (err) {
                console.log(err);
            } else {
                if (val === 1) {
                    modifier([artistName, data.artists.items[0].images[0].url, curr[2], curr[3]], curr[4]);
                } else {
                    modifier([curr[0], curr[1], artistName, data.artists.items[0].images[0].url], curr[4]);
                }
            }
        });
    }

    // for the artist 1 image and name
    const handleNameClick1 = (event) => {
        console.log(event.target.form[0].value);
        getArtistImageURL(event.target.form[0].value, 1);
    }

    // for the artist 2 image and name
    const handleNameClick2 = (event) => {
        console.log(event.target.form[2].value);
        getArtistImageURL(event.target.form[2].value, 2);
    }

    // applies breadth-first-search, starting from currArtist and expanding outwards, fetching collabs
    // for each artist that appears as a co-artist with currArtist in a track
    async function searchAccumulator(currArtist, destArtist, visited, processed, path, trackPath, remDegree) {
        // display current progress on home page
        modifier([curr[0], curr[1], curr[2], curr[3], "Currently visiting (degree " + (3 - remDegree) + "): " + currArtist]);
        if (remDegree === 0) {
            return [false, [], []];
        } else {
            if (currArtist === destArtist) {
                return [true, path, trackPath];
            } else {
                let newTrackArtists = await getCollabs(currArtist, "name").then(
                    function (data) {
                        return data;
                    });
                if (newTrackArtists === "") {
                    return [false, [], []];
                }
                newTrackArtists.forEach((trackArtist) => {
                    if (!(processed.includes(trackArtist[1])) && !(visited.map((x) => {return x[0]}).includes(trackArtist[1]))) {
                        visited.push([trackArtist[1], remDegree - 1, path.concat(trackArtist[1]), trackPath.concat(trackArtist[0])]);
                    }
                })
                for (var i = 0; i < visited.length; i++) {
                    if (visited[i][0] === destArtist) {
                        return [true, path.concat(destArtist), trackPath.concat(visited[i][3])]
                    }
                }
                if (visited.length === 0) {
                    return [false, [], []];
                } else {
                    // establishing variables for next recursive call
                    let next = visited.shift();
                    let nextArtist = next[0];
                    let nextDegree = next[1];
                    let nextPath = next[2];
                    let nextTrackPath = next[3];
                    processed.push(nextArtist);
                    let res = await searchAccumulator(nextArtist, destArtist, visited, processed, nextPath, nextTrackPath, nextDegree).then(
                        function (data) {
                            return data;
                        });
                    // resetting currently visiting display
                    modifier([curr[0], curr[1], curr[2], curr[3], ""]);
                    return res;
                }
            }
        }
    }

    async function connectArtists(event) {
        event.preventDefault();
        let artist1 = event.target[0].value;
        let artist2 = event.target[2].value;
        let searchResult = await searchAccumulator(artist1, artist2, [], [artist1,], [artist1,], [], 3).then(
            function (data) {
                return data;
            });
        
        // send data from searchResult to SQL database in backend
        axios({
            method: "POST",
            url: "http://localhost:5000/add",
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                source: artist1,
                target: artist2,
                bool: searchResult[0],
                path: searchResult[1],
                trackPath: searchResult[2]
            } // history.push("/result") ensures redirection to results page after post completed
        }).then((response) => { console.log(response); history.push("/result"); }, (err) => {console.log(err)}); 
    }

    return (
        <CenteredDiv>
            <span className="container-fluid layout artist-images">
                <StyledImage src={curr[1]} />
                <StyledImage src={curr[3]} />
            </span>
            <form onSubmit={connectArtists}>
                <span className="container-fluid layout artist-images">
                        <CenteredSpan>
                            <input type="text" placeholder="Enter artist 1 name" />
                            <GreenDotSubmit onClick={handleNameClick1} />
                        </CenteredSpan>  
                    <CenteredSpan>
                        <input type="text" placeholder="Enter artist 2 name" />
                        <GreenDotSubmit onClick={handleNameClick2} />
                    </CenteredSpan>                  
                </span>
                <CenteredDiv>
                    <CenteredSpan>
                        <ConnectSubmit type="submit" value="CONNECT" />
                        <ConnectSubmit value="SEE ALL SEARCHES" onClick={moveToSearches}/>
                    </CenteredSpan>
                    <CenteredSpan>{curr[4]}</CenteredSpan>
                </CenteredDiv>
            </form>
        </CenteredDiv>
    )
}

export default ArtistInputForm;