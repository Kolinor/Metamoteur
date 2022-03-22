const express = require('express');
const router = express.Router();
const query = require('../lib/query');
const search = require('../lib/googlesearch');
const {isAvailableIpv6, isAvailableIpv4} = require('../lib/testDomain');

const recherche = async (req, res) => {
    try {
        const recherche = req.query.recherche;
        console.log(recherche);
        const recherches = await search(recherche);
        const resultats = recherches.results;
        const regexDomain = /^(?:http:\/\/|www\.|https:\/\/)([^\/]+)/;
        const resToSend = [];
        let numberOfResultIpv6 = 0;

        console.time('test');
        for (const resultat of resultats) {
            const link = resultat.link;
            const match = link.match(regexDomain);
            const domain = match && match.length && match[1];
            let availableIpv4 = null;
            let availableIpv6 = null;

            if (!domain) continue;

            const resBdd = await query(req, {
                sql: 'SELECT S.IPV4, S.IPV6, S.UPDATE_IPV6 FROM SITES S WHERE S.DOMAIN = "' + domain + '";'
            });
            const site = resBdd.length && resBdd.shift();

            if (site && !site.IPV6) {
                availableIpv6 = await isAvailableIpv6(domain);

                if (availableIpv6) {
                    await query(req, {
                        sql: 'UPDATE SITES SET UPDATE_IPV6 = CURRENT_TIMESTAMP, IPV6 = 1 WHERE DOMAIN = ?',
                        params: [
                            domain
                        ]
                    });
                }
            }

            if (!site) {
                availableIpv4 = await isAvailableIpv4(domain);
                availableIpv6 = await isAvailableIpv6(domain);

                await query(req, {
                    sql: 'insert into SITES (DOMAIN, IPV4, IPV6) values (?,?,?);',
                    params: [
                        domain,
                        availableIpv4,
                        availableIpv6
                    ]
                });
                numberOfResultIpv6++;
            } else {
                availableIpv4 = !!(site && site.IPV4);
                availableIpv6 = !!(site && site.IPV6);
            }

            if (availableIpv6 && numberOfResultIpv6 < 10) {
                resToSend.push({
                    ...resultat,
                    ipv4: availableIpv4,
                    ipv6: availableIpv6,
                    update_ipv6: site ? site.UPDATE_IPV6 : null
                });
                numberOfResultIpv6++;
            }
        }
        console.timeEnd('test');
        res.send(resToSend);
    } catch (err) {
        console.error(err);
    }
};

router
    .route('/recherche')
    .get(recherche);

module.exports = router;