var express = require("express");
var path = require("path");
var app = express();

// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

var tables = [{
    customerName: "Ben Diamond",
    customerEmail: "supercustomerEmail@customerEmail.com",
    phoneNumber: 1111111111,
    customerID: "ben"
}, {
    customerName: "gabe",
    customerEmail: "gabe@customerEmail.com",
    phoneNumber: 2222222222,
    customerID: "Super Gabe"
}, {
    customerName: "guest",
    customerEmail: "whoCares@customerEmail.com",
    phoneNumber: 4537777777,
    customerID: "nobody"
}];
var waitingArray = [{
    customerName: "Saima",
    customerEmail: "saima@example.com",
    phoneNumber: "000-000-0000",
    customerID: "saimaCool"
}];
// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs.

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/tables", function(req, res) {
    res.sendFile(path.join(__dirname, "tables.html"));
});

app.get("/reserve", function(req, res) {
    res.sendFile(path.join(__dirname, "reserve.html"));
});

// Displays all Tables
app.get("/api/tables", function(req, res) {
    return res.json(tables);
});

// Displays a single table, or returns false
app.get("/api/tables", function(req, res) {
    var chosen = req.params.tables;
    res.json(tables)
    console.log(chosen);

    for (var i = 0; i < tables.length; i++) {
        if (chosen === tables[i].routeName) {
            return res.json(tables[i]);
        }
    }

    return res.json(false);
});
app.get("/api/waitlist", function(req, res) {
    res.json(waitingArray);
});

// app.post("/api/tables", function(req, res) {

//     var newTable = req.body;

//     newTable.routeName = newTable.name.replace(/\s+/g, "").toLowerCase();

//     console.log(newTable);

//     tables.push(newTable);

//     res.json(newTable);
// });
app.post("/api/tables", function(req, res) {
    if (tables.length < 5) {
        tables.push(req.body);
        res.json(true);
    } else {
        waitingArray.push(req.body);
        res.json(false);
    }
});
// LISTENER
// The below code effectively "starts" our server
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});