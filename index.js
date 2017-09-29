const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const uuidv4 = require("uuid/v4");

const app = express();

var sessions = {};

app.set("port", 8080);
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "index")));

function generateSession(user, pass) 
{
    var session = {};
    session.token = uuidv4();
    session.timeout = setTimeout(function()
    {
        delete sessions[session.token];
    }, 600000);
    session.refresh = function()
    {
        clearTimeout(session.timeout);
        session.timeout = setTimeout(function()
        {
            delete sessions[session.token];
        }, 600000);
    };
    session.memberType = "member";
    sessions[session.token] = session;
    return session;
}

app.post("/login", function(request, response) 
{
    //Input {class="", pass=""}
    //Output {success: bool, memberType="admin : mod : member", token:""}
    console.log(request.body);
    response.setHeader('Content-Type', 'application/json');
    var session = generateSession(request.body.class, request.body.pass);
    response.write(JSON.stringify({success: true, message: "", memberType: session.memberType, token : session.token}));
    response.end();
});

app.post("/check-refresh-session", function(request, response) 
{
    //Input {token: "uuid..."}
    //Output {success: bool}
    console.log(request.body);
    response.setHeader('Content-Type', 'application/json');
    var session = sessions[request.body.token];
    if (session !== undefined)
    {
        session.refresh();
        response.write(JSON.stringify({success: true}));
    }
    else
        response.write(JSON.stringify({success: false}));
    response.end();
});

app.post("/kill-session", function(request, response) 
{
    //Input {token: "uuid..."}
    //Output {}
    console.log(request.body);
    response.setHeader('Content-Type', 'application/json');
    var session = sessions[request.body.token];
    if (session !== undefined)
    {
        clearTimeout(session.timeout);
        delete sessions[request.body.token];
    }
    response.end();
});

app.post("/get-all-assignments", function(request, response) 
{
    //Input {token: "uuid..."}
    //Output {success: bool, atokens: [{name: "...", token: "uuid..."}]}
    console.log(request.body);
    response.setHeader('Content-Type', 'application/json');
    var session = sessions[request.body.token];
    if (session !== undefined)
    {
        session.refresh();
        //TODO: get assignments for the class
        response.write(JSON.stringify({success: true}));
    }
    else
        response.write(JSON.stringify({success: false}));
    response.end();
});

app.post("/get-all-problems", function(request, response) 
{
    //Input {token: "uuid...", atoken: "uuid..."}
    //Output {success : bool, ptokens: [{name: "...", desc: "...", token: "uuid..."}]}
    console.log(request.body);
    response.setHeader('Content-Type', 'application/json');
    var session = sessions[request.body.token];
    if (session !== undefined)
    {
        session.refresh();
        //TODO: get problems for the assignment
        response.write(JSON.stringify({success: true}));
    }
    else
        response.write(JSON.stringify({success: false}));
    response.end();
});

app.post("/get-all-responses", function(request, response) 
{
    //Input {token: "uuid...", ptoken: "uuid..."}
    //Output {success : bool, rdata: [{author: "...", topic: "...", type: "image : text : math", data: "url,text,latex"}]}
    console.log(request.body);
    response.setHeader('Content-Type', 'application/json');
    var session = sessions[request.body.token];
    if (session !== undefined)
    {
        session.refresh();
        //TODO: get responses for the problem
        response.write(JSON.stringify({success: true}));
    }
    else
        response.write(JSON.stringify({success: false}));
    response.end();
});

var server = app.listen(app.get("port"), function ()
 {
    var port = server.address().port;
    console.log("Hosted on port: " + port);
});