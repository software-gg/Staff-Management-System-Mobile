const model = require('../model');

function selectModel(modelName) {
    const Model = model.getModel(modelName);
    // 插入文档
    async function insertDocs(documents) {
        let result = {};

        await Model.insertMany(documents, function (err, doc) {
            if (err) {
                result = { code: 1, msg: '后端出错了' };
            } else {
                // console.log('insert err: ', err);
                result = { code: 0 };
            }
        })

        // console.log('result: ', result);
        return result;
    }

    // 更新一个文档
    async function updateDoc(condition, settings) {
        let result = {};
        await Model.updateOne(condition, { $set: settings }, function (err, doc) {
            console.log('doc: ', doc);
            if (err) {
                result = { code: 1, msg: err };
            } else if (doc.nModified === 0) {
                result = { code: 2, msg: '更新失败' };
            } else {
                result = { code: 0 };
            }
        })
        return result;
    }

    // 更新多个文档
    async function updateDocs(condition, settings) {
        let result = {};
        await Model.updateMany(condition, { $set: settings }, function (err, doc) {
            if (err) {
                result = { code: 1, msg: err };
            } else if (doc.nModified === 0) {
                result = { code: 2, msg: '更新失败' };
            } else {
                result = { code: 0 };
            }
        })
        return result;
    }

    // 删除文档
    async function deleteDocs(condition) {
        let result = {};
        await Model.deleteMany(condition, function (err, doc) {
            console.log(doc);
            if (err) {
                result = { code: 1, msg: '后端出错了' };
            } else if (doc.deletedCount !== 1) {
                result = { code: 2, msg: '删除失败' };
            } else {
                result = { code: 0 };
            }
        })
        return result;
    }

    // 查询文档
    async function queryDocs(condition, filter = {}) {
        let result = {};
        await Model.find(condition, filter, function (err, doc) {
            // console.log('condition: ', condition);
            // console.log('doc: ', doc);
            if (err) {
                result = { code: 1, msg: '后端出错了' };
            } else if (doc.length === 0) {
                result = { code: 2, msg: '未查询到相关信息' };
            } else {
                result = { code: 0, list: doc };
            }
        })

        // console.log('result: ', result);
        return result;
    }

    const operations = {
        insertDocs,
        updateDoc,
        updateDocs,
        deleteDocs,
        queryDocs
    }

    return operations;
}

module.exports = {
    selectModel
}
