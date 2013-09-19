var express = require("express");
var requestHandlers = require("./requestHandlers");

var app = express();


//CORS Middleware
var allowCrossDomain = function(request,response,next){
	//console.log("processing access control");
	response.header("Access-Control-Allow-Origin", "*");//change this to specific host on prod. Check nodejs app.configure. www.backbonetutorials.com/cross-domain-sessions/
	response.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
}
app.configure(function(){
	app.use(allowCrossDomain);
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

app.listen(8888);
console.log("Server has started.");