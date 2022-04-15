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

const getLastMonths = async (req, res) => {
    try {
        const resultatsIpv6 = await query(req, {
            sql: 'select S.DATE_CREATION from SITES S where S.DATE_CREATION > curdate() - interval (dayofmonth(curdate()) - 1) day - interval 6 month and S.IPV6 = TRUE order by S.DATE_CREATION'
        });
        const resultatsIpv4 = await query(req, {
            sql: 'select S.DATE_CREATION from SITES S where S.DATE_CREATION > curdate() - interval (dayofmonth(curdate()) - 1) day - interval 6 month and S.IPV4 = TRUE order by S.DATE_CREATION'
        });
        const obj6 = {};
        const obj4 = {};
        const d = new Date();
        const tabMonth = [];
        const newTab6 = [];
        const newTab4 = [];
        for (const resultat of resultatsIpv6) {
            const dateCreation = new Date(resultat.DATE_CREATION);
            const month = dateCreation.getMonth();
            obj6[month] = (obj6[month] || 0)+1;
        }
        for (const resultat of resultatsIpv4) {
            const dateCreation = new Date(resultat.DATE_CREATION);
            const month = dateCreation.getMonth();
            obj4[month] = (obj4[month] || 0)+1;
        }
        for(let i = 0; i < 6; i++){
            tabMonth[i] = (d.getMonth() - i) < 0 ? 12 + (d.getMonth() - i) : (d.getMonth() - i);
        }
        tabMonth.forEach(month => {
            newTab6.push(obj6[month] || 0);
            newTab4.push(obj4[month] || 0);
        });
        const tab6 = newTab6.reverse();
        const tab4 = newTab4.reverse();

        for (let i = 0; i < tab6.length; i++) {
            let somme6 = 0;
            let somme4 = 0;
            for (let y = 0; y < i+1; y++) {
                somme6 += tab6[y];
                somme4 += tab4[y];
            }
            tab6[i] = somme6;
            tab4[i] = somme4;
        }

        res.send({ipv6: tab6, ipv4: tab4});
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
    .route('/statistique/lastMonths')
    .get(getLastMonths);

module.exports = router;