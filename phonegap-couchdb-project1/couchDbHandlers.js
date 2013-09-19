var couch = require("nano")("http://admin:welcome1@localhost:5984");

function createNewUserDatabase(dbname,useremail,userpassword,response){
	console.log("createNewUserDatabase: dbname["+ dbname +"], useremail["+ useremail +"], userpassword["+ userpassword +"]");
	//When a user signs up, create a new database for them and grant them r/w access
	console.log()
	//create db
	couch.db.create("dbname", function(error, body, headers){
		if (error) {
			console.log(error.message);
			return response.send(error.message, error["status-code"]);
		}
		console.log(body);
		response.send(body, 200);
	});
	
}

exports.createNewUserDatabase = createNewUserDatabase;