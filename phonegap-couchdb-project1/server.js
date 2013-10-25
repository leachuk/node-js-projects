var express = require("express");
var app = express();
var redis = require("redis").createClient();
var requestHandlers = require("./requestHandlers");
var nodejsUrl = "http://localhost:5984";

 
//CORS Middleware
var allowCrossDomain = function(request,response,next){
	//console.log("processing access control");
	response.header("Access-Control-Allow-Origin", "*");//change this to specific host on prod. Check nodejs app.configure. www.backbonetutorials.com/cross-domain-sessions/
	response.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
}
app.configure(function(){	
	app.use(express.cookieParser());
	app.use(express.session({secret: 'blabla'}));
	app.use(express.bodyParser());
	app.use(allowCrossDomain);

});

//API Routes
/*
//replaced with Middleware config
app.all("/*", function(request,response,next){
	console.log("processing access control");
	response.header("Access-Control-Allow-Origin", "*");//change this to specific host on prod. Check nodejs app.configure. www.backbonetutorials.com/cross-domain-sessions/
	response.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});
*/

app.get("/test1/:get1", requestHandlers.test1);
app.post("/signup", requestHandlers.signupUser);


app.post('/api/user/signin', function (req, res) {
    console.log("Session:");
    console.log("Auth deets:"+ req.body.name + "," + req.body.password);
    
    var nano = require('nano')({ url : nodejsUrl});
    var	username = req.body.name;
    var	userpass = req.body.password;
//var username = "test4";
//var userpass = "test";
 //req.session.username = username;
 redis.set("username", username);
 redis.set("sid", req.session.id);

    nano.request({
            method: "POST",
            db: "_session",
            form: { name: username, password: userpass },
            content_type: "application/x-www-form-urlencoded; charset=utf-8"
        },
        function (err, body, headers) {
          //console.log(headers['set-cookie']);
            if (err) { res.send(err.reason); return; }
           
            //res.send('Logged in!');
            //res.send(headers['set-cookie']);
            res.send(body);
        });
});

app.get('/api/user/verify', function (req, res) {
	redis.get("username", function(err, reply){
		if (reply){
			var username = reply.toString();
			if (username){
				console.log(reply.toString());
				res.send(reply.toString());
			}
		}
	});
	redis.get("sid", function(err, reply){
		if (reply){
			var sid = reply.toString();
			if (sid){
				console.log(reply.toString());
				res.send(reply.toString());
			}
		}
	});
});

app.listen(8888);
console.log("Server has started.");