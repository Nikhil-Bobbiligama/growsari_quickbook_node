var queryString = require('query-string');
var faddStore = require('../methods/addStore');
var faddTransaction = require('../methods/addTransaction');
var request = require('request');
var queryString = require('query-string');
var fs = require('fs');
var config = require('../config.json');
var bodyParser = require('body-parser');
const addDetails = function (gAccessToken, gRefreshAccessToken, con, req, res) {
    con.query("SELECT storeId FROM QBids", function (err, qbdata, fields) {
        var sit = JSON.stringify(qbdata);
        var sit2 = JSON.parse(sit);
        console.log(sit2.storeId);
        con.query("SELECT *FROM `order` ord INNER JOIN order_status ordstatus ON ord.id = ordstatus.order_id INNER JOIN store_warehouse_shipper ON ord.associate_id = store_warehouse_shipper.id INNER JOIN store ON store_warehouse_shipper.store_id = store.id INNER JOIN account ON store.account_id = account.id INNER JOIN loan ON ord.id = loan.order_id WHERE ordstatus.status = 'delivered' LIMIT 120,3",
            function (err, rows, fields) {
                if (err) throw err;
                rows.forEach(element => {
                    var addstore = false;
                    var totaladdstore = true;
                    sit2.forEach(qbid => {
                        if (element.store_id == qbid.storeId) {
                            addstore = false;
                        }
                        else {
                            addstore = true;
                        }
                        totaladdstore = totaladdstore && addstore;
                    });
                    if (totaladdstore) {
                        console.log("add customer code" + element.store_id);
                        faddStore.addStore(gAccessToken, gRefreshAccessToken, con, element).then(function () {
                            console.log("<--------------------------completed adding store-------------------->");
                        });

                    }
                    else {
                        console.log("customer already present" + element.store_id);
                        faddTransaction.addTransaction(gAccessToken, gRefreshAccessToken, con, element);
                    }

                });
            });

    });
}
module.exports = { addDetails }
