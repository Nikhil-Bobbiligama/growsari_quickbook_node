require('dotenv').config();

var request = require('request');
var fcallback = require('./apiCalls/callback');
var faddDetails = require('./apiCalls/addDetails');
var fcallApi = require('./apiCalls/setTokenApi');
var freadToken = require('./Query/readToken');
var config = require('./config.json');
var session = require('express-session');
var mysql = require('mysql');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cors = require('cors');
var OAuthClient = require('intuit-oauth');
var cron = require('node-cron');
var app = express();
var bodyParser = require('body-parser');
app.use(cors());
app.use(express.static(path.join(__dirname, '')))
// app.set('view engine', 'handlebars');
app.use(session({ secret: 'secret', resave: 'false', saveUninitialized: 'false' }))

app.use(bodyParser.json());
var oauthClient = new OAuthClient({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: config.redirectUri,
    environment: 'sandbox',                                // ‘sandbox’ or ‘production’
    accessToken: '',
    refreshToken: ''
});
var AccessToken, gRefreshAccessToken, gAccessToken, gData, test;
var con = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});
con.connect(function (err) {
    if (err) throw err;
    // console.log("Connected!");
});

 
cron.schedule("1 * * * *",function() {
    var url = "http://localhost:3000/testcall"
    var requestObj = {
        url: url,

    }

    // Make API call
    request(requestObj, function (err, response) {
        // res.redirect('http://localhost:3000/addDetails');

    });
  console.log('running every minute 1, 2, 4 and 5');

});
app.get('/', function (req, res) {
    var authUri = oauthClient.authorizeUri({ scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId], state: 'testState' });  // can be an array of multiple scopes ex : {scope:[OAuthClient.scopes.Accounting,OAuthClient.scopes.OpenId]}
    res.redirect(authUri);
});
/*
App Variables
 */
scope = '';
app.get('/callback', function (req, res) {
    fcallback.callback(oauthClient, con, req, res);
});
app.get('/addDetails', function (req, res) {
    faddDetails.addDetails(gAccessToken, gRefreshAccessToken, con, req, res);
});
app.get('/read_api', function (req, res) {
    freadToken.ReadToken(con, function (row1) {
        gAccessToken = row1.AccessToken;
        gRefreshAccessToken = row1.RefreshToken;
    });
    res.redirect('http://localhost:3000/call_api');

});

app.get('/call_api', function (req, res) {
    fcallApi.setTokenApi(gAccessToken, gRefreshAccessToken, con, oauthClient, req, res);
});
app.get('/testcall', function (req, res) {

    freadToken.ReadToken(con, function (returnValue) {
        console.log("in new Technique this should print after tokens");
        console.log("=======================");
        console.log(returnValue);
        console.log("this should print last");
        res.send("success cron");
        // use the return value here instead of like a regular (non-evented) return value
    });

});

// Start server on HTTP (will use ngrok for HTTPS forwarding)
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
