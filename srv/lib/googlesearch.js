const puppeteer = require('puppeteer');

module.exports = async (recherche) => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto('https://google.com');

    await page.click('#L2AGLb');
    //Finds input element with name attribue 'q' and types searchQuery
    await page.type('input[name="q"]', recherche);
    await page.screenshot({path: 'example3.png'});
    await page.$eval('input[name=btnK]', button => button.click());

    await page.waitForSelector('div[id=search]');

    await page.screenshot({path: 'example1.png'});

    const searchResults = await page.$$eval('div[class=v7W49e]', results => {
        //Array to hold all our results
        let data = [];

        //Iterate over all the results
        results.forEach(parent => {

            //Check if parent has h2 with text 'Web Results'
            const ele = parent.querySelector('h2');
            data.push(ele);

            //If element with 'Web Results' Title is not found  then continue to next element
            if (ele === null) {
                return;
            }

            //Check if parent contains 1 div with class 'g' or contains many but nested in div with class 'srg'
            let gCount = parent.querySelectorAll('div[class=g]');

            //If there is no div with class 'g' that means there must be a group of 'g's in class 'srg'
            if (gCount.length === 0) {
                //Targets all the divs with class 'g' stored in div with class 'srg'
                gCount = parent.querySelectorAll('div[class=srg] > div[class=g]');
            }

            // Iterate over all the divs with class 'g'
            gCount.forEach(result => {
                //Target the title
                // const title = result.querySelector('div[class=rc] > div[class=r] > a >  h3');

                // //Target the url
                const url = result.querySelector('div[class=c] > a').href;
                //
                // //Target the description
                // const desciption = result.querySelector('div[class=rc] > div[class=s] > div > span[class=st]').innerText;
                //
                // //Add to the return Array
                // data.push({title, desciption, url});
                data.push(url);

            });
        });

        //Return the search results
        return data;
    });

    await page.screenshot({path: 'example.png'});

    await browser.close();

    return searchResults;
};