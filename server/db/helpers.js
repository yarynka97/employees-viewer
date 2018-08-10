const mysql = require('mysql');
const {dbOptions} = require('../../config');

const connection = mysql.createConnection(dbOptions);

function query(selector){
    return new Promise ((resolve, reject) => {
        connection.query(selector, function (err, results, fields) {
            if (err) reject(err);
            resolve(results);
        });
    });
}

module.exports = {
    query
};
