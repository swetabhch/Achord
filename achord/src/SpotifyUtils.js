import Spotify from "spotify-web-api-js";

const axios = require("axios");
const querystring = require("querystring");
require('dotenv').config();
const spotifyApi = new Spotify();

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const API_URl = 'https://accounts.spotify.com/api/token';

// automates the client credentials authorization flow for the Spotify Web API
export async function authorize(apiHandler) {
    const headers = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
            username: CLIENT_ID,
            password: CLIENT_SECRET,
        },
    };
    const data = {
        grant_type: 'client_credentials',
    };
    const token = await axios.post(
            API_URl,
            querystring.stringify(data),
            headers
        ).then((res) => {
            return res.data.access_token;
        }).catch((err) => { console.log(err) });
    apiHandler.setAccessToken(token);
}

authorize(spotifyApi);

// consumes an artist name and returns a promise, leading to the data obtained by searching for that artist
const collectArtistID = (artistName) => {
    return spotifyApi.search(artistName, ["artist"]).then(
         function (data) {
            return data;
        },
        function (err) {
            console.log(err);
        }
    );
}

// consumes an artist ID and returns a promise, leading to data representing an array of that artist's albums
const collectArtistAlbums = (artistID) => {
    return spotifyApi.getArtistAlbums(artistID).then(
        function (data) {
            return data;
        }, 
        function (err) {
            console.log(err);
        }
    )
}

// consumes an array of album IDs and returns a promise, leading to data representing the albums obtained from these IDs
const collectAlbumsTracks = (albumIDs) => {
    return spotifyApi.getAlbums(albumIDs).then(
        function (data) {
            return data;
        },
        function (err) {
            console.log(err);
        }
    )
}

// consumes an artist name and a string indicating whether the user wants output with artist names or IDs
// returns an array containing two-element arrays with track IDs and either artist names or IDs depending on 'options'
async function getCollabData(artistName, option) {
    let artistOneID = await collectArtistID(artistName).then(
        function (data) {
            if (typeof data.artists.items[0].id === 'string') {
                return data.artists.items[0].id;
            } else {
                return "";
            }
        },
        function (err) {
            console.log(err);
        });
    if (artistOneID === "") {
        return "";
    }
    let artistOneAlbums = await collectArtistAlbums(artistOneID).then(
        function (data) {
            return data;
        });
    let artistOneAlbumIDs = artistOneAlbums.items.map((x) => {return x.id;});
    let artistOneAllTracks = await collectAlbumsTracks(artistOneAlbumIDs).then(
        function (data) {
            return data.albums.map((x) => {return x.tracks.items;});
        });
    let artistOneAllCredits = artistOneAllTracks.map((tracks) => {return tracks.map((x) => {return x.artists; }); });
    var artistOneTrackNames = [];
    artistOneAllTracks.forEach((tracks) => { tracks.forEach((x) => { artistOneTrackNames.push(x.name); }); });
    var artistOneTrackIDs = [];
    artistOneAllTracks.forEach((tracks) => { tracks.forEach((x) => { artistOneTrackIDs.push(x.id); }); });
    var artistOneArtistXYs = [];
    artistOneAllCredits.forEach(row => {
        row.forEach(element => {
            artistOneArtistXYs.push(element);
        });
    });
    let artistOneArtistIDs = artistOneArtistXYs.map((a_s) => {
        var arr = [];
        a_s.forEach(a => {
            if (a.id !== artistOneID) {
                arr.push(a.id);
            } 
        });
        return arr;
    });
    let artistOneArtistNames = artistOneArtistXYs.map((a_s) => {
        var arr = [];
        a_s.forEach(a => {
            if (a.id !== artistOneID) {
                arr.push(a.name);
            } 
        });
        return arr;
    });

    var ret = [];
    if (option === "name") {
        for (var i = 0; i < artistOneTrackNames.length; i++) {
            ret.push([artistOneTrackIDs[i], artistOneArtistNames[i]]);
        }    
    } 
    if (option === "id") {
        for (var j = 0; i < artistOneTrackIDs.length; j++) {
            ret.push([artistOneTrackIDs[j], artistOneArtistIDs[j]]);
        }              
    }
    return ret;
}

// consumes the output of getCollabData (an array of two-element arrays with track IDs and artist names/IDs) and returns
// an array containing unique artist collaborations
const collectCollabArtists = (zippedTracksArtists) => {
    var artistTrackList = [];
    zippedTracksArtists.forEach((x) => { x[1].forEach((y) => { artistTrackList.push([x[0], y]); }); });
    var uniqueArtistList = [];
    var uniqueTrackArtistList = [];
    artistTrackList.forEach((trackArtist) => {
        if (!(uniqueArtistList.includes(trackArtist[1]))) {
            uniqueArtistList.push(trackArtist[1]);
            uniqueTrackArtistList.push(trackArtist)
        }
    });
    return uniqueTrackArtistList;
}

// consumes an artist name and composes the getCollabData and collectCollabArtists functions, returning the overall output
export async function getCollabs(artistName, option) {
    let collabData = await getCollabData(artistName, option).then(
        function (data) {
            return data;
        },
        function (err) {
            return "";
        });
    return collectCollabArtists(collabData);
}