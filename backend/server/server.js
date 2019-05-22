/*
    目前需要解决的问题：
    1. 如何在前后端使用cookie保存用户的登录信息；
    2. 如何将两个文档进行关联（类似于关系型数据库中的外键）
    3. 
*/


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const userRouter = require('./router/user');
const applyRouter = require('./router/apply');
const attendRouter = require('./router/attend');
const remindRouter = require('./router/remind');
const arrangeRouter = require('./router/arrange');
const msgRouter = require('./router/msg');

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/user', userRouter);
app.use('/apply', applyRouter);
app.use('/attend', attendRouter);
app.use('/remind', remindRouter);
app.use('/arrange', arrangeRouter);
app.use('/msg', msgRouter)


app.listen(9093, function() {
    console.log('Node app start at port 9093');
})
