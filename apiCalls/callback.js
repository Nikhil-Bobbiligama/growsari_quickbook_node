var queryString = require('query-string');
require('dotenv').config();
var request = require('request');
var queryString = require('query-string');
var fs = require('fs');
var config = require('../config.json');
const callback = function (oauthClient, req, res) {
    console.log("in call back function");
    console.log("callback");
    var parseRedirect = req.url;
    oauthClient.createToken(parseRedirect)
        .then(function (authResponse) {
            test_auth = authResponse.getJson();
            accessToken = JSON.stringify(authResponse.getJson());
            let temp_daata = JSON.parse(accessToken);
            console.log(temp_daata.access_token);
            console.log("/////////////////////////////////")
            console.log(temp_daata.refresh_token);
            global.test = "call back test variable";
            fs.writeFile("/home/admin1/Desktop/qb/OAuth2.0-demo-nodejs-master/accessToken", temp_daata.access_token, function (err) {
                if (err) {
                    return console.log(err);
                }
                fs.writeFile("/home/admin1/Desktop/qb/OAuth2.0-demo-nodejs-master/refreshToken", temp_daata.refresh_token, function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The refresh file was saved!");
                });
                fs.writeFile("/home/admin1/Desktop/qb/OAuth2.0-demo-nodejs-master/Token", accessToken, function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The token file was saved!");
                });
                console.log("The file was saved!");
            });

            console.log("*************************************");
            AccessToken = accessToken;


        })
        .catch(function (e) {
            console.error(e.intuit_tid);
        });
    var parsedUri = queryString.parse(req.originalUrl);
    realmId = parsedUri.realmId;
    tryrealmID = 123146204102474;
    var auth = (new Buffer(config.clientId + ':' + config.clientSecret).toString('base64'));
    var postBody = {
        url: config.token_endpoint,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + auth,
        },
        form: {
            grant_type: 'authorization_code',
            code: req.query.code,
            redirect_uri: config.redirectUri
        }
    };

    request.post(postBody, function (err, res, data) {
        // oauth2_token_json = JSON.stringify(accessToken, null, 2);
        // var oauth2_token_json2 = JSON.stringify(accessToken.access_token, null, 2);
    });
    res.send("hey u got access try your api calls now");

}
module.exports = { callback }