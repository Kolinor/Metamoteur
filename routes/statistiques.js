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

const getLastSites = async (req, res) => {
    try {
        const resBdd = await query(req, {
            sql: 'select S.IPV4, S.IPV6, S.UPDATE_IPV6, S.DOMAIN from SITES S order by S.SITE_ID desc limit 10;'
        });

        res.send(resBdd);
    } catch (err) {
        console.error(err);
    }
};

const getLastSitesIpv6 = async (req, res) => {
    try {
        const resBdd = await query(req, {
            sql: 'select S.IPV4, S.IPV6, S.UPDATE_IPV6, S.DOMAIN from SITES S WHERE S.UPDATE_IPV6 IS NOT NULL order by S.SITE_ID desc limit 10;'
        });

        res.send(resBdd);
    } catch (err) {
        console.error(err);
    }
};

const getLast6MonthsIpv6 = async (req, res) => {
    try {
        const resultats = await query(req, {
            sql: 'select S.DATE_CREATION from SITES S where S.DATE_CREATION > curdate() - interval (dayofmonth(curdate()) - 1) day - interval 6 month and S.IPV6 = TRUE order by S.DATE_CREATION'
        });
        const obj = {};
        for (const resultat of resultats) {
            const dateCreation = new Date(resultat.DATE_CREATION);
            const month = dateCreation.getMonth();
            obj[month] = (obj[month] || 0)+1;
        }

        const d = new Date();
        const tabMonth = [];
        for(let i = 0; i < 6; i++){
            tabMonth[i] = (d.getMonth() - i) < 0 ? 12 + (d.getMonth() - i) : (d.getMonth() - i);
        }
        const newTab = [];
        tabMonth.forEach(month => {
            newTab.push(obj[month] || 0);
        });

        res.send(newTab.reverse());
    } catch (err) {
        console.error(err);
    }
};

router
    .route('/statistique')
    .get(getStatistique);

router
    .route('/statistique/dernierSites')
    .get(getLastSites);

router
    .route('/statistique/dernierSites/ipv6')
    .get(getLastSitesIpv6);

router
    .route('/statistique/lastMonths/ipv6')
    .get(getLast6MonthsIpv6);

module.exports = router;