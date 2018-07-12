// 引入定时任务库
const TimeSchedule = require('node-schedule');

const CartoonSpider = require('./spider/cartoon-qq.js');
const NeteaseMusicSpider = require('./spider/music-netease.js');
const QQMusicSpider = require('./spider/music-qq.js');
// 引入数据库连接文件，连接数据库
require('./mongo.js');

// 创建爬取歌单定时任务
const qqPlayList = () => {
    TimeSchedule.scheduleJob('20 30 10 * * *', () => {
        // console.log('qq-list');
        QQMusicSpider();
    });
}

const neteasePlayList = () => {
    TimeSchedule.scheduleJob('30 40 10 * * *', () => {
        // console.log('netease-list');
        NeteaseMusicSpider();
    });
}

// 创建爬取动漫任务
const cartoonList = () => {
    TimeSchedule.scheduleJob('40 16 11 * * *', () => {
        // console.log('cartoon-list');
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