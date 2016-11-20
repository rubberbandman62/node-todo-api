const bcrypt = require('bcryptjs');

var password = '1234567';
var hashPassword1 ='$2a$10$SWW0/41a1UN1wq8ykmmxTOQUOOgGzqcr.0/bq1cDaskGqsvDnmYce';
// var hashPassword2 ='$2a$10$U7E99Rs2TFLr/4AMfnLqb.zgKUq73DHnuA0RK75ulfdzKA.EOHBNK';
// var hashPassword3 ='$2a$10$4H2kZ1Cs74GZPhADdBvCTe9mXdZUMm6yemv9BdOINBWCNy5pZ7dFO';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         hashPassword = hash;
//         console.log(hashPassword);
//     });
// });

bcrypt.compare(password, hashPassword1, (err, res) => {
    console.log(res);
});
// bcrypt.compare(password, hashPassword1, (err, res) => {
//     console.log(res);
// });
// bcrypt.compare(password, hashPassword1, (err, res) => {
//     console.log(res);
// });
