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

        for (const resultat of resultats) {
            const link = resultat.link;
            const match = link.match(regexDomain);
            const domain = match && match.length && match[1];

            if (!domain) continue;

            a.push(link + ' : '+ await isAvailableIpv6(domain));
            // console.log(link + ' : '+ await isAvailableIpv6(domain));
        }
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