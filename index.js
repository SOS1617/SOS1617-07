var express = require("express");
var app = express();
var port = (process.env.PORT || 17789);


app.post("/hello",(req,res)=>{
    res.send("Hello world");
    console.log("New request arrived");
});



app.listen(port, (err) => {
    if(!err)
        console.log("Server initialized on port " +port);
    else
        console.log("ERROR initializing server in port" + port + ": " + err );
});

app.get("/time",(req,res) => {
    var date = Date();
    res.send( +date);
});


