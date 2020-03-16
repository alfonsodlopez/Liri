var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs')
var keys = require('./keys.js')

var selection = process.argv[2];
var query = process.argv.slice(3).join(' ')


function logger(message) {
	fs.appendFile('log.txt', message, (err) => {
		if (err) throw err;
		console.log(message)
	});
}

/*This will show the last 20 tweets and when they were created.*/

function myTweets() {
	var twitter_client = new Twitter(keys.twitterKeys)
	var params = { screen_name: 'alfonsodlopez' };
	//Get tweets from my account
	twitter_client.get('statuses/user_timeline', params, function (error, tweets, response) {
		if (error) {
			console.log(error)
		}
		else {
			console.log("Grabbing Tweets")
			tweets.forEach(function (item) {
				//For each tweet in the response, create a status dictionary
				let status = {
					name: item.user.name,
					text: item.text,
					created: item.created_at,
					url: item.url
				}
				//Print text
				from = "From: " + status.name + " at " + status.created
				message = status.text.toString() + '\n'
				let tweet = `${from}\n${message}`
				//log out text
				logger(tweet)
			});
		}
	});
}

/*node liri.js spotify-this-song '<song name here>'
- This will show the following information about the song
- Artist(s)
- The song's name
- A preview link of the song from Spotify
- The album that the song is from
- If no song is provided then your program will default to "The Sign" by Ace of Base.*/

function spotify(songName) {
	var spotify_client = new Spotify(keys.spotifyKeys)
	var searchQuery = { type: 'track', query: songName, limit: 10 }
	//If there was no value provided, get this specific track ID for "The Sign"
	if (songName === 'The Sign') {
		spotify_client
			.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
			.then(function (data) {
				console.log('Track Name', data.name)
				console.log('Album Name: ' + data.album.name)
				console.log('Artist Name: ' + data.artists[0].name)
				console.log('Preview URL: ' + data.preview_url + '\n')
			})
			.catch(function (err) {
				console.error('Error occurred: ' + err);
			});
	}
	//Otherwise proceed as normal
	else {
		spotify_client.search(searchQuery, function (err, data) {
			if (err) {
				return console.log('Error occurred: ' + err);
			}
			//Takes the response from Spotify and selects the desired information for printing 
			data.tracks.items.forEach(function (item) {
				track = 'Track Name: ' + item.name
				album = 'Album Name: ' + item.album.name
				artist = 'Artist Name: ' + item.artists[0].name
				url = 'Preview URL: ' + item.preview_url + '\n'
				// Log out text
				let message = `${track}\n${album}\n${artist}\n${url}`
				logger(message)
			})

		})
	}
}

/*Given a movie title, it will search the OMDB API for a movie with matching title and
return the JSON object which is parsed. Selected information is displayed. */

function movie(movieName) {
	let rating1
	let rating2
	let ratings
	const omdb = keys.omdbKeys.id
	request('http://www.omdbapi.com/?apikey=' + omdb + "&type=movie&t=" + movieName,
		function (error, response, body) {
			if (error) {
				return console.log(error);
			}
			let json = JSON.parse(body)
			title = 'Title: ' + json.Title
			year = 'Year: ' + json.Year
			json.Ratings[0] !== undefined ? rating1 = 'Rating from ' + json.Ratings[0].Source + ": " + json.Ratings[0].Value
				: rating1 = '';
			json.Ratings[1] !== undefined ? rating2 = 'Rating from ' + json.Ratings[1].Source + ": " + json.Ratings[1].Value
				: rating2 = '';
			(rating1 || rating2) ? ratings = `${rating1}\n${rating2}\n` : ratings = ''
			country = 'Country of Origin: ' + json.Country
			language = 'Language: ' + json.Language
			actors = 'Actors: ' + json.Actors
			plot = "Plot: " + json.Plot + "\n"
			let message = `${title}\n${year}\n${ratings}${country}\n${language}\n${actors}\n${plot}`
			logger(message)
		})
}

function doThis() {
	/*Reminder, add ability to grab random lines for additional functions
	ex. var lines = data.split('\n');
	do something with - lines[Math.floor(Math.random()*lines.length)];*/
	fs.readFile('./random.txt', 'utf8', function (err, data) {
		if (err) {
			return console.error(err);
		}
		selection = data.split(',')[0];
		query = data.split(',')[1];
		return menu(selection, query);
	})
}

function menu(selection, query) {
	let log = `\n${selection} ${query}\n`
	logger(log)
	switch (selection) {

		case "my-tweets":
			myTweets();
			break;

		case "spotify-this-song":
			if (query === '' || query === null) {
				query = "The Sign"
			}
			spotify(query);
			break;

		case "movie-this":
			if (query === '' || query === null) {
				query = "Mr. Nobody"
			}
			movie(query);
			break;

		case "do-what-it-says":
			doThis();
			break;
	}
}

menu(selection, query)
