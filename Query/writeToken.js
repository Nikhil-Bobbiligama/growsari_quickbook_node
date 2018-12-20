const writeQuery = function (con,newToken, callback) {
    con.query("UPDATE TokenTable SET ? WHERE TokenId = 1", newToken, function (err, result) {
        console.log("updated token into table from set token");
        callback("ok");
    });
}
module.exports ={writeQuery}