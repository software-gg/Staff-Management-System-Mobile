const express = require('express');
const Router = express.Router();
const Salary = require('../dao/dao').selectModel('salary');

// 部门主管和经理查询员工工资情况
Router.post('/list', function (req, res) {
    const body = req.body;
    const { month } = req.body;
    let condition = { month };
    
    // 如果body中包含departName字段，则说明是部门主管的查询
    if (body.departName) {
        condition.departName = body.departName;
    }

    Salary.queryDocs(condition).then(result => {
        return res.json(result);
    })
})

module.exports = Router;
