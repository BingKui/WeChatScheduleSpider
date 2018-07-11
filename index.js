// 引入定时任务库
const TimeSchedule = require('node-schedule');

const CartoonSpider = require('./spider/cartoon-qq.js');
const NeteaseMusicSpider = require('./spider/music-netease.js');
const QQMusicSpider = require('./spider/music-qq.js');
// 引入数据库连接文件，连接数据库
require('./mongo.js');

// 创建爬取歌单定时任务
const qqPlayList = () => {
    TimeSchedule.scheduleJob('0 10 0 * * *', async () => {
        QQMusicSpider();
    });
}

const neteasePlayList = () => {
    TimeSchedule.scheduleJob('0 30 0 * * *', async () => {
        NeteaseMusicSpider();
    });
}

// 创建爬取动漫任务
const cartoonList = () => {
    TimeSchedule.scheduleJob('0 50 0 * * *', async () => {
        CartoonSpider();
    });
}

const scheduleList = () => {
    qqPlayList();
    neteasePlayList();
    cartoonList();
};

scheduleList();

// CartoonSpider();
// NeteaseMusicSpider();
// QQMusicSpider();