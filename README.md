# liri_bot
Overview

LIRI is a command line node app that takes in parameters and gives you back data.

liri.js can take in one of the following commands:

* my-tweets
* spotify-this-song
* movie-this
* do-what-it-says

Commands

node liri.js my-tweets: 

This will show your last 20 tweets and when they were created at in your terminal/bash window.


node liri.js spotify-this-song '<song name here>'

This will show the following information about the song in your terminal/bash window
* Artist(s)
* The song's name
* A preview link of the song from Spotify
* The album that the song is from

node liri.js movie-this '<movie name here>'
  
This will output the following information to your terminal/bash window:
   * Title of the movie.
   * Year the movie came out.
   * IMDB Rating of the movie.
   * Rotten Tomatoes Rating of the movie.
   * Country where the movie was produced.
   * Language of the movie.
   * Plot of the movie.
   * Actors in the movie.

node liri.js do-what-it-says

Chooses a random action and media query to submit

Output is logged to log.txt.
