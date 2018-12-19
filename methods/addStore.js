
var config = require('../config.json');;
var request = require('request');
var faddstore= require('../models/addStoreFormat');

var faddTransaction = require('../methods/addTransaction');
const addStore = async function (gAccessToken,gRefreshAccessToken,con,storeDetails) {
    console.log("add customer" );
    var gData;
    var token;
    if (gAccessToken == undefined) {
        console.log("no token for u");
    }
    else {

        var qbdata3;
        gData = storeDetails;
        console.log("adding customer check details::::");
        token = gAccessToken;
        var body2= faddstore.setAddStore(gData);
        console.log("new file for seting data store");
        console.log(body2);
        if (!token) return res.json({ error: 'Not authorized' })
        var url1 = config.sandbox_api_uri + '123146204102474' + '/customer'
        // console.log(body2);
        await request.post({
            url: url1,
            auth: {
                'bearer': token
            },
            json: body2

        }, function (err, res) {
            if (err){ 
                console.log("adding customer error");
                throw err;}
            else {
                console.log("res.body.customer.Id::::::::::::::");
              try{
                var da = {
                    storeId: gData.store_id,
                    qbId: res.body.Customer.Id
                };
                con.query("INSERT INTO QBids SET ?", da, function (err, result) {
                    if (err) throw err;

                    console.log("1 new customer record inserted "+da);
                    faddTransaction.addTransaction(gAccessToken,gRefreshAccessToken,con,storeDetails);

                });
            }
            catch(e){
                   console.log("no qbid from res.body for store id=="+storeDetails.store_id);
            }

            }
        });

    }
}
module.exports = {addStore}