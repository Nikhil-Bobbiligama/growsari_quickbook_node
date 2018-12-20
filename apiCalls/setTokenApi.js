var fcallme = require('../methods/refreshToken');
var config = require('../config.json');
var request = require('request');
var fReadTokenQuery = require('../Query/readToken');
var fWriteTokenQuery = require('../Query/writeToken');
const setTokenApi = function (gAccessToken,gRefreshAccessToken,con,oauthClient,req,res) {
    console.log("call api session");
    var token;
    oauthClient.refreshToken = gRefreshAccessToken;
    oauthClient.accessToken = gAccessToken;
    var wer = fcallme.callme(gRefreshAccessToken, oauthClient).then(function () {
        fReadTokenQuery.ReadToken(con, function (row1) {
            var fg= JSON.stringify(row1);
            fg= JSON.parse(fg);
            console.log(fg);
            gAccessToken=fg.AccessToken;
            gRefreshAccessToken=fg.RefreshToken;
                var newToken= {
                 AccessToken:gAccessToken,
                 RefreshToken:gRefreshAccessToken
                };
                fWriteTokenQuery.writeQuery(con,newToken, function (response) {
                    console.log("after writing token 1");
                });

                if (gAccessToken == undefined) {

                    res.status(401);
                    console.log("eror token status");
                    console.log(res.statusCode);
                    res.send("no token for u");
                }
                else {

                    token = gAccessToken;
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
                        res.redirect('http://localhost:3000/addDetails');

                    });
                }
        });
    });


}
module.exports = {setTokenApi}