//rebecca (marks) leopold, 2016
// // twitter.com/emojiMountain
// thx Dan Shiffman & Rune Madeson

//various things you need to make the twitter module go
var Twit = require('twit'); //import
var config = require('./config.js'); //get dev data
var T = new Twit(config); //connect to twitter

//sometimes mountains look purple other time blue
var blue = ["🌸", "💜","🍆","🍇", "👾","🔮","👿",'🌷','😈', "♎️", '🆔','🚺', "🐳", "🐬", "🐟", "🌀", "🌐", "🐋🏿", "🐠", "🗻","💧","💦","🌊", "💧",'🔵',"💙",'🎨','🎵','🎽','🎠','🚙','🛃','🛅','🌃','🌇','📪','📘','🚭','🔂',"🤖",'🆕','🆗','🆙','🚹', "💩", "👍🏽","🙏🏿","🖖", "👀","👁","😮","😜","🤔","😍","😞","😶","👤","👥","💍","🏈","🏀","🎼","💻","🖥","💾","📝"];

//green things come from the ground, mts are made of ground
var green = [ "💚", "🌱","🌲","🌳","🌴","🌵","🌿","🍀","🌾","🍃","🐉","🐲","🐊","🐍","🐢","🐸","🐛","🌍","🌎","🌏","🍏","🍐","🍡","🎄","🎍","🎾","⛳️","♻️","😡","💀","☠️","👽","👄","💋","👣","🌂","👟","👓","🐡","🐜","🐞","🦀","🐽","🐭","🐤","🍎","🍊","🍉","☕️","🌶","🍕","🍔","🍕","🎲","🏳","💛","‼️","📎","🗿","📧","📰","📒","🔎","⅋","𝛟","ϴ"];

// //round things are in the sky
var moons = ["💿","🌙","🌔","🌕","🌓","🌒","🌑",'🌖','🌗','🌘','🌞',"🌜",'🌛','📀','🚫','⛔️','💭','💬','⭕️','⚪️','⚫️','🔴','🔵','🕐','🕔','🕥', '🕞','®','🌀','©','🚷','📵','🔎','💣','🔮','💡','🎯','🎱'];

//will search twitter for following words
var phrase = ['mountain','🗻','🌊'];
var regexPhrase = [/mountain/, /🗻/,/🌊/];

//make this bot run every hour
setInterval(emojiMtGo, 60*60*1000);

function emojiMtGo() {

	//every time program run, pick a string to query
	var ourRandom = Math.floor(Math.random()*3)
	var tweetPhrase = phrase[ourRandom];
	var filterPhrase = regexPhrase[ourRandom];

	// console.log(tweetPhrase);
	console.log(filterPhrase);

	var newyork = '-74,40,-73,41';
	//variable for individual user tweets

	var stream = T.stream('statuses/filter', { track: tweetPhrase, locations: newyork });

	//
	function makeMountainString() {

		var emojis = [
			[' ', ' ', ' ', ' ', ' ', ' '],
			[' ', ' ', ' ', ' ', ' ', ' '],
			[' ', ' ', ' ', ' ', ' ', ' '],
			[' ', ' ', ' ', ' ', ' ', ' '],
			[' ', ' ', ' ', ' ', ' ', ' '],
			[' ', ' ', ' ', ' ', ' ', ' '],
			[' ', ' ', ' ', ' ', ' ', ' ']

		];

//Pull one random emoji from each of the arrays above
		var moon = moons[Math.floor(Math.random()*moons.length - 1 )];
		var mt1 = blue[Math.floor(Math.random()*blue.length - 1 )];
		var mt2 = green[Math.floor(Math.random()*green.length - 1 )];


		//some of this math needs to be worked on. Apologies!
		var midMtIndex = Math.ceil(Math.random() * 5);
		// var midMtIndex2 = midMtIndex + 2;
		var mountainHeight =  2 + Math.ceil(Math.random() * 4);
		var mountainHeight2 = 2 + Math.ceil(Math.random() * 3);//

		//insert emojis at random into the black grid
		//Mountain 1, big mountain
		for (var row = 0; row < mountainHeight2; row ++) {
				var yshift = 6 - mountainHeight2;
				for (var col = 0; col < row + 1; col++) {
					var xshift = midMtIndex - row;
					emojis[row + yshift][col + xshift] = mt2;
			}
		}
		//Mountain 2, smaller mountain
		for (var row = 0; row < mountainHeight; row ++) {
				var yshift = 6 - mountainHeight;
				for (var col = 0; col < row + 1; col++) {
				var xshift = 1 + (midMtIndex - row);
				emojis[row + yshift][col + xshift] = mt1;
			}
	}
	//create the string of emojis to tweet
	//hard code a moon into the 00 index as twitter needs some character there for some reason. Also hard code a new line at the end of each array other wise it will appear more like a really long line of emojis rather than an image
		var twitterString = '';
		for(var i = 0; i < emojis.length; i++) {
			emojis[0][0] = moon;
			emojis[i][9] = "\n";

			twitterString += emojis[i].join(' ');

		}

		return twitterString

	}

//tune into the tweeter stream, then run get tweet.
	stream.on('tweet', gotTweet);

	function gotTweet(tweet) {
		var rawTweets = tweet.text;

		if (filterPhrase.test(rawTweets)){
			var screenNames = tweet.user.screen_name;
		//like the post
			T.post('favorites/create', { id: tweet.id_str}, tweeted);
		//tweet the random mountain configuration
			T.post('statuses/update', { status:	makeMountainString()+ " " + " " + "---" + " " + "Mt." + " " + screenNames + " " + "---"}, tweeted);

			// console.log(rawTweets + ":" + screenNames);
			// console.log(makeMountainString() + " " + "Mt." + screenNames);

			// THIS IS THE TWEET FUNCTION
				function tweeted(err, data, response) {

					if (err) {
						console.log("Error:" + err.message);

					} else {
						console.log('success' + ' ' + data.text);

					}
				}

		}
	}
}
