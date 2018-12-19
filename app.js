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
var bodyParser = require('body-parser')
var AccessToken, gRefreshAccessToken, gAccessToken, gData, test;
app.use(bodyParser.json())
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var oauthClient = new OAuthClient({
    clientId: "Q08wlNwFEKuGgqZHFo5tUxGr2TdF4jLb8VM2RZ9wfjYeVFX0dW",
    clientSecret: "cPMp1dQ21bOIbXe4wYed7FmOhpkPryGjPQbfnULd",
    redirectUri: "http://localhost:3000/callback",
    environment: 'sandbox',                                // ‘sandbox’ or ‘production’
    accessToken: '',
    refreshToken: ''
});
var fcallback = require('./apiCalls/callback');
var faddDetails = require('./apiCalls/addDetails');
// var fcallme = require('./methods/refreshToken');
var fcallApi = require('./apiCalls/setTokenApi');
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
    var authUri = oauthClient.authorizeUri({ scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId], state: 'testState' });  // can be an array of multiple scopes ex : {scope:[OAuthClient.scopes.Accounting,OAuthClient.scopes.OpenId]}
    res.redirect(authUri);
});
/*
App Variables
 */
scope = '';


app.get('/callback', function (req, res) {
    fcallback.callback(oauthClient, req, res);
    console.log("//////////*******************/////////////////");
    console.log(test);
});
app.get('/addDetails', function (req, res) {
    faddDetails.addDetails(gAccessToken, gRefreshAccessToken, con, req, res);
});
app.get('/read_api', function (req, res) {
    fs.readFile("/home/admin1/Desktop/qb/OAuth2.0-demo-nodejs-master/refreshToken", "utf8", function (err, data) {
        // console.log("refresh token from text file");
        // console.log(data);

        gRefreshAccessToken = data;
        fs.readFile("/home/admin1/Desktop/qb/OAuth2.0-demo-nodejs-master/accessToken", "utf8", function (err, data2) {
            // console.log("access token from text file");
            // console.log(data2);
            gAccessToken = data2;
            res.redirect('http://localhost:3000/call_api');
        });

    });

});

