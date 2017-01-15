var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var http = require('http');
// ******** remove between this and bottom line if issue ********
var path = require('path');
// make express look in public dir for assets (css/js/img/etc)
app.use('/public', express.static(path.join(__dirname, '/public')));

app.set('view engine', 'ejs');


// ******** remove between this and top line if issue ********

var i = 0;

// serve home page
app.get('/', function(req, res) {
    console.log("Visitor to homepage.");
    res.render('index');
    res.end();
});


var base = "";
var origHost = "";

// GET proxied URL- this happens for each resource
app.get('/*', function(req, res) {
// console.log("starting proxy...");

// split baseUrl based on whether tailing '/' is in URL
if (base == "") {
if (req.url.slice(-1) == "/") {
var baseUrl = req.url.split("http://").pop().slice(0, -1);
console.log("baseUrl is " + baseUrl);
} else {
	var baseUrl = req.url.split("http://").pop();
}
}


function onRequest(client_req, client_res) {

	console.log('at beginning of onRequest, base is ' + base +
		' and origHost is ' + origHost);

// this if statement only executes on first visit to unique host
if (i == 0) {
  var options = {
    hostname: baseUrl,
    port: 80,
    path: base + client_req.url.substr(1),
    method: 'GET'
  };
  console.log("i = 0");
  base = client_req.url.substr(1).slice(0, -1);
  origHost = base.split("http://").pop();
  console.log(i + ": origHost is '" + origHost+ "' and base is '" + base+ "'.");
  i++;
}

// executes if still at page from same host
else if (i > 0 && client_req.url.substr(1).indexOf('url?q') == -1) {
    options = {
    hostname: origHost,
    port: 80,
    path: base + '/' + client_req.url.substr(1),
    method: 'GET'
  };	
  console.log(i + ": " + client_req.url);
  i++;
}

// executes if host path has changed
else {
	i = 0;
	base = 'http://' + client_req.url.substr(1).slice(0, -1).split('//').pop().split('/').shift();
  	origHost = base.split("http://").pop().split('url?q=').pop();
  	console.log(i + ": origHost is '"+origHost+"' and base is '" + base+ "'.");
  	    options = {
  		hostname: origHost,
  		port: 80,
  		path: client_req.url.substr(1).split('url?q=').pop(),
  		method: 'GET'
  	};
  	console.log('Redirecting to ' + 
  		client_req.url.substr(1).split('url?q=').pop());
}

  var proxy = http.request(options, function (res) {
    res.pipe(client_res, {
      end: true
    });
  });

  client_req.pipe(proxy, {
    end: true
  });
}

onRequest(req, res);
});


// get page source code
app.get('/src/*', function(req, res) {
var options = {
  host: "www.google.com",
  port: 80,
  path: "http://www.google.com/",
  headers: {
    Host: "www.google.com"
  }
};

http.get(options, function(res) {
  // console.log(res);
  res.pipe(process.stdout);
});
});



app.listen(port, function() {
    console.log("Proxy service running at " + port)
});

/*

function onRequest(client_req, client_res) {
	console.log ('serve: ' + client_req.url);

	var options = {
		hostname: 'www.jakenelson.comxa.com',
		port: 80,
		path: client_req.url,
		method: 'GET'
	};

	var proxy = http.request(options, function (res) {
		res.pipe(client_res, {
			end: true
		});
	});

	client_req.pipe(proxy, {
		end: true
	});
}

*/