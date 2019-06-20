const express = require('express');
const Router = express.Router();
const Arrange = require('../dao/dao').selectModel('arrange');

// 还未处理 通过下班时间确定发送加班申请 这个功能

// 员工打卡查询
Router.post('/list', function (req, res) {
    const { userId, startDate, endDate } = req.body;
    // 前端需要根据realOnTime和realOffTime是否为undefined或者null来判断上班、下班的打卡时间
    const condition = {
        $or: [{
            userId,
            realOnTime: { $gte: new Date(startDate), $lt: new Date(endDate) }
        }, {
            userId,
            realOffTime: { $gte: new Date(startDate), $lt: new Date(endDate) }
        }]
    }

    Arrange.queryDocs(condition).then(result => {
        return res.json(result);
    }).catch(err => {
        return res.send(err);
    })
})

// 员工打卡
// Router.get('/swipe', function (req, res) {
Router.post('/swipe', function (req, res) {
    console.log(req);
    const { userId, time } = req.body;
    // console.log(userId, time);
    // const { userId, time } = req.query;
    // 上班打卡时间：上班时间前1小时到下班时间
    // 下班打卡时间：下班时间到下班后一个小时

    // 注意对时间进行加减操作的方法：利用时间戳
    const delay = 60 * 60 * 1000;
    const currentTime = new Date(time);
    const timeStamp = currentTime.getTime();
    // 上班前一个小时之后打卡有效
    const afterTime = new Date(timeStamp + delay);
    // 下班后到下班后一个小时之前打卡有效
    const beforeTime = new Date(timeStamp - delay);
    // 下班后一到两个小时之内可以申请加班
    const extraTime = new Date(timeStamp - 2 * delay);

    // return res.json(afterTime)
    let condition = {
        $or: [
            {
                userId,
                // 上班打卡时间：上班时间前1小时到下班时间
                onTime: { $lte: afterTime },
                offTime: { $gt: currentTime }
            }, {
                userId,
                // 下班打卡时间：下班时间之后的两个小时
                offTime: { $lte: currentTime, $gt: extraTime }
            }
        ]
    }

    console.log(condition);

    Arrange.queryDocs(condition).then(queryResult => {
        if (queryResult.code === 1)
            return res.json(queryResult);
        if (queryResult.code === 2)
            return res.json({ code: 2, msg: '现在是休息时间~' });

        let docForFind = queryResult.list[0];
        let updateCondition, settings;

        // 如果当前正处于上班时间
        if (!docForFind.realOnTime && docForFind.onTime <= afterTime && docForFind.offTime > currentTime) {
            updateCondition = { _id: docForFind._id };
            settings = {
                realOnTime: new Date(time),
                state: 'on'
            };
            Arrange.updateDoc(updateCondition, settings).then(updateResult => {
                if (updateResult.code !== 0)
                    return res.json(updateResult);
                return res.json({ code: 0, state: 'on' });
            }).catch(err => {
                return res.send(err);
            })

        } else if (!docForFind.realOffTime) {
            // 如果当前处于下班时间
            if (!docForFind.realOnTime) {
                return res.json({ code: 1, msg: '上班时间未打卡' });
            }

            let state;

            if (docForFind.offTime > beforeTime) {
                if (docForFind.offTime <= currentTime)
                    // 正常下班
                    state = 'off';
                else
                    // 早退
                    state = 'early';
            } else {
                // 提醒员工申请加班
                state = 'extra';
            }

            updateCondition = { _id: docForFind._id };
            settings = {
                realOffTime: new Date(time),
                state
            };

            Arrange.updateDoc(updateCondition, settings).then(queryResult => {
                if (queryResult.code !== 0)
                    return res.json(queryResult);
                return res.json({ code: 0, state });
            }).catch(err => {
                return res.send(err);
            })
        } else {
            return res.json({ code: 1, msg: '重复刷卡' });
        }
    }).catch(err => {
        return res.send(err);
    })
})
module.exports = Router;
