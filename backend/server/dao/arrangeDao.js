const model = require('../model');
const Arrange = model.getModel('arrange');

async function queryArranges(condition) {
    let result = {};
    await Arrange.find(condition, function (err, doc) {
        if (err) {
            result = { code: 1, msg: '后端出错了' };
        } else if (!doc || doc === []) {
            result = { code: 2 };
        } else {
            result = { code: 0, arrange: doc };
        }
    })
    return result;
}

async function insertArranges(arranges) {
    let result = {};
    await Arrange.insertMany(arranges, function (err, doc) {
        if (err) {
            result = { code: 1, msg: '后端出错了' };
        } else {
            result = { code: 0 };
        }
    })
    return result;
}

async function updateArrange(condition, settings) {
    let result = {};
    await Arrange.updateOne(condition, { $set: settings }, function (err, doc) {
        if (err) {
            result = { code: 1, msg: err };
        } else if (doc.nModified === 0) {
            result = { code: 2 };
        } else {
            result = { code: 0, user: doc };
        }
    })
    return result;
}

async function insertArranges(arranges) {
    let result = {};
    await Arrange.insertMany(arranges, function (err, doc) {
        if (err) {
            result = { code: 1, msg: '后端出错了' };
        } else {
            result = { code: 0 };
        }
    })
    return result;
}



module.exports = {
    queryArranges,
    insertArranges,
    updateArrange,
    deleteArranges
}
