// router: /user

const express = require('express');
const Router = express.Router();
const model = require('../model');
const User = model.getModel('user');
const utils = require('utility');

// 数据库中的pwd和_v不显示在doc
const _filter = { pwd: 0, _v: 0 };

// MD5加密密码
function md5pwd(pwd) {
    const salt = "ew98fhewfi@#~!@dfDSdsf";
    return utils.md5(utils.md5(salt + pwd));
}

/*****************
 * 接口变了！！！改一下微信小程序中的接口！！！
 * *****************/
// 员工、部门主管、经理获取单个用户信息
Router.post('/list', function (req, res) {
    const body = req.body;
    let condition = {};


    if (body.userId) {
        // 员工的查询条件
        condition.userId = body.userId;
    } else if (body.departName) {
        // 部门主管的查询条件
        condition.departName = body.departName;
    } else {
        // 经理的查询条件为空
        ;
    }

    User.find(condition, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: '后端出错了' });
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

    console.log(req.body)

    User.findOne({
        phone,
        userId,
        pwd/*: md5pwd(pwd)*/
    }, _filter, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: err });
        }
        if (!doc) {
            console.log(doc)
            return res.json({ code: 1, msg: '登录信息或密码有误' });
        }

        // 将cookie写入响应体
        res.cookie('userid', doc._id);
        return res.json({ code: 0, user: doc });
    })
})

// 员工编辑个人信息
Router.post('/changeInfo', function (req, res) {
    // const { phone, id, name } = req.query;    // user
    const user = req.body;
    const { userId } = req.body;    // user

    // console.log(user);
    User.updateOne({
        userId
    }, { $set: { ...user } }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: err })
        }
        if (doc.nModified === 0) {
            return res.json({ code: 1, msg: '个人信息更新失败' })
        }
        return res.json({ code: 0, user: doc })
    })
})

// 员工修改密码
Router.post('/changePwd', function (req, res) {
    const { userId, pwd, newPwd } = req.body;
    User.updateOne({
        userId,
        pwd/*: md5pwd(pwd)*/
    }, { $set: { pwd: newPwd/*: md5pwd(newPwd)*/ } }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: err })
        }
        if (doc.nModified === 0) {
            return res.json({ code: 1, msg: '密码修改失败' });
        }
        return res.json({ code: 0 })
    })
})

// 部门主管和经理插入多个员工
Router.post('/insert', function (req, res) {
    const { users } = req.body;
    User.insertMany(users, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: '后端出错了' });
        }

        return res.json({ code: 0 });
    })
})

// 删除所有与该员工相关的数据
function deleteAllUser(userId) {

    return true;
}

// 部门主管和经理删除一个员工
Router.post('/delete', function (req, res) {
    const { userId } = req.body;
    User.deleteOne({ userId }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: '后端出错了' });
        }

        if (deleteAllUser(userId))
            return res.json({ code: 0 });
    })
})

module.exports = Router;
