const express = require('express');
const Router = express.Router();
const model = require('../model');
const Message = model.getModel('message');

// 获取消息列表
Router.post('/list', function (req, res) {
    const { userId } = req.body;
    Message.find({
        userId
    }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: err });
        }
        if (doc) {
            return res.json({ code: 0, list: doc });
        }
        return res.json({ code: 1, msg: '后端出错' });
    })
})


// 发送消息
Router.post('/send', function (req, res) {
    const { userId, msg } = req.body;
    Message.create({
        userId,
        ...msg
    }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: err });
        }
        if (doc) {
            return res.json({ code: 0 });
        }
        return res.json({ code: 1, msg: '后端出错' });
    })
})

module.exports = Router;
