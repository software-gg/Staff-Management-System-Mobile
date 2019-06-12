const express = require('express');
const Router = express.Router();
const models = require('../dao/dao');
const Department = models.selectModel('department');
const User = models.selectModel('user');

// 经理查询部门
Router.post('/list', function (req, res) {
    const body = req.body;
    const condition = {};
    // if (body.userId)
    //     condition.userId = body.userId;
    Department.queryDocs(condition).then(result => {
        if (result.code !== 0)
            return res.json(result);

        const users = result.list.map((user) => {
            return { userId: user.director };
        });

        User.queryDocs(users).then(userRes => {
            return res.json(userRes)
        }).catch(err => {
            return res.send(err);
        })
    })
})

// 经理编辑部门
Router.post('/update', function (req, res) {
    const { departName, director } = req.body;
    const { _id } = depart;
    const condition = { _id };
    const settings = {
        departName,
        director
    };

    Department.updateDoc(condition, settings).then(result => {
        return res.json(result);
    }).catch(err => {
        return res.send(err);
    })
})

// 经理添加部门
Router.post('/insert', function (req, res) {
    const { depart } = req.body;

    const docs = [{ ...depart }];

    Department.insertDocs(docs).then(result => {
        return res.json(result);
    })
})

// 删除所有与该部门相关的数据，需要删除多个文档中的相关数据
function deleteAllDepart(departName) {

    return true;
}

// 经理删除部门
Router.post('/delete', function (req, res) {
    const { _id } = req.body;
    // const docs = [{ departName }];

    Department.deleteDocs({ _id }).then(result => {
        if (result.code !== 0)
            return res.json(result);
        if (deleteAllDepart(departName))
            return res.json({ code: 0 });
    })
})

module.exports = Router;
