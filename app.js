require('dotenv').config();
var https = require('https');
var express = require('express');
var session = require('express-session');
var request = require('request');
var app = express();
var config = require('./config.json');
var path = require('path');
var crypto = require('crypto');
var QuickBooks = require('node-quickbooks');
var queryString = require('query-string');
var fs = require('fs');
var sleep = require('sleep');
var json2csv = require('json2csv');
var Tokens = require('csrf');
var csrf = new Tokens();
var atob = require('atob');
var cors = require('cors');
var OAuthClient = require('intuit-oauth');
app.use(cors());
app.use(express.static(path.join(__dirname, '')))
app.set('view engine', 'handlebars');
app.use(session({ secret: 'secret', resave: 'false', saveUninitialized: 'false' }))

/*
Create body parsers for application/json and application/x-www-form-urlencoded
 */
var bodyParser = require('body-parser')
var AccessToken, gRefreshAccessToken, gAccessToken, gData;
app.use(bodyParser.json())

var realmid2;
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var oauthClient = new OAuthClient({
    clientId: "Q08wlNwFEKuGgqZHFo5tUxGr2TdF4jLb8VM2RZ9wfjYeVFX0dW",
    clientSecret: "cPMp1dQ21bOIbXe4wYed7FmOhpkPryGjPQbfnULd",
    redirectUri: "http://localhost:3000/callback",
    environment: 'sandbox',                                // ‘sandbox’ or ‘production’
    accessToken: '',
    refreshToken: ''
});
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "growsari"
});
con.connect(function (err) {
    if (err) throw err;
    // console.log("Connected!");
});
app.get('/', function (req, res) {
    // console.log("localhost");
    // console.log(res.statusCode);
    var authUri = oauthClient.authorizeUri({ scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId], state: 'testState' });  // can be an array of multiple scopes ex : {scope:[OAuthClient.scopes.Accounting,OAuthClient.scopes.OpenId]}
    res.redirect(authUri);
});
/*
App Variables
 */
var tryrealmID;
var oauth2_token_json = null,
    realmId = '',
    accessToken = '',
    payload = '';
scope = '';
var fields = ['realmId', 'name', 'id', 'operation', 'lastUpdated'];
var newLine = "\r\n";


app.use(express.static('views'));

