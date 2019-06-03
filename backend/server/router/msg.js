const express = require('express');
const Router = express.Router();
const Message = require('../dao/dao').selectModel('message');

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
