
var config = require('../config.json');
var request = require('request');
var faddTransaction = require('../models/addTransactionFormat');
const addTransaction = function (gAccessToken,gRefreshAccessToken,con,TransactionDetails) {
    console.log("add transaction store_id" + TransactionDetails.store_id);
    var token;
    con.query("SELECT qbId FROM QBids WHERE storeId = " + TransactionDetails.store_id, function (err, rows) {
        // console.log(rows);
        var p = JSON.stringify(rows);
        var result2 = JSON.parse(p);
        console.log("result of querying qbids with store_id "+TransactionDetails.store_id);
        console.log(result2[0]);
        var qbid_trans = result2[0].qbId;
        console.log("qbid_transsss");
        console.log(qbid_trans);
        console.log('store_id');
        console.log(TransactionDetails.store_id)

        if (gAccessToken == undefined) {
            console.log("no token for u");
        }
        else {



            gData = TransactionDetails;
            token = gAccessToken;

            if (!token) return res.json({ error: 'Not authorized' })
            var url1 = config.sandbox_api_uri + '123146204102474' + '/invoice'
            var body2 = faddTransaction.setAddTransaction(gData,qbid_trans);
            console.log("new body2 for add format transactions");
            console.log(body2);
            request.post({
                url: url1,
                auth: {
                    'bearer': token
                },
                json: body2

            }, function (err, res) {
                console.log("transaction completed order id :"+TransactionDetails.order_id);

            });

            // });
            // });

        }
    });

};
module.exports= {addTransaction}