var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var http = require('http');

// serve home page
app.get('/', function(req, res) {
    console.log("Visitor to homepage.");
    res.send('Hi!');
});

app.get('/*', function(req, res) {

function onRequest(client_req, client_res) {
  console.log('serve: ' + client_req.url.substr(1));

  var options = {
    hostname: 'jakenelson.comxa.com',
    port: 80,
    path: client_req.url.substr(1),
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

onRequest(req, res);

});

app.listen(port, function() {
    console.log("File data microservice running at " + port)
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