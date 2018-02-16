require("dotenv").config();


var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
var userInput = process.argv; // array

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//console.log("keys", keys);


if (userInput[2] === "my-tweets") {
    // when true run get tweets function which uses twitter package
    getTweets();
} else if (userInput[2] === "spotify-this-song") {
    // console.log("looks like spotify")
    spotifySong(process.argv[3]);
} else if (userInput[2] === "movie-this") {
    movieSearch()

} 
else if (userInput[2] === 'do-what-it-says') {
    doWhatItSays();
}
else {
    console.log("Sorry, there's an error.");
}


/*
my-tweets  
userInput[3] === ||
""
undefined
*/

function getTweets() {

    var query = "";

    if (userInput[3] === "" || userInput[3] === undefined) {
        console.log("\noooooooo man yoy forgot to add your twitter handle. Here is my favorite DavidBowieReal")
        query = "DavidBowieReal";
    } else if (userInput.length - 3 > 1) {

        // join the index after 2 of our userInput so there is not a space between characters
        var arr = [];
        for (var i = 3; i < userInput.length; i++) {
            arr.push(userInput[i]);
        }
        query = arr.join("");
    } else {
        query = userInput[3]
    }
    //console.log(query)
    var params = { screen_name: query };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log(tweets);
            for (var i = 0; i < 20; i++) {
                console.log("\n#######################################")
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
                console.log("#######################################")
            }
        } else {
            //console.log("error",error);
            console.log("\n#######################################")
            console.log("uh oh, something went wrong try again!")
            console.log("#######################################")
        }
    });
}




function spotifySong(songName) {
    spotify.search({ type: 'track', query: songName }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            console.log("1", data.tracks.items[0].artists[0].name);
            console.log("2", data.tracks.items[0].name);
            console.log("3", data.tracks.items[0].href);
            console.log("4", data.tracks.items[0].album.name);
            //console.log(data.tracks.items[0]); 
        });
}


    function movieSearch() {
        var nodeArgs = process.argv;
        var movieName = "";

        for (var i = 3; i < nodeArgs.length; i++) {

            if (i > 3 && i < nodeArgs.length) {

                movieName = movieName + "+" + nodeArgs[i];

            } else {

                movieName += nodeArgs[i];

            }
        }

        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
        console.log(queryUrl)

        request(queryUrl, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                // console.log(body)
                console.log(JSON.parse(body).Title);
                console.log(JSON.parse(body).Year);
                console.log(JSON.parse(body).imdbRating);
                console.log(JSON.parse(body).Ratings[1].Value);
                console.log(JSON.parse(body).Country);
                console.log(JSON.parse(body).Language);
                console.log(JSON.parse(body).Plot);
                console.log(JSON.parse(body).Actors);

            }
        });

    }

    function doWhatItSays() {
        fs.readFile("./random.txt", "utf8", function(err, body){
            if ( err === null ) {
                
                var content = body.split(",");

                if(content[0] === 'spotify-this-song') {
                    spotifySong(content[1]);
                }
            } else {
                console.log(err);
            }
        });
    }









