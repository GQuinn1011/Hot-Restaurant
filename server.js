var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

// ==============================================================================
// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server
// ==============================================================================

// Tells node that we are creating an "express" server
var app = express();

// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var data = {
    reservations: [],
    waitlist: [],
};
// ================================================================================
// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs.
// ================================================================================
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/reserve", function(req, res) {
    res.sendFile(path.join(__dirname, "reserve.html"));
});

app.get("/tables", function(req, res) {
    res.sendFile(path.join(__dirname, "tables.html"));
});
//require("./routes/apiRoutes")(app);
//require("./routes/htmlRoutes")(app);

app.get("/api/tables", function(req, res) {
    res.json(data.reservations);
});

app.get("/api/waitlist", function(req, res) {
    res.json(data.waitlist);
});

// Returns both the tables array and the waitlist array
app.get("/api/", function(req, res) {
    res.json(data);
});

app.post("/api/new", function(req, res) {
    var tableData = req.body;
    console.log(tableData);
    if (tableData && tableData.name) {
        tableData.routeName = tableData.name.replace(/\s+/g, "").toLowerCase();
    }
    console.log(tableData);

    if (data.reservations.length < 5) {
        data.reservations.push(tableData);
    } else {
        data.waitlist.push(tableData);
    }


    res.json(tableData);
});

app.get("/api/remove/:id?", function(req, res) {
    var tableId = req.params.id;

    if (tableId) {
        console.log(tableId);
        for (var i = 0; i < data.reservations.length; i++) {
            if (tableId === data.reservations[i].id) {
                data.reservations.splice(i, 1);
                if (data.waitlist.length > 0) {
                    var tempTable = data.waitlist.splice(0, 1)[0];
                    data.reservations.push(tempTable);
                }

                return res.json(true);
            }
        }
        for (var i = 0; i < data.waitlist.length; i++) {
            if (tableId === data.waitlist[i].id) {
                data.waitlist.splice(i, 1);

                return res.json(true);
            }
        }
        return res.json(false);
    }
    return res.json(false);
});

// =============================================================================
// LISTENER
// The below code effectively "starts" our server
// =============================================================================

app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});