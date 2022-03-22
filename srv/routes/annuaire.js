const express = require('express');
const router = express.Router();
const query = require('../lib/query');

const getAnnuaire = async (req, res) => {
    try {
        // const recherche = req.query.recherche;

        const resBdd = await query(req, {
            sql: 'SELECT S.DOMAIN, S.IPV4, S.IPV6, S.UPDATE_IPV6, S.DATE_CREATION FROM SITES S LIMIT 30;'
        });

        res.send(resBdd);
    } catch (err) {
        console.error(err);
    }
};

const getLastTransiction = async (req, res) => {
    try {
        const resBdd = await query(req, {
            sql: 'SELECT S.DOMAIN, S.IPV4, S.IPV6, S.UPDATE_IPV6, S.DATE_CREATION FROM SITES S WHERE S.UPDATE_IPV6 IS NOT NULL ORDER BY S.SITE_ID DESC LIMIT 10;'
        });

        res.send(resBdd);
    } catch (err) {
        console.error(err);
    }
};

router
    .route('/annuaire')
    .get(getAnnuaire);

router
    .route('/annuaire/transictionIpv6')
    .get(getLastTransiction);

module.exports = router;