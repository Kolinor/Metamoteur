const dns = require('dns');

const isAvailableIpv6 = async (domain) => {
    return new Promise((resolve) =>{
        dns.resolve6(domain, (err, result) => {
            resolve(!!(result && result.length > 0));
        });
    });
};

const isAvailableIpv4 = async (domain) => {
    return new Promise((resolve) =>{
        dns.resolve(domain, (err, result) => {
            resolve(!!(result && result.length > 0));
        });
    });
};

module.exports = {
    isAvailableIpv6,
    isAvailableIpv4
};