app.get('/call_api', function (req, res) {
    fcallApi.setTokenApi(gAccessToken,gRefreshAccessToken,oauthClient,req,res);
    // console.log("call api session");
    // var token;
    // oauthClient.refreshToken = gRefreshAccessToken;
    // oauthClient.accessToken = gAccessToken;
    // console.log("in call access token//////////////////////////" + gAccessToken);

    // var wer = fcallme.callme(gRefreshAccessToken,oauthClient).then(function () {
    //     console.log("in call api test variable ");
    //     console.log(test);
    //     fs.readFile("/home/admin1/Desktop/qb/OAuth2.0-demo-nodejs-master/refreshToken", "utf8", function (err, data) {
    //         console.log("refresh token from text file");
    //         console.log(data);
    
    //         gRefreshAccessToken = data;
    //         fs.readFile("/home/admin1/Desktop/qb/OAuth2.0-demo-nodejs-master/accessToken", "utf8", function (err, data2) {
    //             console.log("access token from text file");
    //             console.log(data2);
    //             gAccessToken = data2;
    //             // gAccessToken= fcallme.gAccessToken;
    //             console.log("gaccesstoken in app.js after refresh.js file :::::::::::::");
    //             console.log(gAccessToken);
    //             // gRefreshAccessToken= fcallme.gRefreshAccessToken;
    //             if (gAccessToken == undefined) {
        
    //                 res.status(401);
    //                 console.log("eror token status");
    //                 console.log(res.statusCode);
    //                 res.send("no token for u");
    //             }
    //             else {
        
    //                 console.log("new refresh token ::::::::::::::::::::::::::::::");
    //                 console.log(gRefreshAccessToken);
    //                 token = gAccessToken;
    //                 console.log("gaccessToken:::::::::::::::::" + token);
    //                 if (!token) return res.json({ error: 'Not authorized' })
        
    //                 var url = config.sandbox_api_uri + '123146204102474' + "/query?query=Select * from Customer WHERE Id= '85'"
    //                 var requestObj = {
    //                     url: url,
    //                     headers: {
    //                         'Authorization': 'Bearer ' + token,
    //                         'Accept': 'application/json'
    //                     }
    //                 }
        
    //                 // Make API call
    //                 request(requestObj, function (err, response) {
    //                     console.log("response status code call api");
    //                     console.log(response.statusCode);
        
    //                     // res.send(response.body);
    //                     res.redirect('http://localhost:3000/addDetails');
        
    //                 });
    //             }
    //             console.log("here new token nnnnnnnnnnnnnnnnn");
    //             // res.redirect('http://localhost:3000/call_api');
    //         });
    
    //     });
    //     // gAccessToken= fcallme.gAccessToken;
    //     // console.log("gaccesstoken in app.js after refresh.js file :::::::::::::");
    //     // console.log(gAccessToken);
    //     // gRefreshAccessToken= fcallme.gRefreshAccessToken;
    //     // if (gAccessToken == undefined) {

    //     //     res.status(401);
    //     //     console.log("eror token status");
    //     //     console.log(res.statusCode);
    //     //     res.send("no token for u");
    //     // }
    //     // else {

    //     //     console.log("new refresh token ::::::::::::::::::::::::::::::");
    //     //     console.log(gRefreshAccessToken);
    //     //     token = gAccessToken;
    //     //     console.log("gaccessToken:::::::::::::::::" + token);
    //     //     if (!token) return res.json({ error: 'Not authorized' })

    //     //     var url = config.sandbox_api_uri + '123146204102474' + "/query?query=Select * from Customer WHERE Id= '85'"
    //     //     var requestObj = {
    //     //         url: url,
    //     //         headers: {
    //     //             'Authorization': 'Bearer ' + token,
    //     //             'Accept': 'application/json'
    //     //         }
    //     //     }

    //     //     // Make API call
    //     //     request(requestObj, function (err, response) {
    //     //         console.log("response status code call api");
    //     //         console.log(response.statusCode);

    //     //         // res.send(response.body);
    //     //         res.redirect('http://localhost:3000/addDetails');

    //     //     });
    //     // }
    //     // console.log("here new token nnnnnnnnnnnnnnnnn");
    // });


});
// app.get('/addDetails', function (req, res) {
//     con.query("SELECT storeId FROM QBids", function (err, qbdata, fields) {
//         // console.log(qbdata);
//         // console.log("******************");
//         qbdata3 = qbdata;
//         var sit = JSON.stringify(qbdata);
//         var sit2 = JSON.parse(sit);
//         // console.log(sit2);
//         //   console.log(qbdata3.storeId);
//         console.log("////////////////////////");
//         console.log(sit2.storeId);
//         console.log("------------------------");
//         con.query("SELECT *FROM `order` ord INNER JOIN order_status ordstatus ON ord.id = ordstatus.order_id INNER JOIN store_warehouse_shipper ON ord.associate_id = store_warehouse_shipper.id INNER JOIN store ON store_warehouse_shipper.store_id = store.id INNER JOIN account ON store.account_id = account.id INNER JOIN loan ON ord.id = loan.order_id WHERE ordstatus.status = 'delivered' LIMIT 17,1",
//             function (err, rows, fields) {

//                 if (err) throw err;
//                 rows.forEach(element => {
//                     var addstore = false;
//                     var totaladdstore = true;
//                     sit2.forEach(qbid => {
//                         // console.log("element.store_id-------->");
//                         // console.log(element.store_id);
//                         // console.log("qbid-------->");
//                         // console.log(qbid.storeId);
//                         if (element.store_id == qbid.storeId) {
//                             // console.log("customer already present");
//                             addstore = false;
//                         }
//                         else {
//                             //  console.log("add customer code");
//                             addstore = true;
//                         }
//                         totaladdstore = totaladdstore && addstore;
//                         // console.log("--------->" + element.store_id + "----------->" + totaladdstore);
//                     });
//                     if (totaladdstore) {
//                         console.log("add customer code" + element.store_id);
//                         addStore(element);


//                     }
//                     else {
//                         console.log("customer already present" + element.store_id);
//                     }
//                     addTransaction(element);
//                 });
//                 // res.send(rows);
//             });

