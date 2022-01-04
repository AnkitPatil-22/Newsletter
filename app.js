const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {

  const firstName = req.body.FirstName;
  const lastName = req.body.LastName;
  const email = req.body.Email;

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

  const url = "https://us20.api.mailchimp.com/3.0/lists/f3ddf517fa";

  const options = {
    method: "POST",
    auth: "ankit22:a40e3032f4c28566e63fa3a3524b2046-us20"
  }

  const request = https.request(url, options, (response) => {

    if (response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
      // console.log(response);
    })
  })

  request.write(jsonData);
  request.end();

});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.POST || 3000, () => {
  console.log("Server is running on port 3000");
});


// API KEY
// a40e3032f4c28566e63fa3a3524b2046-us20

// Audience ID
// f3ddf517fa
