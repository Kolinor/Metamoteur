module.exports = async (req, query) => {
    let conn;
    try {
        const pool = req.pool;
        conn = await pool.getConnection();
        const params = query.params;

        if (!params) {
            return await conn.query(query.sql);
            // rows: [ {val: 1}, meta: ... ]
        }

        return await conn.query(query.sql, params);
        // res: { affectedRows: 1, insertId: 1, warningStatus: 0 }
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
};