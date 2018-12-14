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
// Configure View and Handlebars
app.use(express.static(path.join(__dirname, '')))
// app.set('views', path.join(__dirname, 'views'))
// var exphbs = require('express-handlebars');
// var hbs = exphbs.create({});
// app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(session({ secret: 'secret', resave: 'false', saveUninitialized: 'false' }))

/*
Create body parsers for application/json and application/x-www-form-urlencoded
 */
var bodyParser = require('body-parser')
var AccessToken,gRefreshAccessToken;
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
// var con2 = mysql.createConnection({
//     host: "http://testbed2.riktamtech.com/phpmyadmin",
//     user: "root",
//     password: "lkgukg16",
//     database: "growsari_merge"
// });
// con2.connect(function(err){
//     if(err) throw err;
//     console.log("connected to testbed");
// })
//    var departments;
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
    // Exchange the auth code retrieved from the **req.url** on the redirectUri
    oauthClient.createToken(parseRedirect)
        .then(function (authResponse) {
            // console.log('The Token is  ' + JSON.stringify(authResponse.getJson().access_token));
            test_auth = authResponse.getJson();
            accessToken = JSON.stringify(authResponse.getJson());
            // console.log("access token in callback is");
            // console.log(accessToken);
            AccessToken = accessToken;

        })
        .catch(function (e) {
            // console.error("The error message is :" + e.originalMessage);
            console.error(e.intuit_tid);
        });
    // console.log("after await");
    // console.log(AccessToken);
    /////////////////////
    var parsedUri = queryString.parse(req.originalUrl);
    realmId = parsedUri.realmId;
    tryrealmID = realmId;
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
        //  accessToken = JSON.parse(res.body);
        oauth2_token_json = JSON.stringify(accessToken, null, 2);
        var oauth2_token_json2 = JSON.stringify(accessToken.access_token, null, 2);
    });
    // res.redirect('http://localhost:3000/call_api/');
    res.send("hey u got access try your api calls now");
});
app.post('/addcustomer', function (req, res) {
    console.log("add customer");
    var token;
    if (AccessToken == undefined) {
        // console.log("no token")
        // res.redirect('http://localhost:3000');
        res.send("no token for u");
    }
    else {


        obj = JSON.parse(AccessToken);
        token = obj.access_token;
        // console.log("accccssssssssssssss  " + obj.access_token)

        if (!token) return res.json({ error: 'Not authorized' })


        // Set up API call (with OAuth2 accessToken)
        var url1 = config.sandbox_api_uri + tryrealmID + '/customer'

        // console.log('Making API call to: ' + url1)
        // console.log("token:::::::::" + token)

        // console.log("add customer before error check")
        var body1 = {
            "BillAddr": {
                "Line1": "123 Main Street",
                "City": "Mountain View",
                "Country": "USA",
                "CountrySubDivisionCode": "CA",
                "PostalCode": "94042"
            },
            "Notes": "Here are other details.",
            "Title": "Mr",
            "GivenName": "Jamessnnnn",
            "MiddleName": "Bs",
            "FamilyName": "Kings",
            "Suffix": "Jr",
            "FullyQualifiedName": "King Groceriesnnnnnnnnnnn",
            "CompanyName": "King Grocerieessnnnnnnnn",
            "DisplayName": "King's Grocerieessnnnnnnnnnnnnn",
            "PrimaryPhone": {
                "FreeFormNumber": "(0007) 555-5555"
            },
            "PrimaryEmailAddr": {
                "Address": "jdrew@myemail.com"
            }
        }
        var requestobj2 = JSON.stringify(body1);
        request.post({
            url: url1,
            auth: {
                'bearer': token
            },
            json: body1

        }, function (err, res) {
            // console.log(res);
            //   res.send("added customer");
        });
    }
});
app.get('/qbtrail', function (req, res) {
    console.log("response code of qbtrail");
    // console.log(res.statusCode);

    con.query("SELECT * FROM `order` ord INNER JOIN order_status ordstatus ON ord.id = ordstatus.order_id INNER JOIN store_warehouse_shipper ON ord.associate_id = store_warehouse_shipper.id INNER JOIN store ON store_warehouse_shipper.store_id = store.id WHERE ordstatus.status = 'delivered' ",
        function (err, rows, fields) {
            if (err) throw err;
            // console.log("listing");

            // console.log(rows);
            res.send(JSON.stringify(rows, null, 2));
        });
});
const callme = function () {
    console.log("in call me function");
    var xy ;
    // var ret;

    xy = oauthClient.refreshUsingToken(obj.refresh_token)
        .then(function (authResponse) {
            console.log("xy in call meeeeeeeeeeeeeeeeeeeeeeeee");
            console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
        //    console.log( JSON.stringify(authResponse.getJson()));
           var tfg =JSON.stringify(authResponse.getJson());
           objfg = JSON.parse(tfg);
           tokenfg = objfg.access_token;
           gRefreshAccessToken= tokenfg;
            
            // console.log("authresponse access token "+authResponse.token.Token.access_token);
            
            console.log(tokenfg);
            // return authResponse;
            // console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
        })
        .catch(function (e) {
            console.error("The error message is er:" + e);
            console.error(e.intuit_tid);
        });
       
        console.log(xy);
    
    return  xy;
};
app.get('/call_api', function (req, res) {
    console.log("response code for call api");
    // console.log(res.statusCode);
    // console.log(AccessToken);
    obj = JSON.parse(AccessToken);
    token = obj.access_token;
    // console.log("refreshhhhhhhhhhhhhhh  " + obj.refresh_token);

    console.log("call api session");
    var token;
    oauthClient.refreshToken = obj.refresh_token;
    oauthClient.accessToken = obj.access_token;
    // var qwert= oauthClient.refreshUsingToken(obj.refresh_token)
    //     .then(function (authResponse) {
    //         // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
    //         // console.log('Tokens refreshed : ' + JSON.stringify(authResponse.json()));
    //         // console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
    //     })
    //     .catch(function (e) {
    //         console.error("The error message is :" + e.originalMessage);
    //         console.error(e.intuit_tid);
    //     });
    var wer = callme();
    // wer.then(function cv(df){
    //     console.log(df);
    //     console.log("in wer .then");
    // });
    console.log(wer);
    // sleep.msleep(6500);
    console.log("here new token nnnnnnnnnnnnnnnnn");
    // var qbo = new QuickBooks(config.clientId,
    //     config.clientSecret,
    //     obj.access_token, /* oAuth access token */
    //     false, /* no token secret for oAuth 2.0 */
    //     realmId,
    //     config.useSandbox, /* use a sandbox account */
    //     true, /* turn debugging on */
    //     4, /* minor version */
    //     '2.0', /* oauth version */
    //     obj.refresh_token /* refresh token */);
    // console.log("quick books object");
    // console.log(qbo);
    // qbo.refreshAccessToken(function (err, refreshToken) {
    //     if (err) {
    //         console.log("error for refreshing token");
    //         console.log(err);

    //     }
    //     else {
    //         console.log("The response refresh is :" + JSON.stringify(refreshToken, null, 2));

    //     }
    // });


    if (AccessToken == undefined) {
        // console.log("no token");
        res.status(401);
        console.log("eror token status");
        // console.log(res.statusCode);
        res.send("no token for u");
    }
    else {

        // console.log("e516546");
           console.log("new token ::::::::::::::::::::::::::::::");
           console.log(gRefreshAccessToken);

        obj = JSON.parse(AccessToken);
        token = obj.access_token;
        // console.log("accccssssssssssssss  " + token)
        if (!token) return res.json({ error: 'Not authorized' })
        // if(!req.session.realmId) return res.json({
        //   error: 'No realm ID.  QBO calls only work if the accounting scope was passed!'
        // })

        // Set up API call (with OAuth2 accessToken)
        var url = config.sandbox_api_uri + tryrealmID + "/query?query=Select * from Customer WHERE Id = '1'"
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

            res.send(response.body)
            //  res.redirect('/refresh')
            // Check if 401 response was returned - refresh tokens if so!
            // tools.checkForUnauthorized(req, requestObj, err, response).then(function ({err, response}) {
            //   if(err || response.statusCode != 200) {
            //     return res.json({error: err, statusCode: response.statusCode})
            //   }

            //   // API Call was a success!
            //   res.json(JSON.parse(response.body))
            // }, function (err) {
            //   console.log(err)
            //   return res.json(err)
            // })
        })
    }
})

