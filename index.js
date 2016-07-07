var express=require('express');
var app=express();
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://'+process.env.IP+':27017/data';

var port= process.env.PORT || 3000;

app.use(bodyParser.json());
app.post('/insert',function(req,res){
	 var body=req.body;
	 
	 // Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);

    // do some work here with the database.
    
    var collection = db.collection('newcollection');
    collection.insert(body, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
        res.send("data received " + JSON.stringify(result));
      }
      //Close connection
      db.close();
    });

    
  }
});
	 
	 
});

app.post('/update',function(req,res){
  var body=req.body;
  console.log(body._id);
  console.log(body.feedback);
  //var id=parseInt(body._id);
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);

    // do some work here with the database.
    
    var collection = db.collection('newcollection');
    
    
  collection.update({_id : ObjectId(body._id)},{$set: {feedback: body.feedback} }, function (err, numUpdated) {
  if (err) {
    console.log(err);
  } else if (numUpdated) {
    res.send(" Feedback updated in database");
    console.log('Updated Successfully %d document(s).', numUpdated);
  } else {
    res.send('No document found ');
    console.log('No document found with defined "find" criteria!');
  }
  //Close connection
  db.close();
});

    
    
    
  }
});
  
  
});

app.use(express.static(__dirname + '/public'));

app.get('/records',function(req, res) {
  var _name=req.query.name;
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);

    // Get the documents collection
    var collection = db.collection('newcollection');
    if(_name)
    {
      collection.find({name: _name}).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
        console.log('Found:', result);
        //res.send(JSON.stringify(result));
        res.send(result);
      } else {
        console.log('No document(s) found with defined "find" criteria!');
        res.send("No documents found");
      }
      //Close connection
      db.close();
    });
    }
    else{  
     // Insert some users
    collection.find().toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
        console.log('Found:', result);
        res.send(result);
      } else {
        console.log('No document(s) found with defined "find" criteria!');
      }
      //Close connection
      db.close();
    });
  }
  }
});
});


app.listen(port,function(){
	console.log("App listening at port "+port);
})