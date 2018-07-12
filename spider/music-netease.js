// 网易云音乐歌单爬虫，爬取网易云音乐播放量超过1000万的热门歌单
// 使用 puppeteer 处理
const puppeteer = require('puppeteer');
const dayjs = require('dayjs');
const MusicServer = require('../server/music.js');

const NeteaseMusic = async () => {
    const browser = await puppeteer.launch({timeout: 300000, headless: true, args: ['--no-sandbox']});
    // 定于数组存储数据
    let musicPlayList = [];
    const page = await browser.newPage();
    for (let i = 0; i < 1191; i += 35) {
        const item = await getOnePageData(page, i);
        console.log(`获取到数据${item.length}条。`);
        musicPlayList = musicPlayList.concat(item);
    }

    // 保存之前去重
    let hash = {};
    musicPlayList = musicPlayList.reduce((item, next) => {
        hash[next.address] ? '' : hash[next.address] = true && item.push(next);
        return item
    }, []);

    MusicServer.updateAllHide(() => {
        // 保存数据
        for (let i = 0; i < musicPlayList.length; i++) {
           const item = musicPlayList[i];
           item.date = dayjs().format('YYYY-MM-DD HH:mm:ss');
           item.show = true;
           MusicServer.save(item);
       }
    }, { from: 'netease' });

    await browser.close();
};

const getOnePageData = async (page, offset) => {
    const url = `https://music.163.com/#/discover/playlist/?order=hot&cat=%E5%85%A8%E9%83%A8&limit=35&offset=${offset}`;
    // 定于数组存储数据
    await page.goto(url);
    // 设置页面大小
    await page.setViewport({ 
        width: 1100, 
        height: 2000
    });
    
    // 获取歌单的iframe
    let iframe = await page.frames().find(f => f.name() === 'contentFrame');
    // 获取歌单
    const result = await iframe.evaluate(() => {
        const elements = document.querySelectorAll('#m-pl-container > li');
        let res = [];
        for (let ele of elements) {
            let image = ele.querySelector('.j-flag').getAttribute('src');
            let name = ele.querySelector('.tit').innerText;
            let count = ele.querySelector('.nb').innerText;
            let author = ele.querySelector('.nm').innerText;
            let address = 'https://music.163.com/#' + ele.querySelector('.msk').getAttribute('href');
            const flag = (count.indexOf('万') > -1) && (parseInt(count.split('万')[0]) > 1000);
            if (flag) {
                res.push({
                    image,
                    name,
                    count,
                    author,
                    address,
                    from: 'netease',
                });
            }
        }
        return res;
    });
    return result;
}

module.exports = NeteaseMusic;