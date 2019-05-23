const express = require('express');
const Router = express.Router();
const model = require('../model');
const User = model.getModel('user');

// 设置自动提醒
Router.post('/', function (req, res) {
    const { userId, isRemind } = req.body

    if (isRemind != 0 && isRemind != 1) {
        return res.json({ code: 1, msg: '设置失败' })
    }

    User.updateOne({
        userId
    }, { $set: { isRemind } }, function (err, doc) {
        console.log(doc)
        if (err) {
            return res.json({ code: 1, msg: err })
        }
        if (doc.nModified === 0) {
            return res.json({ code: 1, msg: '设置失败' })
        }
        return res.json({ code: 0 })
    })
})

module.exports = Router;
