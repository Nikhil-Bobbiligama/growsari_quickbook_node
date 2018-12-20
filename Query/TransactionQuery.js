const readTransation = function (con, callback) {
    con.query("SELECT *FROM `order` ord INNER JOIN order_status ordstatus ON ord.id = ordstatus.order_id INNER JOIN store_warehouse_shipper ON ord.associate_id = store_warehouse_shipper.id INNER JOIN store ON store_warehouse_shipper.store_id = store.id INNER JOIN account ON store.account_id = account.id INNER JOIN loan ON ord.id = loan.order_id WHERE ordstatus.status = 'delivered' LIMIT 135,10",
        function (err, rows, fields) {
            callback(rows);
        });
}
const writeQBID = function (con, da, callback) {
    try {
        con.query("INSERT INTO QBids SET ?", da, function (err, result) {
            if (err) throw err;

            console.log("1 new customer record inserted " + da);
            callback("ok");

        });
    }
    catch (e) {
        console.log("no qbid from res.body for store id==" + storeDetails.store_id);
    }
}
const getQBID = function (con, store_id, callback) {
    con.query("SELECT qbId FROM QBids WHERE storeId = " + store_id, function (err, rows) {
        callback(rows);
    });
}
const getStoreIds = function (con, callback) {
    con.query("SELECT storeId FROM QBids", function (err, qbdata, fields) {

        callback(qbdata);
    });
}
module.exports = { readTransation, writeQBID, getQBID, getStoreIds }