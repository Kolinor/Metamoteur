const mariadb = require('mariadb');
const config = require('../../conf.json');

const pool = mariadb.createPool({
    host: config.mariadb.host,
    user: config.mariadb.user,
    password: config.mariadb.password,
    connectionLimit: config.mariadb.connectionLimit,
    database: config.mariadb.db,
});

const query = async (query) => {
    let conn;
    try {
        console.log(pool);
        conn = await pool.getConnection();
        console.log(conn);
        const params = query.params;
        let res;

        if (!params) {
            res = await conn.query(query.sql);
            // rows: [ {val: 1}, meta: ... ]
        } else {
            res = await conn.query(query.sql, params);
            // res: { affectedRows: 1, insertId: 1, warningStatus: 0 }  
        }

        console.log(res);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
};

module.exports = query;