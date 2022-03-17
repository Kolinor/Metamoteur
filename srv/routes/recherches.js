const express = require('express');
const router = express.Router();
const query = require('../lib/query');
const search = require('../lib/googlesearch');
const { isAvailableIpv6, isAvailableIpv4 } = require('../lib/testDomain');

const recherche = async (req, res) => {
    try {
        const data = req.body;
        const recherche = data.recherche;
        const recherches = await search(recherche);
        const resultats = recherches.results;
        const regexDomain = /^(?:http:\/\/|www\.|https:\/\/)([^\/]+)/;
        const a = [];
        console.time('test');
        for (const resultat of resultats) {
            const link = resultat.link;
            const match = link.match(regexDomain);
            const domain = match && match.length && match[1];

            if (!domain) continue;

            const resBdd = await query(req, {
                sql: 'SELECT * FROM SITES S WHERE S.DOMAIN = "' + domain + '";'
            });
            const site = resBdd.data && resBdd.data.length && resBdd.data[0];

            if (!site) {
                const availableIpv4 = await isAvailableIpv4(domain);
                const availableIpv6 = await isAvailableIpv6(domain);

                await query(req, {
                    sql: 'insert into SITES (DOMAIN, IPV4, IPV6) values (?,?,?);',
                    params: [
                        domain,
                        availableIpv4,
                        availableIpv6
                    ]
                });
            }

            const isSiteIpv4 = !!(site && site.IPV4);
            const isSiteIpv6 = !!(site && site.IPV6);

            console.log(isSiteIpv4, isSiteIpv6);

            if (isSiteIpv6) a.push(link + ' : '+ isSiteIpv6);
            // console.log(link + ' : '+ await isAvailableIpv6(domain));
        }
        console.timeEnd('test');
        // const test = await query(req, {
        //     sql: 'select * from sites;'
        // });
        res.send(a);
    } catch(err) {
        console.error(err);
    }
};

router
    .route('/recherche')
    .get(recherche);

module.exports = router;