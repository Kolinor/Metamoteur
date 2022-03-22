const express = require('express');
const router = express.Router();
const query = require('../lib/query');

const getStatistique = async (req, res) => {
    try {
        const result = {};
        const resBdd = await query(req, {
            sql: 'SELECT COUNT(*) AS "count", COUNT(case when S.IPV6 = 1 then 1 end) as "ipv6" FROM SITES S;'
        });

        const data = resBdd.shift();
        const nbTotalSites = Number(data.count);
        const nbTotalSitesIpv6 = Number(data.ipv6);
        const pourcentageIpv6 = parseInt(nbTotalSitesIpv6 / nbTotalSites * 100);

        result.totalSites = nbTotalSites;
        result.totalSitesIpv6 = nbTotalSitesIpv6;
        result.pourcentageIpv6 = pourcentageIpv6;

        res.send(result);
    } catch (err) {
        console.error(err);
    }
};

router
    .route('/statistique')
    .get(getStatistique);

module.exports = router;