// app.get('/launch', function (req, res) {

//     var parsedUri = queryString.parse(req.originalUrl);
//     console.log("The query params are :" + JSON.stringify(parsedUri, null, 2));

//     console.log("The req query is :" + JSON.stringify(req.query, null, 2));
// });
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

// app.get('/delighted', function (req, res) {
//     console.log("delighted tocken" + accessToken);
//     console.log(JSON.stringify(req.body) + "deeee");

//     // // console.log("Inside Callback :");
//     // var parsedUri = queryString.parse(req.originalUrl);
//     // realmId = parsedUri.realmId;
//     //
//     // console.log("The RealmID context from Intuit during GetAppNow is :"+realmId);
//     // var auth = (new Buffer(config.clientId + ':' + config.clientSecret).toString('base64'));
//     // var postBody = {
//     //     url: config.token_endpoint,
//     //     headers: {
//     //         Accept: 'application/json',
//     //         'Content-Type': 'application/x-www-form-urlencoded',
//     //         Authorization: 'Basic ' + auth,
//     //     },
//     //     form: {
//     //         grant_type: 'authorization_code',
//     //         code: req.query.code,
//     //         redirect_uri: config.redirectUri
//     //     }
//     // };
//     //
//     // request.post(postBody, function (err, res, data) {
//     //     accessToken = JSON.parse(res.body);
//     //     oauth2_token_json = JSON.stringify(accessToken, null,2);
//     //     console.log('The access tokeb is :'+oauth2_token_json);
//     // });
//     res.send('');
// });