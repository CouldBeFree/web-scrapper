const request = require('request-promise');
const cheerio = require('cheerio');

const URL = 'https://www.imdb.com/title/tt0102926/?ref_=nv_sr_1';

(async () => {

    const response = await request({
        uri: URL,
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,uk;q=0.6,de;q=0.5,la;q=0.4',
            'cache-control': 'no-cache',
            'pragma': 'no-cache',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36'

        },
        gzip: true
    });

    let $ = cheerio.load(response);

    let title = $('div[class="title_wrapper"] > h1').text();
    let rating = $('span[itemprop="ratingValue"]').text();
    let poster = $('.poster > a > img').attr('src');
    let totalRatings = $('.imdbRating > a > span[class="small"]').text();
    let releaseDate = $('a[title="See more release dates"]').text().trim();

    console.log(title, rating);
    console.log(poster);
    console.log(totalRatings);
    console.log(releaseDate);
})();
