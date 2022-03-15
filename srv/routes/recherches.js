const express = require('express');
const router = express.Router();
const query = require('../lib/query');
const search = require('../lib/googlesearch');

const recherche = async (req, res) => {
    try {

        const test = await query(req, {
            sql: 'select * from sites;'
        });
        const test1 = await search("thomas");
        res.send(test1);
    } catch(err) {
        console.error(err);
    }
};

router
    .route('/recherche')
    .get(recherche);

module.exports = router;