const express = require('express');
const Router = express.Router();
const model = require('../model');
const Department = model.getModel('department');
const User = model.getModel('user');

// 经理查询部门
Router.post('/list', function (req, res) {
    const { userId } = req.body;
    Department.find({
        userId
    }, function (err, docDepart) {
        if (err) {
            return res.json({ code: 1, msg: '后端出错了' });
        }

        const users = doc.map((user) => {
            return { userId: user.director };
        });

        User.find(users, function (err, docUser) {
            if (err) {
                return res.json({ code: 1, msg: '后端出错了' });
            }

            return res.json({ code: 0, list: docUser });
        });
    })
})

// 经理编辑部门
Router.post('/update', function (req, res) {
    const { departName, director } = req.body;
    const { _id } = depart;

    Department.updateOne({ _id }, {
        $set: {
            departName,
            director
        }
    }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: '后端出错了' });
        }

        return res.json({ code: 0 });
    })
})

// 经理添加部门
Router.post('/insert', function (req, res) {
    const { depart } = req.body;

    Department.insertOne({ ...depart }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: '后端出错了' });
        }

        return res.json({ code: 0 });
    })
})

// 删除所有与该部门相关的数据，需要删除多个文档中的相关数据
function deleteAllDepart(departName) {

    return true;
}

// 经理删除部门
Router.post('/delete', function (req, res) {
    const { departName } = req.body;

    Department.deleteOne({ departName }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: '后端出错了' });
        }

        if (deleteAllDepart(departName))
            return res.json({ code: 0 });
    })
})
