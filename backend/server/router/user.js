// router: /user

const express = require('express');
const Router = express.Router();
const model = require('../model');
const User = model.getModel('user');
const utils = require('utility');

// MD5加密密码
function md5pwd(pwd) {
    const salt = "ew98fhewfi@#~!@dfDSdsf";
    return utils.md5(utils.md5(salt + pwd));
}

// 用户获取单个用户信息
Router.post('/info/user', function (req, res) {
    const { userId } = req.body;
    User.find({
        userId
    }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: err });
        }

        return res.json({ code: 0, user: doc });
    })
})

// 员工、部门主管、经理登录
Router.post('/login', function (req, res) {
    // req.query: 解析URL中?后面的属性
    // req.body：解析post的属性（需要用到body-parser插件
    // req.params：解析在前端通过get传输到后端的参数
    const { phone, userId, pwd } = req.body;
    User.findOne({
        phone,
        userId,
        pwd/*: md5pwd(pwd)*/
    }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: err });
        }
        if (!doc) {
            return res.json({ code: 1, msg: '登录信息或密码有误' });
        }
        return res.json({ code: 0, user: doc });
    })
})

// 员工编辑个人信息
Router.post('/changeInfo', function (req, res) {
    // const { phone, id, name } = req.query;    // user
    const { phone, userId } = req.body.user;    // user
    User.updateOne({
        phone,
        userId
    }, { $set: user }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: err })
        }
        return res.json({ code: 0, user: doc })
    })
})

// 员工修改密码
Router.post('/changePwd', function (req, res) {
    const { phone, userId, pwd } = req.body;
    User.updateOne({
        phone,
        userId
    }, { $set: { pwd: md5pwd(pwd) } }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: err })
        }
        // if (doc.nModified === 0) {
        //     return res.json({ code: 1, msg: '新密码与原密码相同' });
        // }
        return res.json({ code: 0 })
    })
})

// 部门主管获取用户列表
Router.post('/info/director', function (req, res) {
    const { departName } = req.body;
    User.find({
        departName
    }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: err });
        }

        return res.json({ code: 0, user: doc });
    })
})

// 经理获取用户列表
Router.post('/info/manager', function (req, res) {
    User.find({

    }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: err });
        }
        if (doc) {
            return res.json({ code: 0, user: doc });
        }
        return res.json({ code: 1, msg: '后端出错了' });
    })
})

module.exports = Router;
