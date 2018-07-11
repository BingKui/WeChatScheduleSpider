const MusicModel = require('../models/music.js');

const save = (item) => {
    findBuName(item.name, (obj) => {
        if (obj) {
            console.log('已经保存，数据');
            obj.remove();
        }
        const saveObject = new MusicModel(item);
        saveObject.save((err) => {
            if (err) return handleError(err);
        });
    });
}

const findBuName = (name, callback) => {
    MusicModel.findOne({name}, (err, item) => {
        if (err) {
            callback && callback(false);
        }
        callback && callback(item);
    });
};

// 更新所有数据为不可见
const updateAllHide = (callback, filter = {}) => {
    MusicModel.update(filter, {show: false}, (err, raw) => {
        if (err) return handleError(err);
        console.log('已经全部设置为不可见。');
        callback && callback();
    });
}

module.exports = {
    save,
    updateAllHide,
};