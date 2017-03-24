var cheerio = require('cheerio');
var request = require('request');
var express = require('express');
var replaceall = require('replaceall');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var app = express();

app.use('/assets', express.static(__dirname + '/assets'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.get('/', function(req, res){
	console.log('working');
	res.sendFile(path.join(__dirname + '/index.html'));
});

// var baseUrl = 'http://dl.sv-mov.in/';
// var search_temp = 'american';

// var searchString = prepareData(search_temp);

app.get('/title', function(req, res){
	requestData(baseUrl);
	// res.status(200).send(foundFolders);
});

app.post('/title', function(req, res){
	console.log(req.body);
	baseUrl = req.body.website;
	searchString = req.body.searchstring;
	searchString = prepareData(searchString);
	requestData(baseUrl);
	// setTimeout(function(){
	// 	if(foundFolders.length!=0){
	// 		res.status(200).send(foundPaths);
	// 	} else{
	// 		res.status(200).send("No Data Found");
	// 	}
	// }, 10000);
	var lastdepth=-1;
	interval = setInterval(function(){
		if(depth == lastdepth){
			if(foundPaths.length!=0){
				res.status(200).send(foundPaths);
			} else{
				res.status(200).send("No Data Found");
			}
			clearInterval(interval);
		}
		lastdepth = depth;
	}, 1500);
});

var foundFolders = [];
var foundPaths = [];


function requestData(link){
	request(link, function(err, response, html){
		if(!err){
			parsePage(html, link);
		}
	});
}

// can use setInterval for determing end of seaching

var depth=0;

function parsePage(html, link){
	var $ = cheerio.load(html);
	var data = $(this);

	$('a').each(function(){
		var data = $(this).attr('href');
		if(data){
			match(data, link);
		}

		if(data[data.length - 1] === '/' && 
				data[data.length - 2] != '.'){
			var newUrl = link + data;
			requestData(newUrl);
		}
	});
	depth++;
}

function match(str, link){
	var temp = prepareData(str);

	if(temp.indexOf(searchString) >= 0 &&
		!foundFolders.includes(temp)){
			foundFolders.push(temp);
			foundPaths.push(link + temp);
			console.log('Found: ' + link + temp);
			saveData(link + temp);
	}	
}

function prepareData(str){
	var temp = str.toLowerCase();
	temp = temp.trim();
	temp = replaceall('.', '', temp);
	temp = replaceall('%20', '', temp);
	temp = replaceall(' ', '', temp);
	temp = replaceall('(', '', temp);
	temp = replaceall(')', '', temp);
	temp = replaceall('-', '', temp);
	return temp;
}

function saveData(str){
	fs.appendFile('answer.txt', str + '\n', function(err){
		//domething
	});
}

app.listen(process.env.PORT || 3000);