var test_auth;
app.get('/callback', function (req, res) {
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
        oauth2_token_json = JSON.stringify(accessToken, null, 2);
        var oauth2_token_json2 = JSON.stringify(accessToken.access_token, null, 2);
    });
    res.send("hey u got access try your api calls now");
});
app.post('/addcustomer', function (req, res) {
    console.log("add customer" + gAccessToken);
    var token;
    if (gAccessToken == undefined) {
        res.send("no token for u");
    }
    else {
        con.query("SELECT *FROM `order` ord INNER JOIN order_status ordstatus ON ord.id = ordstatus.order_id INNER JOIN store_warehouse_shipper ON ord.associate_id = store_warehouse_shipper.id INNER JOIN store ON store_warehouse_shipper.store_id = store.id INNER JOIN account ON store.account_id = account.id WHERE ordstatus.status = 'delivered' LIMIT 2",
            function (err, rows, fields) {
                if (err) throw err;
                gData= rows[0];
                console.log(gData.address);
                // rows.forEach(element => {
                //     console.log(element.store_id);
                // });
                token = gAccessToken;
        
                if (!token) return res.json({ error: 'Not authorized' })
                var url1 = config.sandbox_api_uri + '123146204102474' + '/customer'
                // console.log("line1 "+gData.address);
                // console.log("city "+gData.city);
                // console.log("country "+gData.country);
                // console.log("postal code "+gData.pincode);
                // console.log("Fully Qualified name "+gData.customer_name);
                // console.log("Company "+gData.name);
                // console.log("Display Name "+gData.display_name);
                // console.log("free for number "+gData.phone);
                // console.log("email "+gData.email);
                console.log("***************************");
                console.log(gData);
                console.log("gdata");
                var body1 = {
                    "BillAddr": {
                        "Line1": gData.city,
                        "City": gData.city,
                        "Country": gData.country,
                        "CountrySubDivisionCode": "-",
                        "PostalCode": gData.pincode
                    },
                    // "Notes": "Here are other details.",
                    "Title": "Mr/Mrs",
                    "GivenName": "",
                    "MiddleName": "",
                    "FamilyName": "",
                    "Suffix": "",
                    "FullyQualifiedName": gData.customer_name,
                    "CompanyName": gData.name,
                    "DisplayName": gData.display_name,
                    "PrimaryPhone": {
                        "FreeFormNumber": gData.phone
                    },
                    "PrimaryEmailAddr": {
                        "Address": gData.email
                    },
        
                };
                request.post({
                    url: url1,
                    auth: {
                        'bearer': token
                    },
                    json: body1
        
                }, function (err, res) {
                    console.log("***********************");
                    console.log(res.body); console.log("***********************");
        
                    console.log(res.body.Customer.Id); console.log("***********************");
                    var da = {
                        storeId : gData.store_id,
                        qbId : res.body.Customer.Id
                    };
                    con.query("INSERT INTO QBids SET ?",da , function(err, result) {
                        if (err) throw err;
                    
                        console.log("1 new customer record inserted");
                      
                      });
        
                    console.log(res.body.Id);
        
        
        
        
                    console.log("***********************");
                    console.log(typeof res);
        
                });
 
            });

    }
    // console.log(res.body);
    res.send("added");
});
app.get('/growsariData', function (req, res) {
    console.log("response code of qbtrail");
    con.query("SELECT *FROM `order` ord INNER JOIN order_status ordstatus ON ord.id = ordstatus.order_id INNER JOIN store_warehouse_shipper ON ord.associate_id = store_warehouse_shipper.id INNER JOIN store ON store_warehouse_shipper.store_id = store.id INNER JOIN account ON store.account_id = account.id WHERE ordstatus.status = 'delivered' LIMIT 1",        function (err, rows, fields) {
            if (err) throw err;
            rows.forEach(element => {
                console.log(element.store_id);
            });
            console.log("growsari data");
            console.log(rows[0]);
            gData = rows[0];
            console.log("line1 "+gData.address);
            console.log("city "+gData.city);
            console.log("country "+gData.country);
            console.log("postal code "+gData.pincode);
            console.log("Fully Qualified name "+gData.customer_name);
            console.log("Company "+gData.name);
            console.log("Display Name "+gData.display_name);
            console.log("free for number "+gData.phone);
            console.log("email "+gData.email);

            console.log("growsari daat");
            res.send(JSON.stringify(rows, null, 2));
        });
});
const callme = async function () {
    console.log("in call me function refresh token============ " + gRefreshAccessToken);
    var xy;
    xy = await oauthClient.refreshUsingToken(gRefreshAccessToken)
        .then(function (authResponse) {
            var tfg = JSON.stringify(authResponse.getJson());
            objfg = JSON.parse(tfg);
            gAccessToken = objfg.access_token;
            gRefreshAccessToken = objfg.refresh_token;
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

app.get('/read_api', function (req, res) {
    fs.readFile("/home/admin1/Desktop/qb/OAuth2.0-demo-nodejs-master/refreshToken", "utf8", function (err, data) {
        console.log("refresh token from text file");
        console.log(data);

        gRefreshAccessToken = data;
        fs.readFile("/home/admin1/Desktop/qb/OAuth2.0-demo-nodejs-master/accessToken", "utf8", function (err, data2) {
            console.log("access token from text file");
            console.log(data2);
            gAccessToken = data2;
            res.redirect('http://localhost:3000/call_api');
        });

    });

});
app.get('/call_api', function (req, res) {
    console.log("call api session");
    var token;
    oauthClient.refreshToken = gRefreshAccessToken;
    oauthClient.accessToken = gAccessToken;
    console.log("in call access token//////////////////////////" + gAccessToken);

    var wer = callme().then(function () {
        if (gAccessToken == undefined) {

            res.status(401);
            console.log("eror token status");
            console.log(res.statusCode);
            res.send("no token for u");
        }
        else {

            console.log("new refresh token ::::::::::::::::::::::::::::::");
            console.log(gRefreshAccessToken);
            token = gAccessToken;
            console.log("gaccessToken:::::::::::::::::" + token);
            if (!token) return res.json({ error: 'Not authorized' })

            var url = config.sandbox_api_uri + '123146204102474' + "/query?query=Select * from Customer WHERE Id= '1'"
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

                res.send(response.body);

            });
        }
        console.log("here new token nnnnnnnnnnnnnnnnn");
    });


});

app.get('/test', function (req, res) {
    console.log("hello");
    var url = " https://sandbox-quickbooks.api.intuit.com/v3/company/123146204102474/customer/1"
    console.log("accc     " + accessToken)
    request({
        url: url,
        auth: {
            'bearer': accessToken.access_token
        },
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            console.log(body + "  ==========okkk")
            console.log(body)
            // Print the json response
        }
        else {
            console.log("error")
        }
    });
    res.send("body")
});
app.get('/refreshAccessToken', function (req, res) {

    // save the access token somewhere on behalf of the logged in user
    var qbo = new QuickBooks(config.clientId,
        config.clientSecret,
        accessToken.access_token, /* oAuth access token */
        false, /* no token secret for oAuth 2.0 */
        realmId,
        config.useSandbox, /* use a sandbox account */
        true, /* turn debugging on */
        4, /* minor version */
        '2.0', /* oauth version */
        accessToken.refresh_token /* refresh token */);

    qbo.refreshAccessToken(function (err, refreshToken) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            console.log("The response refresh is :" + JSON.stringify(refreshToken, null, 2));
            res.send(refreshToken);
        }
    });


});
app.get('/getCompanyInfo', function (req, res) {

    console.log("//////////////////////" + accessToken);
    console.log("/////////////////////" + realmId);
    // save the access token somewhere on behalf of the logged in user
    var qbo = new QuickBooks(config.clientId,
        config.clientSecret,
        accessToken.access_token, /* oAuth access token */
        false, /* no token secret for oAuth 2.0 */
        realmId,
        config.useSandbox, /* use a sandbox account */
        true, /* turn debugging on */
        4, /* minor version */
        '2.0', /* oauth version */
        accessToken.refresh_token /* refresh token */);

    qbo.getCompanyInfo(realmId, function (err, companyInfo) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            console.log("The response is :" + JSON.stringify(companyInfo, null, 2));
            res.send(companyInfo);
        }
    });
});


// Start server on HTTP (will use ngrok for HTTPS forwarding)
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
