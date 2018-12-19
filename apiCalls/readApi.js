// app.get('/read_api', function (req, res) {
//     fs.readFile("/home/admin1/Desktop/qb/OAuth2.0-demo-nodejs-master/refreshToken", "utf8", function (err, data) {
//         console.log("refresh token from text file");
//         console.log(data);

//         gRefreshAccessToken = data;
//         fs.readFile("/home/admin1/Desktop/qb/OAuth2.0-demo-nodejs-master/accessToken", "utf8", function (err, data2) {
//             console.log("access token from text file");
//             console.log(data2);
//             gAccessToken = data2;
//             res.redirect('http://localhost:3000/call_api');
//         });

//     });

// });