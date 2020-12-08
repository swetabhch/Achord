# Achord
Achord is a web application that draws from Spotify data to show you the links between any artists a user enters! The app uses the Spotify Web API 
(more specifically, the spotify-web-api-js wrapper), with a React frontend and an Express backend interfaced with an SQL database. 
A user can specify the source artist and the target artist, and the app displays how the two are connected.

## Using the Application
Currently, Achord is not hosted on any other domain, so instead runs on a localhost. Running this requires downloading the folders, configuring .env files for
the respective API keys, and initializing these folders using yarn or npm. Running them by similar means will lead to the application being displayed at
localhost:3000. Required steps:
- Download folder, `cd` into `achord` and `express-server` and call `yarn init` (or the `npm` equivalent) in both.

## Known Bugs and Limitations
- The tracks connecting different artists and their associated images sometimes appear in an incorrect order if clicks are done too quickly in succession.
- Error-handling can be greatly improved, as the app currently crashes if artists without Spotify pages appear. This, however, should be rather rare.
- By nature of the task itself (and the Spotify API's rate limits), even searching within 3 degrees can take a lot of time (upto multiple minutes). However,
the "currently visiting" display is an attempt to add value to the user during that waiting time, as it illustrates just how wide a net an artist casts
within 3 degrees of separation.

## Associated Website
One doesn't exist yet, but this README will be updated once it will.
