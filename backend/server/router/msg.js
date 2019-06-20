const express = require('express');
const Router = express.Router();
const dao = require('../dao/dao');
const Message = dao.selectModel('message');
const Arrange = dao.selectModel('arrange');
const User = dao.selectModel('user');

// 定时发送消息提醒
const schedule = require('node-schedule');

// 上班提醒
function remindOnOff() {
    const currentTime = new Date();
    const oneHour = 3600 * 1000;
    const conditionOn = {
        onTime: { $gte: new Date(currentTime.getTime() - oneHour - 30 * 1000), $lt: new Date(currentTime.getTime() - oneHour + 30 * 1000) }
    };
    const conditionOff = {
        offTime: { $gte: new Date(currentTime.getTime() - oneHour - 30 * 1000), $lt: new Date(currentTime.getTime() - oneHour + 30 * 1000) }
    };

    // console.log(conditionOn.onTime)
    Arrange.queryDocs(conditionOn).then(arrangeRes => {
        // console.log(arrangeRes);
        // console.log(arrangeRes, new Date(currentTime.getTime() - oneHour - 30));
        if (arrangeRes.code !== 0)
            return;

        // 数组去重
        const removeDups = arr => [...new Set(arr)];
        const userList = removeDups(arrangeRes.list.map(v => {
            return v.userId;
        })).map(v => { return { userId: v } });

        // console.log(userList);
        // 查询user集合，用户是否需要自动上下班提醒
        User.queryDocs({ $or: userList }).then(queryRes => {
            // console.log(queryRes);
            if (queryRes.code !== 0)
                return;
            const messageList = queryRes.list.filter(v => v.isRemind === 1).map(m => {
                return {
                    userId: m.userId,
                    sentTime: currentTime,
                    type: 'on',
                    tag: '上班提醒',
                    title: '还有一小时就要上班了',
                    msg: '还有一小时就要上班了，不要忘记打卡哦~'
                }
            });

            // console.log(messageList);
            Message.insertDocs(messageList).then(result => {
                console.log(result);
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })

    Arrange.queryDocs(conditionOff).then(arrangeRes => {
        if (arrangeRes.code !== 0)
            return;

        // 数组去重
        const removeDups = arr => [...new Set(arr)];
        const userList = removeDups(arrangeRes.list.map(v => {
            return v.userId;
        })).map(v => { return { userId: v } });

        // console.log(userList);
        // 查询user集合，用户是否需要自动上下班提醒
        User.queryDocs({ $or: userList }).then(queryRes => {
            // console.log(queryRes);
            if (queryRes.code !== 0)
                return;
            const messageList = queryRes.list.filter(v => v.isRemind === 1).map(m => {
                return {
                    userId: m.userId,
                    sentTime: currentTime,
                    type: 'off',
                    tag: '下班提醒',
                    title: '还有一小时就要下班了',
                    msg: '还有一小时就要下班了，不要忘记打卡哦~'
                }
            });

            // console.log(messageList);
            Message.insertDocs(messageList).then(result => {
                console.log(result);
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
}

// 每月一日添加新的工作班次安排
function addNextAdjust(month) {
    // month必须为Date类型！！！

    /**
     * 查询month是否在数据库中
     * 如果在，则不调整
     * 如果不在，则：
     * 查询所有上个月的信息是否在数据库中
     * 如果上个月的信息不在数据库中，则不调整。
     * 如果上个月的信息在数据库中：
     * 查询isTemp字段：
     * 如果isTemp为1临时调整，则下一个月的isTemp=0, previousId=previousId;
     * 如果isTemp为0永久调整，则下一个月的isTemp = 0, previousId = 当月的_id
     */

    Arrange.queryDocs({ month }).then(thismonthRes => {
        if (thismonthRes.code === 1 || thismonthRes.code === 0)
            return res.json({ code: 1, msg: '当月安排无需自动导入' });

        //当没有查到本月记录时，查询上个月的信息是否在数据库中
        // 获取上个月的日期
        let lastMonth = calLastMonth(month);

        Arrange.queryDocs({ month: lastMonth }).then(lastmonthRes => {
            // 如果上个月的信息不在数据库中，则不调整。
            if (lastmonthRes.code !== 0)
                return res.json(lastmonthRes);

            const lastMonthArranges = lastmonthRes.list;
            const newArranges = lastMonthArranges.map((v, i) => {
                return {
                    departName: v.departName,
                    userId: v.userId,
                    month: month,
                    location: v.location,
                    onTime: v.onTime,
                    offTime: v.offTime,
                    type: v.type,
                    previousId: (v.isTemp ? v.previousId : month.getMonth()),
                    isTemp: 0
                }
            })

            Arrange.insertDocs(newArranges).then(insertRes => {
                return res.json(insertRes);
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
}

// 上下班提醒
function scheduleCronstyle() {
    // 每分钟第0秒会执行一次上下班提醒函数
    schedule.scheduleJob('0 * * * * *', function () {
        remindOnOff();
    })
    // 每月一日会执行一次调整工作安排函数
    schedule.scheduleJob('* * * 1 * *', function () {
        const nowDate = new Date();
        const nowYear = nowDate.getFullYear();
        const nowMonth = nowDate.getMonth();
        const yearMonth = `${nowYear}-${nowMonth}-1`;
        addNextAdjust(yearMonth);
    })
}

scheduleCronstyle();

// 员工、部门主管、经理获取消息列表
Router.post('/list', function (req, res) {
    const { userId } = req.body;

    // console.log('msg userId: ', userId);
    Message.queryDocs({ userId }).then(result => {
        return res.json(result);
    }).catch(err => {
        return res.send(err);
    })
})


// 发送消息
Router.post('/send', function (req, res) {
    const { userId, msg } = req.body;
    const docs = [{
        userId,
        ...msg
    }]

    Message.insertDocs(docs).then(result => {
        return res.json(result);
    }).catch(err => {
        console.log(err);
    })
})

module.exports = Router;
