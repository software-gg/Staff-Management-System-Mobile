const express = require('express');
const Router = express.Router();
const model = require('../model');
const Salary = model.getModel('salary');

// 部门主管和经理查询员工工资情况
Router.post('/list', function (req, res) {
    const body = req.body;
    const { month } = req.body;
    let condition = { month };
    
    // 如果body中包含departName字段，则说明是部门主管的查询
    if (body.departName) {
        condition.departName = body.departName;
    }

    Salary.find({
        departName,
        month
    }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: '后端出错了' });
        }

        return res.json({ code: 0, list: doc });
    })
})

module.exports = Router;
