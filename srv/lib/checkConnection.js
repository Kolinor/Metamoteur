const schedule = require('node-schedule');
const query = require('./query');
const {isAvailableIpv6, isAvailableIpv4} = require('./testDomain');

module.exports = async (pool) => {
    try {
        // permet de passer le pool sql
        const req = {};
        req.pool = pool;
        schedule.scheduleJob({hour: 15, minute: 59}, async () => {
            console.time('a');
            const results = await query(req, {
                sql: 'select S.DOMAIN, S.IPV4, S.IPV6 from SITES S;'
            });

            for (const resultat of results) {
                const domain = resultat.DOMAIN;
                const isIpv6 = await isAvailableIpv6(domain);
                const isIpv4 = await isAvailableIpv4(domain);

                console.log(resultat);
                if (!!resultat.IPV6 !== isIpv6) {
                    await query(req, {
                        sql: 'UPDATE SITES SET IPV6 = ? WHERE DOMAIN = ?',
                        params: [
                            isIpv6,
                            domain
                        ]
                    });
                    console.log('ipv6 : ' +domain);
                }

                if (!!resultat.IPV4 !== isIpv4) {
                    await query(req, {
                        sql: 'UPDATE SITES SET IPV4 = ? WHERE DOMAIN = ?',
                        params: [
                            isIpv4,
                            domain
                        ]
                    });
                    console.log('ipv4 : ' +domain);
                }
            }
            console.timeEnd('a');
        });
    } catch (err) {
        console.error(err);
    }
}