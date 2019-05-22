const express = require('express');
const Router = express.Router();
const model = require('../model');
const Apply = model.getModel('apply');

const subPath = ['wait', 'pass', 'fail'];

// 员工端“我的申请”中的三个子页面的数据获取
for (let item of subPath) {
    Router.post(`/${item}`, function (req, res) {
        const { userId } = req.body;
        // const { phone, id } = req.query;
        // const user = {
        //     "phone": "123456798731",
        //     "id": "41621302",
        //     "pwd": "12345",
        //     "initPwd": "123",
        //     "depart": {
        //         "departName": "产品部",
        //         "workStatus": "三班倒",
        //         "director": "41621320"
        //     }
        // };
        Apply.find({
            userId,
            state: item
        }, function (err, doc) {
            if (err) {
                return res.json({ code: 1, msg: err })
            }
            return res.json({ code: 0, apply: doc });
        })
    })
}

// 编辑申请
Router.post('/apply', function (req, res) {
    const { apply } = req.body;     // apply中包含userId
    Apply.create({
        ...apply
    }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: err })
        }
        return res.json({ code: 0 });
    })
})

module.exports = Router;
