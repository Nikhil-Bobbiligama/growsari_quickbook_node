const ReadToken = async function (con, callback) {
    con.query("SELECT * FROM TokenTable", function (err, row1, fields) {
        // console.log(row1);
        // console.log("in read token.js");
        var fg = JSON.stringify(row1);
        fg = JSON.parse(fg);
        // console.log("in ReadToken file");
        // console.log(fg[0]);

        callback(fg[0]);
    });
}
module.exports = { ReadToken }