//     });
// });
// const addTransaction = function (TransactionDetails) {
//     console.log("add transaction" + TransactionDetails.store_id);
//     var token;
//     con.query("SELECT qbId FROM QBids WHERE storeId = " + TransactionDetails.store_id, function (err, rows) {
//         console.log(rows);
//         var p = JSON.stringify(rows);
//         var result2 = JSON.parse(p);
//         // console.log('///////////////');
//         console.log(result2);
//         // console.log('///////////////');
//         // console.log(result2[0].qbId);
//         var qbid_trans = result2[0].qbId;
//         console.log("qbid_transsss");
//         console.log(qbid_trans);
//         // console.log('///////////////');
//         // console.log(result2);

//         if (gAccessToken == undefined) {
//             console.log("no token for u");
//         }
//         else {

//             var qbdata3;
//             // console.log("qbdata3===========");
//             // console.log(qbdata3);


//             // con.query("SELECT *FROM `order` ord INNER JOIN order_status ordstatus ON ord.id = ordstatus.order_id INNER JOIN store_warehouse_shipper ON ord.associate_id = store_warehouse_shipper.id INNER JOIN store ON store_warehouse_shipper.store_id = store.id INNER JOIN account ON store.account_id = account.id WHERE ordstatus.status = 'delivered' LIMIT 2",
//             //     function (err, rows, fields) {


//             gData = TransactionDetails;
//             console.log(gData.address);

//             token = gAccessToken;

//             if (!token) return res.json({ error: 'Not authorized' })
//             var url1 = config.sandbox_api_uri + '123146204102474' + '/invoice'

//             console.log("***************************");
//             // console.log(gData);
//             var kTPC = parseFloat(gData.total_product_cost);
//             var kDC = parseFloat(gData.delivery_charges);
//             var kPC = parseFloat(gData.processing_charges);
//             console.log("gdata");
//             var body2 = {
//                 "Line": [
//                     {
//                         "Id": "1",
//                         "LineNum": 1,
//                         "Description": "Assorted Groceriesyyyyyyy",
//                         "Amount": kTPC,
//                         "DetailType": "SalesItemLineDetail",
//                         "SalesItemLineDetail": {

//                             "UnitPrice": kTPC,
//                             "Qty": 1
//                         }
//                     },
//                     {
//                         "Id": "2",
//                         "LineNum": 2,
//                         "Description": "Delivery Charge",
//                         "Amount": kDC,
//                         "DetailType": "SalesItemLineDetail",
//                         "SalesItemLineDetail":
//                         {

//                             "UnitPrice": kDC,
//                             "Qty": 1

//                         }
//                     },
//                     {
//                         "Id": "3",
//                         "LineNum": 3,
//                         "Description": "Processing Fees",
//                         "Amount": kPC,
//                         "DetailType": "SalesItemLineDetail",
//                         "SalesItemLineDetail":
//                         {

//                             "UnitPrice": kPC,
//                             "Qty": 1

//                         }
//                     },
//                     {
//                         "Amount": 3000,
//                         "DetailType": "SubTotalLineDetail",
//                         "SubTotalLineDetail": {}
//                     }
//                 ], "CustomerMemo": {
//                     "value": "Thank you for your business and have a great day!"
//                 },
//                 "CustomerRef":
//                 {
//                     "value": qbid_trans
//                 }
//             };
//             console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
//             console.log(body2);
//             console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
//             var body1 = {
//                 "Line": [
//                     {
//                         "Id": "1",
//                         "LineNum": 1,
//                         "Description": "Assorted Groceries",
//                         "Amount": gData.total_product_cost,
//                         "DetailType": "SalesItemLineDetail",
//                         "SalesItemLineDetail":
//                         {
//                             "ItemRef":
//                             {
//                                 "name": "Assorted Groceriesy"
//                             },
//                             "UnitPrice": gData.total_product_cost,
//                             "Qty": 1

//                         }
//                     },
//                     {
//                         "Id": "2",
//                         "LineNum": 2,
//                         "Description": "Delivery Charge",
//                         "Amount": gData.delivery_charges,
//                         "DetailType": "SalesItemLineDetail",
//                         "SalesItemLineDetail":
//                         {
//                             "ItemRef":
//                             {

