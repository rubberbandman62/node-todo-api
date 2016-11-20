const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var secret = 'Not known by anyone else!';
// var message = 'I am Hartwig Toedter';
// var hash = SHA256(message).toString();
//
// console.log(message);
// console.log(hash);

//
var data = {
    user: 'hartwig'
}

console.log('Original data: ', data);
//
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + secret).toString()
// }
//
// // man in the middle
// token.data = 'irene';
// token.hash = SHA256(JSON.stringify(token.data)).toString();
// // man in the middle
//
// var resultHash = SHA256(JSON.stringify(token.data) + secret).toString();
// if (token.hash === resultHash) {
//     console.log('Data was not change!');
// } else {
//     console.log('ATTENTION: Data was changed! DO NOT TRUST!!!');
// }

var token = jwt.sign(data, secret);
console.log("Token:", token);

// man in the middle
data.user = 'Irene';
var token = jwt.sign(data, "some guessed secrets");
console.log("manipulated token:", token);
// man in the middle

var decoded = jwt.verify(token, secret);
console.log("Decoded data:", decoded)