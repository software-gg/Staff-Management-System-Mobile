// 细致工作班次安排

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

// 部门主管和经理调整某个员工某个月的工作安排
Router.post('/update', function (req, res) {
    const { arrange } = req.body;
    const { _id, onTime, offTime, isTemp, type, state } = arrange;

    Arrange.updateOne({ _id }, {
        $set: {
            onTime,
            offTime,
            isTemp,
            type,
            state
        }
    }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: '后端出错了' });
        }

        if (doc.nModified === 0)
            return res.json({ code: 1, msg: '更新失败' });

        return res.json({ code: 0 });
    })
})

// 部门主管和经理添加细致班次安排
Router.post('/insert', function (req, res) {
    const { arrange } = req.body;

    Arrange.insertOne(arrange, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: '后端出错了' });
        }

        if (doc.nModified === 0)
            return res.json({ code: 1, msg: '添加失败' });

        return res.json({ code: 0 });
    })
})

module.exports = Router;
