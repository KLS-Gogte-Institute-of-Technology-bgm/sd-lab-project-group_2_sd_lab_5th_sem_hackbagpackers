const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//connect to the database
mongoose.connect("mongodb://localhost:27017/linkManager", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', function () {
    console.log("Error in connection");
});
db.on('open', function () {
    console.log("Connected to database");
})
app.post("/signup", function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var mobnumber = req.body.mobnumber;
    var department = req.body.dept;

    var data = {
        "name": name,
        "email": email,
        "password": password,
        "mobnumber": mobnumber,
        "department": department
    }
    db.collection('teachers').insertOne(data, function (err, collection) {
        if (err) {
            throw err;
        }
        console.log("Record inserted successfully!");
    });

    return res.redirect('signup_success.html');

});


app.listen(3000, function () {
    console.log("Server is runnning on port 3000");
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get("/signup.html", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});
app.get("/signin.html", function (req, res) {
    res.sendFile(__dirname + "/signin.html");
});

app.post("/", function (req, res) {
    console.log(req.body.radio)
    if (req.body.radio === "Student") {
       return res.redirect('student.html')
    }
    else if (req.body.radio == "Teacher") {
       return res.redirect('signin')
    }
    else {
        res.sendFile(__dirname + "/index.html");
    }
});
app.get("/signin", function (req, res) {
    res.sendFile(__dirname + '/public/signin.html'); 
});

var id;
app.post("/signin", function (req, res) {
    var email = req.body.email;
    var password = req.body.email;
    console.log(email);
    console.log(password);
    db.collection('teachers').findOne({ email: email },
        function (err, teacher) {
            if (err) {
                console.log(err);
                return res.status(500).send();
            }
            if (!teacher) {
                return res.status(404).send();
            }
            id = teacher._id;
            return res.redirect("teacher");
        }
    )
});

app.get("/teacher", function (req, res) {
    db.collection('teachers').findOne({ _id: id }, function (err, teacher) {
        if (err) {
            console.log(err);
        }
        if (!teacher) {
            console.log("user not found");
        }
        res.send("<h1>" + teacher.name + "</h1>" + "<h2>" + teacher.department + "</h2>");
    })
})