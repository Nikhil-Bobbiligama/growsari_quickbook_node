var fcallme = require('../methods/refreshToken');
var fs = require('fs');
var config = require('../config.json');
var request = require('request');
const setTokenApi = function (gAccessToken,gRefreshAccessToken,oauthClient,req,res) {
    console.log("call api session");
    var token;
    oauthClient.refreshToken = gRefreshAccessToken;
    oauthClient.accessToken = gAccessToken;
    // console.log("in call access token//////////////////////////" + gAccessToken);

    var wer = fcallme.callme(gRefreshAccessToken, oauthClient).then(function () {
        console.log("in call api test variable ");
        console.log(test);
        fs.readFile("/home/admin1/Desktop/qb/OAuth2.0-demo-nodejs-master/refreshToken", "utf8", function (err, data) {
            console.log("refresh token from text file");
            // console.log(data);

            gRefreshAccessToken = data;
            fs.readFile("/home/admin1/Desktop/qb/OAuth2.0-demo-nodejs-master/accessToken", "utf8", function (err, data2) {
                console.log("access token from text file");
                // console.log(data2);
                gAccessToken = data2;
                // gAccessToken= fcallme.gAccessToken;
                console.log("gaccesstoken in app.js after refresh.js file :::::::::::::");
                // console.log(gAccessToken);
                // gRefreshAccessToken= fcallme.gRefreshAccessToken;
                if (gAccessToken == undefined) {

                    res.status(401);
                    console.log("eror token status");
                    console.log(res.statusCode);
                    res.send("no token for u");
                }
                else {

                    console.log("new refresh token ::::::::::::::::::::::::::::::");
                    // console.log(gRefreshAccessToken);
                    token = gAccessToken;
                    // console.log("gaccessToken:::::::::::::::::" + token);
                    if (!token) return res.json({ error: 'Not authorized' })

                    var url = config.sandbox_api_uri + '123146204102474' + "/query?query=Select * from Customer WHERE Id= '85'"
                    var requestObj = {
                        url: url,
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Accept': 'application/json'
                        }
                    }

                    // Make API call
                    request(requestObj, function (err, response) {
                        console.log("response status code call api");
                        console.log(response.statusCode);

                        // res.send(response.body);
                        res.redirect('http://localhost:3000/addDetails');

                    });
                }
                // console.log("here new token nnnnnnnnnnnnnnnnn");
                // res.redirect('http://localhost:3000/call_api');
            });

        });
    });


}
module.exports = {setTokenApi}