//                                 "name": "Delivery Charge"
//                             },
//                             "UnitPrice": gData.delivery_charges,
//                             "Qty": 1

//                         }
//                     },
//                     {
//                         "Id": "3",
//                         "LineNum": 3,
//                         "Description": "Processing Fees",
//                         "Amount": gData.processing_charges,
//                         "DetailType": "SalesItemLineDetail",
//                         "SalesItemLineDetail":
//                         {
//                             "ItemRef":
//                             {

//                                 "name": "Processing Fee"
//                             },
//                             "UnitPrice": gData.processing_charges,
//                             "Qty": 1

//                         }
//                     },
//                     {

//                         "DetailType": "SubTotalLineDetail",
//                         "SubTotalLineDetail":
//                             {}
//                     }],
//                 "CustomerMemo": {
//                     "value": "Thank you for your business and have a great day!"
//                 },
//                 "CustomerRef":
//                 {
//                     "value": qbid_trans
//                 }
//             };
//             request.post({
//                 url: url1,
//                 auth: {
//                     'bearer': token
//                 },
//                 json: body2

//             }, function (err, res) {
//                 console.log("***********************");
//                 console.log(res.body); console.log("***********************");


//                 // con.query("INSERT INTO QBids SET ?", da, function (err, result) {
//                 //     if (err) throw err;

//                 //     console.log("1 new customer record inserted");

//                 // });

//                 // console.log(res.body.Id);




//                 console.log("***********************");
//                 console.log(typeof res);

//             });

//             // });
//             // });

//         }
//     });

// };
// const addStore = function (storeDetails) {
//     console.log("add customer" + gAccessToken);
//     var token;
//     if (gAccessToken == undefined) {
//         console.log("no token for u");
//     }
//     else {

//         var qbdata3;
//         console.log("qbdata3===========");
//         console.log(qbdata3);


//         // con.query("SELECT *FROM `order` ord INNER JOIN order_status ordstatus ON ord.id = ordstatus.order_id INNER JOIN store_warehouse_shipper ON ord.associate_id = store_warehouse_shipper.id INNER JOIN store ON store_warehouse_shipper.store_id = store.id INNER JOIN account ON store.account_id = account.id WHERE ordstatus.status = 'delivered' LIMIT 2",
//         //     function (err, rows, fields) {


//         gData = storeDetails;
//         console.log(gData.address);

//         token = gAccessToken;

//         if (!token) return res.json({ error: 'Not authorized' })
//         var url1 = config.sandbox_api_uri + '123146204102474' + '/customer'

//         console.log("***************************");
//         // console.log(gData);
//         console.log("gdata");
//         var body1 = {
//             "BillAddr": {
//                 "Line1": gData.city,
//                 "City": gData.city,
//                 "Country": gData.country,
//                 "CountrySubDivisionCode": "-",
//                 "PostalCode": gData.pincode
//             },
//             // "Notes": "Here are other details.",
//             "Title": "Mr/Mrs",
//             "GivenName": "",
//             "MiddleName": "",
//             "FamilyName": "",
//             "Suffix": "",
//             "FullyQualifiedName": gData.customer_name,
//             "CompanyName": gData.name,
//             "DisplayName": gData.display_name,
//             "PrimaryPhone": {
//                 "FreeFormNumber": gData.phone
//             },
//             "PrimaryEmailAddr": {
//                 "Address": gData.email
//             },

//         };
//         request.post({
//             url: url1,
//             auth: {
//                 'bearer': token
//             },
//             json: body1

//         }, function (err, res) {
//             if (err) throw err;
//             else {
//                 console.log("***********************");
//                 console.log(res.body); console.log("***********************");

//                 console.log(res.body.Customer.Id); console.log("***********************");
//                 var da = {
//                     storeId: gData.store_id,
//                     qbId: res.body.Customer.Id
//                 };
//                 con.query("INSERT INTO QBids SET ?", da, function (err, result) {
//                     if (err) throw err;

//                     console.log("1 new customer record inserted");
//                     // return res.body.Customer.Id;

//                 });

//                 console.log(res.body.Id);




//                 console.log("***********************");
//                 console.log(typeof res);

//             }
//         });

//         // });
//         // });

