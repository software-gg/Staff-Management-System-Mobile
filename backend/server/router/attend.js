const express = require('express');
const Router = express.Router();
const model = require('../model');
const Arrange = model.getModel('arrange');

// 还未处理 通过下班时间确定发送加班申请 这个功能

// 员工打卡查询
Router.post('/list', function (req, res) {
    const { userId, startDate, endDate } = req.body;
    // 前端需要根据realOnTime和realOffTime是否为undefined或者null来判断上班、下班的打卡时间
    Arrange.find({
        $or: [{
            userId,
            realOnTime: { $gte: new Date(startDate), $lt: new Date(endDate) }
        }, {
            userId,
            realOffTime: { $gte: new Date(startDate), $lt: new Date(endDate) }
        }]
    }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: err });
        }
        if (doc) {
            return res.json({ code: 0, list: doc });
        }
        return res.json({ code: 1, msg: '后端出错了' });
    })
})

// 员工打卡
// Router.get('/swipe', function (req, res) {
Router.post('/swipe', function (req, res) {
    const { userId, time } = req.body;
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

    // 考勤打卡逻辑
    Arrange.findOne({
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
    }, function (err, docForFind) {
        if (err) {
            return res.json({ code: 1, msg: err });
        }

        if (docForFind) {
            // 如果当前正处于上班时间
            if (!docForFind.realOnTime && docForFind.onTime <= afterTime && docForFind.offTime > currentTime) {
                Arrange.updateOne(docForFind, {
                    $set: {
                        realOnTime: new Date(time)
                    }
                }, function (err, docForUpdate) {
                    if (err) {
                        return res.json({ code: 1, msg: err });
                    }
                    return res.json({ code: 0, state: 'on' });
                })
            } else if (!docForFind.realOffTime) {
                // 如果当前处于下班时间
                if (!docForFind.realOnTime) {
                    return res.json({ code: 1, msg: '上班时间未打卡' });
                }

                Arrange.updateOne(docForFind, {
                    $set: {
                        realOffTime: new Date(time)
                    }
                }, function (err, docForUpdate) {
                    if (err) {
                        return res.json({ code: 1, msg: err });
                    }
                    if (docForFind.offTime <= currentTime && docForFind.offTime > beforeTime) {
                        // 正常下班
                        return res.json({ code: 0, state: 'off' });
                    } else {
                        // 提醒员工申请加班
                        return res.json({ code: 0, state: 'extra' });
                    }
                })
            } else {
                return res.json({ code: 1, msg: '重复刷卡' });
            }
        } else {
            return res.json({ code: 1, msg: '现在是休息时间~' });
        }
    })
})

module.exports = Router;
