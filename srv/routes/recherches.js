const express = require('express');
const router = express.Router();
const query = require('./lib/query');

const recherche = async (req, res) => {
    try {

        const res = await query({
            sql: 'select * from sites;'
        });
        console.log(res);
    } catch(err) {
        console.error(err);
    }
};

router
    .route('/recherche')
    .get(recherche);

module.exports = router;