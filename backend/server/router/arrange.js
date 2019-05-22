const express = require('express');
const Router = express.Router();
const model = require('../model');
const Arrange = model.getModel('arrange');

// 员工按天查询工作安排
Router.post('/list/user', function (req, res) {
    // 测试：userId = undefined时的情况？
    // startDate查询的起始年月日，endDate查询的结束年月日
    // 按月或按天查询均可调用startDate和endDate格式
    const { userId, startDate, endDate } = req.body;
    Arrange.find({
        userId,
        onTime: { $gte: new Date(startDate), $lt: new Date(endDate) }
    }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: err });
        }
        return res.json({ code: 0, list: doc })
    })
})

module.exports = Router;
