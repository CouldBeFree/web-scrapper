const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function scrapeListings(page) {
    await page.goto(
      'https://sfbay.craigslist.org/d/software-qa-dba-etc/search/sof'
    );
    const html = await page.content();
    const $ = cheerio.load(html);
    const listings = $('.result-info').map((index, element) => {
        const titleElement = $(element).find('.result-title');
        const timeElement = $(element).find('.result-date');
        const hoodElement = $(element).find('.result-hood');
        const hood = $(hoodElement).text().trim().replace("(","").replace(")","");
        const title = $(titleElement).text();
        const url = $(titleElement).attr('href');
        const datePosted = new Date($(timeElement).attr('datetime'));
        return { title, datePosted, url, hood };
    }).get();
    return listings;
}

async function sleep(miliseconds){
    return new Promise(resolve => setTimeout(resolve, miliseconds))
}

async function scrapeJobDescriptions(listings, page){
    for(let i = 0; i < listings.length; i++){
        await page.goto(listings[i].url);
        const html = await page.content();
        const $ = cheerio.load(html);
        listings[i].jobDescription = $('#postingbody').text();
        listings[i].compensation = $('p.attrgroup > span:nth-child(1) > b').text();
        console.log(listings[i].jobDescription);
        console.log(listings[i].compensation);
        await sleep(1000);
    }
}

async function main() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const listings = await scrapeListings(page);
    const listingsWithJobDescriptions = await scrapeJobDescriptions(listings, page);
    console.log(listings);
}

main();