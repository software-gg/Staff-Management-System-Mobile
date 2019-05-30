// 总体工作班次安排

const express = require('express');
const Router = express.Router();
const model = require('../model');
const AllArrange = model.getModel('allArrange');
const Arrange = model.getModel('arrange');

// 部门主管和经理：整体班次安排查询
Router.post('/list', function (req, res) {
    // 传入的参数：startDate, endDate, onTime, departName
    const { month } = req.body;
    let condition = {
        month
    };

    // 如果body中包含departName字段，则是部门主管进行的查询；否则为经理进行的查询
    if (body.departName) {
        condition.departName = body.departName;
    }

    AllArrange.find(condition, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: '后端出错了' });
        }

        return res.json({ code: 0, list: doc });
    })
})

// 更新和删除整体班次安排（编辑、安排员工），删除时将allArrange设置为空数组 []
Router.post('/update', function (req, res) {
    const body = req.body;
    const { _id, allArrange } = body;
    const { departName, previousId, isTemp, month, type, arrange } = allArrange;
    const { onTime, offTime, users } = arrange;

    const setObject = {
        previousId,
        isTemp,
        month,
        type,
        arrange
    };

    AllArrange.updateOne({ _id }, {
        $set: setObject
    }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: '后端出错了' });
        }

        if (doc) {
            // 整体班次安排调整之后，需要调整细致班次安排
            let updateList = users.map((user) => {
                return {
                    departName,
                    userId: user.userId,
                    location: '北京科技大学-机电信息楼',
                    onTime,
                    offTime,
                    type,
                    isTemp
                }
            });

            Arrange.insertMany(updateList, function (err, doc) {
                if (err) {
                    return res.json({ code: 1, msg: '后端出错了' });
                }

                return res.json({ code: 0 })
            });
        } else {
            return res.json({ code: 1, msg: '安排调整失败' });
        }
    });
})

module.exports = Router;
