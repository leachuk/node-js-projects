var express = require("express");
var app = express();
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
	app.use(allowCrossDomain);
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'blabla' }));
	app.use(express.bodyParser());
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
    console.log("Session:" + req.session);
    console.log("Auth deets:"+ req.body.name + "," + req.body.password);
    console.log("Cookie deets:"+ req.cookies['AuthSession']);
    
    /*
    var auth = req.cookies['AuthSession'],
      	nano;

    if (!auth) { res.send(401); return; }
	nano = require('nano')({ url : nodejsUrl, cookie: 'AuthSession=' + auth }),
	username = req.body.name,
	userpass = req.body.password;
    */
    var nano = require('nano')({ url : nodejsUrl});
    var	username = req.body.name;
    var	userpass = req.body.password;
    nano.request({
            method: "POST",
            db: "_session",
            form: { name: username, password: userpass },
            content_type: "application/x-www-form-urlencoded; charset=utf-8"
        },
        function (err, body, headers) {
          console.log(headers);
            if (err) { res.send(err.reason); return; }

            res.send('Logged in!');
        });
});


app.listen(8888);
console.log("Server has started.");