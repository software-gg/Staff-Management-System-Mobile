const express = require('express');
const Router = express.Router();
const model = require('../model');
const Department = model.getModel('department');
const User = model.getModel('user');
const Apply = model.getModel('apply');
const Arrange = model.getModel('arrange');
const Message = model.getModel('message');
const Salary = model.getModel('salary');

// 创建用户数据
Router.get('/add', function (req, res) {
    Department.insertMany([
        {
            departName: '研发部',
            workStatus: '八小时',
            director: '41621328',
        }, {
            departName: '产品部',
            workStatus: '三班倒',
            director: '41621320',
        }
    ], function (err, doc) {

    })

    User.insertMany([
        {
            phone: '12345679876',
            userId: '41621328',
            name: 'ericao',
            pwd: '12345',
            initPwd: '123',
            departName: '研发部'
        }, {
            phone: '12345678952',
            userId: '41621320',
            name: 'tom',
            pwd: '12345',
            initPwd: '123',
            departName: '研发部'
        }, {
            phone: '12345679873',
            userId: '41621302',
            name: 'lily',
            pwd: '12345',
            initPwd: '123',
            departName: '产品部'
        }, {
            phone: '12345679874',
            userId: '41621303',
            name: 'tomas',
            pwd: '12345',
            initPwd: '123',
            departName: '产品部'
        }
    ], function (err, doc) {

    })

    Apply.insertMany([{
        userId: '41621302',
        sentTime: new Date('2019-04-01 09:00:00'),
        startTime: new Date('2019-04-01 09:00:00'),
        endTime: new Date('2019-04-01 17:00:00'),
        status: '病假',
        reason: '发烧感冒',
        state: 'wait'
    }, {
        userId: '41621303',
        sentTime: new Date('2019-05-02 09:00:00'),
        startTime: new Date('2019-05-02 09:00:00'),
        endTime: new Date('2019-05-02 17:00:00'),
        status: '病假',
        reason: '发烧感冒',
        state: 'wait'
    }, {
        userId: '41621302',
        sentTime: new Date('2019-05-01 09:00:00'),
        startTime: new Date('2019-05-01 09:00:00'),
        endTime: new Date('2019-05-01 17:00:00'),
        status: '病假',
        reason: '发烧感冒',
        state: 'pass'
    }, {
        userId: '41621302',
        sentTime: new Date('2019-05-03 09:00:00'),
        startTime: new Date('2019-05-05 09:00:00'),
        endTime: new Date('2019-05-05 17:00:00'),
        status: '病假',
        reason: '发烧感冒',
        state: 'fail'
    }], function (err, doc) {

    })

    Arrange.insertMany([
        {
            userId: '41621302',
            onTime: new Date('2019-05-01 09:00:00'),
            offTime: new Date('2019-05-01 17:00:00'),
            type: 'ordinary',
            isTemp: '0'
        }, {
            userId: '41621302',
            onTime: new Date('2019-05-01 09:00:00'),
            offTime: new Date('2019-05-01 17:00:00'),
            type: 'ordinary',
            isTemp: '0'
        }
    ], function (err, doc) {

    })

    Message.insertMany([
        {
            'userId': '41621302',
            'sentTime': new Date(),
            'type': 'on',
            'title': '上班提醒',
            'msg': '还有一小时就要上班了哦~'
        }
    ], function (err, doc) {

    })

    return res.json({ code: 0 });
})