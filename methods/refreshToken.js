var fs = require('fs');

var gAccessToken, gRefreshAccessToken;
const callme = async function (gRefreshAccessToken1,oauthClient) {
    console.log("in call me function refresh token============ " + gRefreshAccessToken1);
    var xy;
    xy = await oauthClient.refreshUsingToken(gRefreshAccessToken1)
        .then(function (authResponse) {
            var tfg = JSON.stringify(authResponse.getJson());
            objfg = JSON.parse(tfg);
            // gAccessToken = objfg.access_token;
            gAccessToken = objfg.access_token;
            gRefreshAccessToken = objfg.refresh_token;
            console.log("gaccesstoken in refreshtoken file.js:::::::::::::::::::");
            // console.log(gAccessToken);
            // gRefreshAccessToken = obj.refresh_token;
            global.test = "refresh";
            fs.writeFile("/home/admin1/Desktop/qb/OAuth2.0-demo-nodejs-master/accessToken", gAccessToken, function (err) {
                if (err) {
                    return console.log(err);
                }
                fs.writeFile("/home/admin1/Desktop/qb/OAuth2.0-demo-nodejs-master/refreshToken", gRefreshAccessToken, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The new refresh file was saved!");
                    fs.writeFile("/home/admin1/Desktop/qb/OAuth2.0-demo-nodejs-master/Token", tfg, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("The new token file was saved!");
                        return xy;

                    });
                });

                console.log("The file was saved!");
            });


        })
        .catch(function (e) {
            console.error("The error message is er:---------------" + e);
            console.error(e.intuit_tid);
        });


};
module.exports = { callme, gAccessToken, gRefreshAccessToken }