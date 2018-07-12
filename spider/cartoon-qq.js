// 爬取腾讯动漫中播放量超过5000W的精品动漫
const puppeteer = require('puppeteer');
const dayjs = require('dayjs');
const CartoonServer = require('../server/movie.js');

// 爬取地址
const url = 'http://v.qq.com/x/list/cartoon?sort=19&offset=';

const cartoonSpider = async () => {
    const browser = await puppeteer.launch({timeout: 300000, headless: true, args: ['--no-sandbox']});
    const page = await browser.newPage();
    let movieList = [];
    for (let i = 0; i < 67; i++) {
        const result = await getPageData(page, i);
        movieList = movieList.concat(result);
    }

    // 保存数据
    for (let i = 0; i < movieList.length; i++) {
        const item = movieList[i];
        item.date = dayjs().format('YYYY-MM-DD HH:mm:ss');
        CartoonServer.save(item);
    }

    browser.close();
}

const getPageData = async (page, pageNumber) => {
    await page.goto(`${url}${pageNumber * 30}`);
    await page.setViewport({ 
        width: 1300, 
        height: 5227,
    });
    // 等待两秒，加载图片
    await page.waitFor(3000);
    const result = await page.evaluate(() => {
        const listElements = document.querySelectorAll('.figures_list .list_item');
        let items = [];
        for (let item of listElements) {
            const name = item.querySelector('.figure_title a').getAttribute('title');
            const count = item.querySelector('.figure_count .num') ? item.querySelector('.figure_count .num').innerText : '';
            const score = item.querySelector('.figure_score') ? item.querySelector('.figure_score').innerText.replace(/\s+/g, '') : '无评分';
            const desc = item.querySelector('.figure_info') ? item.querySelector('.figure_info').innerText : '';
            const image = 'https:' + item.querySelector('a.figure img').getAttribute('src');
            const address = item.querySelector('.figure_title a').getAttribute('href');
            // 处理播放量
            const flag = (count.indexOf('亿') > -1) || ((count.indexOf('万') > -1) && (parseInt(count.split('万')[0]) > 5000));
            if (flag) {
                items.push({
                    name,
                    count,
                    score,
                    desc,
                    image,
                    address,
                    from: 'qq',
                });
            }
        }
        return items;
    });
    console.log('获取数据：', result.length);
    return result;
}

module.exports = cartoonSpider;