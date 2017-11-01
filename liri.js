// Nice job defining your global vars at the top of the file 👌
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs') // try to stay consistent one way or the other with your semi-colon use 😬
var keys = require('./keys.js')

var selection = process.argv[2];
// Nice use of slice!
var query = process.argv.slice(3).join(' ')

/*This will show the last 20 tweets and when they were created.*/

function myTweets() {
	var twitter_client = new Twitter(keys.twitterKeys)
	var params = {screen_name: 'fonzatron'};
	//Get tweets from my account
	twitter_client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			tweets.forEach(function(item) {
				//For each tweet in the response, create a status dictionary
				// Indentation's a little inconsistent here
	            let status = {name : item.user.name, 
	            	text : item.text,
	            	created  : item.created_at,
	            	url : item.url
	            }
	            //Print text
	            from = "From: "+status.name+" at "+status.created
	            message = status.text.toString()+'\n'
				console.log(from)
				console.log(message)
	            //log out text
	            fs.appendFile('log.txt', '\n'+from+'\n'+message);

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
	var searchQuery	= {type: 'track', query: songName, limit: 10}
	//If there was no value provided, get this specific track ID for "The Sign"
	if (songName === 'The Sign') {
		spotify_client
  			.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
  			.then(function(data) {
    			console.log('Track Name', data.name)
	  			console.log('Album Name: '+ data.album.name)
	  			console.log('Artist Name: '+ data.artists[0].name)
	  			console.log('Preview URL: ' + data.preview_url+'\n') 
  		})
  		.catch(function(err) {
    	console.error('Error occurred: ' + err); 
  		}); 
	}
	//Otherwise proceed as normal
	else {
		spotify_client.search(searchQuery, function(err, data) {
	  		if (err) {
	    		return console.log('Error occurred: ' + err);
	  		}
	  		//Takes the response from Spotify and selects the desired information for printing 
	  		data.tracks.items.forEach(function(item) {
	  			// You should declare these variables with the var keyword so they stay within
	  			// this functional scope.
	  			track = 'Track Name: '+ item.name
	  			album = 'Album Name: '+ item.album.name
	  			artist = 'Artist Name: '+ item.artists[0].name
	  			url = 'Preview URL: ' + item.preview_url+'\n'
	  			console.log(track+'\n'+album+'\n'+artist+'\n'+url)
	  			//log out text
            	fs.appendFile('log.txt', '\n'+track+'\n'+album+'\n'+artist+'\n'+url);
			})

		})
	}
}

/*Given a movie title, it will search the OMDB API for a movie with matching title and
return the JSON object which is parsed. Selected information is displayed. */

function movie(movieName) {
	const omdb = keys.omdbKeys.id	
	request('http://www.omdbapi.com/?apikey='+omdb+"&type=movie&t="+movieName, 
	function(error, response, body) {
		if (error) {
			return console.log(error);
		}
		let json = JSON.parse(body)
		// Same note here about declaring variables with var
		title = '\nTitle: '+json.Title
		year = 'Year: '+json.Year
		rating1 = 'Rating from '+json.Ratings[0].Source+": "+json.Ratings[0].Value
		rating2 = 'Rating from '+json.Ratings[1].Source+": "+json.Ratings[1].Value
		country = 'Country of Origin: '+json.Country
		language = 'Language: '+json.Language
		actors = 'Actors: '+json.Actors
		plot = "Plot: "+json.Plot+"\n"
		console.log(title+'\n'+year+'\n'+rating1+'\n'+rating2+'\n'+country+'\n'+language+'\n'+actors+'\n'+plot)
		fs.appendFile('log.txt', '\n'+title+'\n'+year+'\n'+rating1+'\n'+rating2+'\n'+country+'\n'+language+'\n'+actors+'\n'+plot);
	});
}

function doThis() {
	/*Reminder, add ability to grab random lines for additional functions
	ex. var lines = data.split('\n');
    do something with - lines[Math.floor(Math.random()*lines.length)];*/
	fs.readFile('./random.txt', 'utf8', function(err, data) {
		if (err) {
			return console.error(err);
		}
		selection = data.split(',')[0];
		query = data.split(',')[1];
		return menu(selection, query);
	})
}

function menu(selection, query) {
	fs.appendFile('log.txt',"\n"+selection+" "+query+"\n")
	switch (selection) {

		case "my-tweets":
			myTweets();
			break;

		case "spotify-this-song":
			// another way to default would be:
			// query = query || 'The Sign'
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
