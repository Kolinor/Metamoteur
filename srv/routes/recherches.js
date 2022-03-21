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
        const resToSend = [];
        let numberOfResultIpv6 = 0;

        console.time('test');
        // console.time('test1');
        for (const resultat of resultats) {
            const link = resultat.link;
            const match = link.match(regexDomain);
            const domain = match && match.length && match[1];
            let availableIpv4 = null;
            let availableIpv6 = null;

            if (!domain) continue;

            const resBdd = await query(req, {
                sql: 'SELECT * FROM SITES S WHERE S.DOMAIN = "' + domain + '";'
            });
            const site = resBdd.length && resBdd.shift();

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
                    ipv6: availableIpv6
                });
                numberOfResultIpv6++;
            }
            if (numberOfResultIpv6 === 10) {

                // console.timeEnd('test1');
            }
        }
        console.timeEnd('test');
        res.send(resToSend);
    } catch(err) {
        console.error(err);
    }
};

const rechercheTest = (req, res) => {
    res.send([
        {
            "title": "Wikipedia, the free encyclopedia",
            "link": "https://en.wikipedia.org/wiki/Main_Page",
            "description": "",
            "additional_links": [
                {
                    "text": "Wikipedia, the free encyclopediahttps://en.wikipedia.org › wiki › Main_Page",
                    "href": "https://en.wikipedia.org/wiki/Main_Page"
                },
                {
                    "text": "Deaths in 2022",
                    "href": "https://en.wikipedia.org/wiki/Deaths_in_2022"
                },
                {
                    "text": "Russian invasion of Ukraine",
                    "href": "https://en.wikipedia.org/wiki/Prelude_to_the_2022_Russian_invasion_of_Ukraine"
                },
                {
                    "text": "Wiki",
                    "href": "https://en.wikipedia.org/wiki/Wikipedia"
                },
                {
                    "text": "English language",
                    "href": "https://en.wikipedia.org/wiki/English_language"
                }
            ],
            "cite": {
                "domain": "https://en.wikipedia.org › wiki › Main_Page",
                "span": " › wiki › Main_Page"
            },
            "ipv4": true,
            "ipv6": true
        },
        {
            "title": "Wikipedia, the free encyclopedia",
            "link": "https://en.wikipedia.org/wiki/Main_Page",
            "description": "The Pali-Aike volcanic field is a volcanic field in Argentina that straddles the border with Chile. It is part of a family of back-arc volcanoes in ...",
            "additional_links": [
                {
                    "text": "Wikipedia, the free encyclopediahttps://en.wikipedia.org › wiki › Main_Page",
                    "href": "https://en.wikipedia.org/wiki/Main_Page"
                }
            ],
            "cite": {
                "domain": "https://en.wikipedia.org › wiki › Main_Page",
                "span": " › wiki › Main_Page"
            },
            "ipv4": true,
            "ipv6": true
        },
        {
            "title": "Wikipedia",
            "link": "https://www.wikipedia.org/",
            "description": "Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation.",
            "additional_links": [
                {
                    "text": "Wikipediahttps://www.wikipedia.org",
                    "href": "https://www.wikipedia.org/"
                }
            ],
            "cite": {},
            "ipv4": true,
            "ipv6": true
        },
        {
            "title": "Wikipedia - Apps on Google Play",
            "link": "https://play.google.com/store/apps/details?id=org.wikipedia&hl=en_US&gl=US",
            "description": "The best Wikipedia experience on your Mobile device. Ad-free and free of charge, forever. With the official Wikipedia app, you can search and explore 40+ ...",
            "additional_links": [
                {
                    "text": "Wikipedia - Apps on Google Playhttps://play.google.com › store › apps › details › id=org...",
                    "href": "https://play.google.com/store/apps/details?id=org.wikipedia&hl=en_US&gl=US"
                }
            ],
            "cite": {
                "domain": "https://play.google.com › store › apps › details › id=org...",
                "span": " › store › apps › details › id=org..."
            },
            "g_review_stars": " Rating: 4.5 · ‎673,479 votes · ‎Free · ‎Android · ‎Reference",
            "ipv4": true,
            "ipv6": true
        },
        {
            "title": "Wikipedia on the App Store",
            "link": "https://apps.apple.com/us/app/wikipedia/id324715238",
            "description": "Explore your world, find a quick fact, or dive down a Wikipedia rabbit hole with the official Wikipedia app for iOS. With more than 40 million articles across ...",
            "additional_links": [
                {
                    "text": "Wikipedia on the App Storehttps://apps.apple.com › app › wikipedia",
                    "href": "https://apps.apple.com/us/app/wikipedia/id324715238"
                }
            ],
            "cite": {
                "domain": "https://apps.apple.com › app › wikipedia",
                "span": " › app › wikipedia"
            },
            "g_review_stars": " Rating: 4.4 · ‎3,941 reviews · ‎Free · ‎iOS",
            "ipv4": true,
            "ipv6": true
        },
        {
            "title": "Wikipedia - Home | Facebook",
            "link": "https://www.facebook.com/wikipedia/",
            "description": "Wikipedia. 5546095 likes · 2667 talking about this. A free, collaborative, and multilingual internet encyclopedia. Comments on this page will be...",
            "additional_links": [
                {
                    "text": "Wikipedia - Home | Facebookhttps://www.facebook.com › ... › Nonprofit organization",
                    "href": "https://www.facebook.com/wikipedia/"
                }
            ],
            "cite": {
                "domain": "https://www.facebook.com › ... › Nonprofit organization",
                "span": " › ... › Nonprofit organization"
            },
            "ipv4": true,
            "ipv6": true
        },
        {
            "title": "How Wikipedia Works: And how You Can be a Part of it",
            "link": "https://books.google.com/books?id=lHdi1CEPLb4C&pg=PA67&lpg=PA67&dq=wikipedia&source=bl&ots=Finu2pGOEt&sig=ACfU3U1HvD5g_gA9nH33rRms8AzXRnpelQ&hl=en&sa=X&ved=2ahUKEwiiqK_6nc_2AhUAp3IEHVpSAXEQ6AF6BQiNARAD",
            "description": "Phoebe Ayers, ‎Charles Matthews, ‎Ben Yates · 2008 · ‎Computerswhen and How to exclude wikipedia from Your Google search Just as you can exclude all pages that are notfrom Wikipedia, you can also exclude all pages that ...",
            "additional_links": [
                {
                    "text": "How Wikipedia Works: And how You Can be a Part of ithttps://books.google.com › books",
                    "href": "https://books.google.com/books?id=lHdi1CEPLb4C&pg=PA67&lpg=PA67&dq=wikipedia&source=bl&ots=Finu2pGOEt&sig=ACfU3U1HvD5g_gA9nH33rRms8AzXRnpelQ&hl=en&sa=X&ved=2ahUKEwiiqK_6nc_2AhUAp3IEHVpSAXEQ6AF6BQiNARAD"
                },
                {
                    "text": "Phoebe Ayers",
                    "href": "/search?num=100&tbm=bks&q=inauthor:%22Phoebe+Ayers%22&sa=X&ved=2ahUKEwiiqK_6nc_2AhUAp3IEHVpSAXEQ9Ah6BQiNARAG"
                },
                {
                    "text": "Charles Matthews",
                    "href": "/search?num=100&tbm=bks&q=inauthor:%22Charles+Matthews%22&sa=X&ved=2ahUKEwiiqK_6nc_2AhUAp3IEHVpSAXEQ9Ah6BQiNARAH"
                },
                {
                    "text": "Ben Yates",
                    "href": "/search?num=100&tbm=bks&q=inauthor:%22Ben+Yates%22&sa=X&ved=2ahUKEwiiqK_6nc_2AhUAp3IEHVpSAXEQ9Ah6BQiNARAI"
                }
            ],
            "cite": {
                "domain": "https://books.google.com › books",
                "span": " › books"
            },
            "ipv4": true,
            "ipv6": true
        },
        {
            "title": "Wikipedia: The Missing Manual: The Missing Manual",
            "link": "https://books.google.com/books?id=h37N0BvkVSUC&pg=PA69&lpg=PA69&dq=wikipedia&source=bl&ots=RpHMEaeuGP&sig=ACfU3U38vyL752ilBMDTGynlb7Ea4klyVg&hl=en&sa=X&ved=2ahUKEwiiqK_6nc_2AhUAp3IEHVpSAXEQ6AF6BQiQARAD",
            "description": "John Broughton · 2008 · ‎Computerscan find research resources that use this license at Wikipedia:GNU Free Documentation License resources (shortcut: WP:FDLR).",
            "additional_links": [
                {
                    "text": "Wikipedia: The Missing Manual: The Missing Manualhttps://books.google.com › books",
                    "href": "https://books.google.com/books?id=h37N0BvkVSUC&pg=PA69&lpg=PA69&dq=wikipedia&source=bl&ots=RpHMEaeuGP&sig=ACfU3U38vyL752ilBMDTGynlb7Ea4klyVg&hl=en&sa=X&ved=2ahUKEwiiqK_6nc_2AhUAp3IEHVpSAXEQ6AF6BQiQARAD"
                },
                {
                    "text": "John Broughton",
                    "href": "/search?num=100&tbm=bks&q=inauthor:%22John+Broughton%22&sa=X&ved=2ahUKEwiiqK_6nc_2AhUAp3IEHVpSAXEQ9Ah6BQiQARAG"
                }
            ],
            "cite": {
                "domain": "https://books.google.com › books",
                "span": " › books"
            },
            "ipv4": true,
            "ipv6": true
        },
        {
            "title": "Blogs, Wikipedia, Second Life, and Beyond: From Production ...",
            "link": "https://books.google.com/books?id=oj2A68UIHpkC&pg=PA126&lpg=PA126&dq=wikipedia&source=bl&ots=z3-Z0i1HOt&sig=ACfU3U2kqI3cGak004bXo_InRGqJgbdFsQ&hl=en&sa=X&ved=2ahUKEwiiqK_6nc_2AhUAp3IEHVpSAXEQ6AF6BQiMARAD",
            "description": "Axel Bruns · 2008 · ‎Computers( The question of exactly which national legislation may apply for the international project of building a collaborative online Wikipedia must also be ...",
            "additional_links": [
                {
                    "text": "Blogs, Wikipedia, Second Life, and Beyond: From Production ...https://books.google.com › books",
                    "href": "https://books.google.com/books?id=oj2A68UIHpkC&pg=PA126&lpg=PA126&dq=wikipedia&source=bl&ots=z3-Z0i1HOt&sig=ACfU3U2kqI3cGak004bXo_InRGqJgbdFsQ&hl=en&sa=X&ved=2ahUKEwiiqK_6nc_2AhUAp3IEHVpSAXEQ6AF6BQiMARAD"
                },
                {
                    "text": "Axel Bruns",
                    "href": "/search?num=100&tbm=bks&q=inauthor:%22Axel+Bruns%22&sa=X&ved=2ahUKEwiiqK_6nc_2AhUAp3IEHVpSAXEQ9Ah6BQiMARAG"
                }
            ],
            "cite": {
                "domain": "https://books.google.com › books",
                "span": " › books"
            },
            "ipv4": true,
            "ipv6": true
        }
    ]);
};

router
    .route('/recherche')
    .get(recherche);

router
    .route('/rechercheTest')
    .get(rechercheTest);

module.exports = router;