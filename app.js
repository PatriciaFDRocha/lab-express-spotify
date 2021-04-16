require('dotenv').config();

const express = require('express');
const hbs = require('hbs')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

app.get('/', async (req, res) => {
    res.render('home');
})

app.get('/artist-search', async (req, res) => {
    //query parameter
    let artistName = req.query.theArtistName;

    let result = await spotifyApi.searchArtists(artistName);
        //console.log('The received data from the API: ', result.body);

    let artists = result.body.artists.items;

    // artists.forEach((artist)=> {
    //          console.log(artist);
    //      })

    res.render('artist-search-results', {artists})
});

app.get('/albums/:artistId', async (req, res, next) => {

    let artistAlbums = await spotifyApi.getArtistAlbums(req.params.artistId);

    //To find where albums are:
    //console.log(artistAlbums.body);
    //console.log(artistAlbums.body.items);
    //Passing info to front-end

    let albums = artistAlbums.body.items;

    res.render('albums', {albums});
});

app.get('/tracks/:albumsId', async (req, res) => {

    let viewTracks = await spotifyApi.getAlbumTracks(req.params.albumsId);

    let tracks = viewTracks.body.items;

    res.render('tracks', {tracks});
  
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
