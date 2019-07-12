const pool = require('pg').Pool();

function query(q, values) {
    return new Promise((resolve, reject) => {
        pool.query(q, values, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

module.exports = { query, pool };
