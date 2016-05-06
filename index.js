"use strict"

// Get the modules we need
var restify = require("restify");
var request = require("request");
var hello = require("./hello");
var webhookGet = require("./webhook_get");
var webhookPost = require("./webhook_post");
global.quotes = [];
// FETCH QUOTES FROM THE SERVER
request({
url: 'https://api.myjson.com/bins/2m70k',
json: true
}, function(err, resp, body){
	if(!err && resp.statusCode === 200)
	{
		global.quotes = body.quotes;
	}
});




// YAAY! SERVER!!
var server = restify.createServer();

// Configure the server by adding some plugins
server.use(restify.queryParser());
server.use(restify.bodyParser());

// This is a test endpoint to see if all is going as planned
server.get("/hello/:name",hello);

// This is the endpoint which will be called
// When Facebook is trying to verify our bot
server.get("/webhook/",webhookGet);

// This is the endpoint which will be called
// when Facebook is sending us messages from the page
server.post("/webhook/",webhookPost);
// Start the server
// The Heroku environment will be assigning a port number once we deploy
// So we use process.env.PORT for Heroku
// For testing locally, we use port 8080
var port = process.env.PORT || 8080;
server.listen(port,function(){
	console.log('%s listening at %s', server.name, server.url);
});
