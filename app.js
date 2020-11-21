
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", (req, res) => {
    res.sendFile(__dirname+"/signup.html");
});


app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/2c86b26d48";
    const options = {
        method: "POST",
        auth: "rohan:7a003a3a02094220d688d1defea0941c-us10"
    };

    const request = https.request(url, options, function(response){
        console.log(response.statusCode);
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});


app.listen(port, () => {
    console.log("Listening to Port: "+port);
});