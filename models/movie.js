const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    image: String, // 图片
    name: String, // 名字
    count: String, // 播放量
    desc: String, // 描述
    store: String, // 评分
    address: String, // 地址
    from: String, // 来自平台
    date: Date, // 添加（更新）时间
    // show: Boolean, // 是否展示
});

const MovieModel = mongoose.model('movielist', MovieSchema);

module.exports = MovieModel;