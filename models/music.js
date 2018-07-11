const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MusicSchema = new Schema({
    image: String,
    name: String,
    count: String,
    author: String,
    address: String,
    from: String,
    date: Date,
    show: Boolean, // 是否展示
});

const MusicModel = mongoose.model('playlist', MusicSchema);

module.exports = MusicModel;