const axios = require('axios').default;
const config = require('../conf.json');

module.exports = async (recherche) => {
    const searchBaseUrl = 'https://google-search3.p.rapidapi.com/api/v1/search/q=';
    const regexEspace = /[ ]/gm;
    const parsedRecherche = recherche.replaceAll(regexEspace, '+');
    const url = searchBaseUrl + parsedRecherche + '&num=' + config.googleSearchApi.numberOfResults;
    const options = {
        method: 'GET',
        url,
        headers: {
            'x-user-agent': 'desktop',
            'x-proxy-location': 'EU',
            'x-rapidapi-host': 'google-search3.p.rapidapi.com',
            'x-rapidapi-key': config.googleSearchApi.key
        }
    };

    return new Promise(((resolve, reject) => {
        axios.request(options).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        });

    }));
};