const CartoonModal = require('../models/movie.js');

const save = (item) => {
    findBuName(item.name, (obj) => {
        if (obj) {
            console.log('已经保存，数据');
            obj.remove();
        }
        const saveObject = new CartoonModal(item);
        saveObject.save((err) => {
            if (err) return handleError(err);
        });
    });
};

const findBuName = (name, callback) => {
    CartoonModal.findOne({name}, (err, item) => {
        if (err) {
            callback && callback(false);
        }
        callback && callback(item);
    });
};

const updateItem = (id, item) => {
    CartoonModal.findOneAndUpdate({ _id: id }, { ...item }, null, null,  (err) => {
        console.log(err);
    });
};

module.exports = {
    save,
    findBuName,
    updateItem,
};