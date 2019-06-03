const express = require('express');
const Router = express.Router();
const User = require('../dao/dao').selectModel('user');

// 设置自动提醒
Router.post('/', function (req, res) {
    const { userId, isRemind } = req.body

    if (isRemind != 0 && isRemind != 1) {
        return res.json({ code: 1, msg: '设置失败' })
    }

    const condition = { userId };
    const settings = { isRemind };

    User.updateDoc(condition, settings).then(result => {
        return res.json(result);
    }).catch(err => {
        return res.send(err);
    })
})

module.exports = Router;