//     }
// }
// app.post('/addcustomer', function (req, res) {
//     console.log("add customer" + gAccessToken);
//     var token;
//     if (gAccessToken == undefined) {
//         res.send("no token for u");
//     }
//     else {

//         var qbdata3;
//         console.log("qbdata3===========");
//         console.log(qbdata3);


//         con.query("SELECT *FROM `order` ord INNER JOIN order_status ordstatus ON ord.id = ordstatus.order_id INNER JOIN store_warehouse_shipper ON ord.associate_id = store_warehouse_shipper.id INNER JOIN store ON store_warehouse_shipper.store_id = store.id INNER JOIN account ON store.account_id = account.id WHERE ordstatus.status = 'delivered' LIMIT 10,2",
//             function (err, rows, fields) {
//                 if (err) throw err;
//                 // rows.forEach(element => {
//                 //       qbdata3.forEach(qbid => {
//                 //           console.log("element.store_id-------->");
//                 //           console.log(element.store_id);
//                 //           console.log("qbid-------->");
//                 //           console.log(qbid);
//                 //         if(element.store_id==qbid){
//                 //             console.log("customer already present");
//                 //         }
//                 //         else {
//                 //              console.log("add customer code");
//                 //         }
//                 //       });                    
//                 // });
//                 gData = rows[1];
//                 console.log(gData.address);

//                 token = gAccessToken;

//                 if (!token) return res.json({ error: 'Not authorized' })
//                 var url1 = config.sandbox_api_uri + '123146204102474' + '/customer'

//                 console.log("***************************");
//                 console.log(gData);
//                 console.log("gdata");
//                 var body1 = {
//                     "BillAddr": {
//                         "Line1": gData.city,
//                         "City": gData.city,
//                         "Country": gData.country,
//                         "CountrySubDivisionCode": "-",
//                         "PostalCode": gData.pincode
//                     },
//                     // "Notes": "Here are other details.",
//                     "Title": "Mr/Mrs",
//                     "GivenName": "",
//                     "MiddleName": "",
//                     "FamilyName": "",
//                     "Suffix": "",
//                     "FullyQualifiedName": gData.customer_name,
//                     "CompanyName": gData.name,
//                     "DisplayName": gData.display_name,
//                     "PrimaryPhone": {
//                         "FreeFormNumber": gData.phone
//                     },
//                     "PrimaryEmailAddr": {
//                         "Address": gData.email
//                     },

//                 };
//                 request.post({
//                     url: url1,
//                     auth: {
//                         'bearer': token
//                     },
//                     json: body1

//                 }, function (err, res) {
//                     console.log("***********************");
//                     console.log(res.body); console.log("***********************");

//                     console.log(res.body.Customer.Id); console.log("***********************");
//                     var da = {
//                         storeId: gData.store_id,
//                         qbId: res.body.Customer.Id
//                     };
//                     con.query("INSERT INTO QBids SET ?", da, function (err, result) {
//                         if (err) throw err;

//                         console.log("1 new customer record inserted");

//                     });

//                     console.log(res.body.Id);




//                     console.log("***********************");
//                     console.log(typeof res);

//                 });

//             });
//         // });

//     }

//     // console.log(res.body);
//     res.send("added");
// });
app.get('/growsariData', function (req, res) {
    var qbdata2;
    console.log("response code of qbtrail");
    con.query("SELECT * from QBids", function (err, qbdata, fields) {
        if (err) throw err;
        console.log("//////////")
        console.log(qbdata);
        qbdata2 = qbdata;

        console.log("qbdata2:::::::::::::::::::::");
        console.log(qbdata2);
        con.query("SELECT *FROM `order` ord INNER JOIN order_status ordstatus ON ord.id = ordstatus.order_id INNER JOIN store_warehouse_shipper ON ord.associate_id = store_warehouse_shipper.id INNER JOIN store ON store_warehouse_shipper.store_id = store.id INNER JOIN account ON store.account_id = account.id WHERE ordstatus.status = 'delivered' LIMIT 1", function (err, rows, fields) {
            if (err) throw err;
            rows.forEach(element => {
                console.log(element.store_id);
            });
            console.log("growsari data");
            console.log(rows[0]);
            gData = rows[0];
            console.log("line1 " + gData.address);
            console.log("city " + gData.city);
            console.log("country " + gData.country);
            console.log("postal code " + gData.pincode);
            console.log("Fully Qualified name " + gData.customer_name);
            console.log("Company " + gData.name);
            console.log("Display Name " + gData.display_name);
            console.log("free for number " + gData.phone);
            console.log("email " + gData.email);

            console.log("growsari daat");
            res.send(JSON.stringify(rows, null, 2));
        });
    });
});
// const callme = async function () {
//     console.log("in call me function refresh token============ " + gRefreshAccessToken);
//     var xy;
//     xy = await oauthClient.refreshUsingToken(gRefreshAccessToken)
//         .then(function (authResponse) {
//             var tfg = JSON.stringify(authResponse.getJson());
//             objfg = JSON.parse(tfg);
//             gAccessToken = objfg.access_token;
//             gRefreshAccessToken = objfg.refresh_token;
//             fs.writeFile("/home/admin1/Desktop/qb/OAuth2.0-demo-nodejs-master/accessToken", gAccessToken, function (err) {
//                 if (err) {
//                     return console.log(err);
//                 }
//                 fs.writeFile("/home/admin1/Desktop/qb/OAuth2.0-demo-nodejs-master/refreshToken", gRefreshAccessToken, function (err) {
//                     if (err) {
//                         return console.log(err);
//                     }
//                     console.log("The new refresh file was saved!");
//                     fs.writeFile("/home/admin1/Desktop/qb/OAuth2.0-demo-nodejs-master/Token", tfg, function (err) {
//                         if (err) {
//                             return console.log(err);
//                         }
//                         console.log("The new token file was saved!");
//                         return xy;

//                     });
//                 });

//                 console.log("The file was saved!");
//             });


//         })
//         .catch(function (e) {
//             console.error("The error message is er:---------------" + e);
//             console.error(e.intuit_tid);
//         });


// };



// app.get('/test', function (req, res) {
//     var sd = 15
//     con.query("SELECT qbId FROM QBids WHERE storeId = " + sd, function (err, rows) {
//         console.log(rows);
//         var p = JSON.stringify(rows);
//         var result2 = JSON.parse(p);
//         console.log('///////////////');
//         console.log(result2.qbId);
//         console.log('///////////////');
//         console.log(result2[0].qbId);
//         console.log('///////////////');
//         console.log(result2);
//     });
// });
// app.get('/refreshAccessToken', function (req, res) {

//     // save the access token somewhere on behalf of the logged in user
//     var qbo = new QuickBooks(config.clientId,
//         config.clientSecret,
//         accessToken.access_token, /* oAuth access token */
//         false, /* no token secret for oAuth 2.0 */
//         realmId,
//         config.useSandbox, /* use a sandbox account */
//         true, /* turn debugging on */
//         4, /* minor version */
//         '2.0', /* oauth version */
//         accessToken.refresh_token /* refresh token */);

//     qbo.refreshAccessToken(function (err, refreshToken) {
//         if (err) {
//             console.log(err);
//             res.send(err);
//         }
//         else {
//             console.log("The response refresh is :" + JSON.stringify(refreshToken, null, 2));
//             res.send(refreshToken);
//         }
//     });


// });
// app.get('/getCompanyInfo', function (req, res) {

//     console.log("//////////////////////" + accessToken);
//     console.log("/////////////////////" + realmId);
//     // save the access token somewhere on behalf of the logged in user
//     var qbo = new QuickBooks(config.clientId,
//         config.clientSecret,
//         accessToken.access_token, /* oAuth access token */
//         false, /* no token secret for oAuth 2.0 */
//         realmId,
//         config.useSandbox, /* use a sandbox account */
//         true, /* turn debugging on */
//         4, /* minor version */
//         '2.0', /* oauth version */
//         accessToken.refresh_token /* refresh token */);

//     qbo.getCompanyInfo(realmId, function (err, companyInfo) {
//         if (err) {
//             console.log(err);
//             res.send(err);
//         }
//         else {
//             console.log("The response is :" + JSON.stringify(companyInfo, null, 2));
//             res.send(companyInfo);
//         }
//     });
// });


// Start server on HTTP (will use ngrok for HTTPS forwarding)
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
