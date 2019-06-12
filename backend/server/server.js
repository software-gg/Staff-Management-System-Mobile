/*
    目前需要解决的问题：
    1. 如何将两个文档进行关联（类似于关系型数据库中的外键）
*/


const express = require('express');
const app = express();
// var port = normalizePort(process.env.PORT || '9093');
// 解析post请求和cookie
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// 文件上传和下载模块
const multer = require('multer');

// socket.io实时通信模块
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log('socket.io has been connected');
})

// const publicRouter = require('./router/public');
const userRouter = require('./router/user');
const applyRouter = require('./router/apply');
const attendRouter = require('./router/attend');
const remindRouter = require('./router/remind');
const arrangeRouter = require('./router/arrange');
const allArrangeRouter = require('./router/allarrange');
const salaryRouter = require('./router/salary');
const msgRouter = require('./router/msg');
const departRouter = require('./router/department');

const fs = require('fs');


// 写文件的方法一
// app.get('/write', function (req, res) {
//     var jpg = fs.readFileSync('./public/img/sky.jpg')
//     fs.writeFile('sky.jpg', jpg, function (err) {
//         if (err)
//             res.json({ code: 1, msg: err })
//         console.log('File Saved!');
//     })
//     res.status(200).json({ code: 0 })
// })

// const fs = require('fs');
// const http = require('http');
// const https = require('https');
// const PORT = 9093;
// const privateKey = fs.readFileSync('./path/to/private.pem', 'utf8');
// const certificate = fs.readFileSync('./path/to/file.crt', 'utf8');
// const credentials = { key: privateKey, cert: certificate };
// const SSLPORT = 9094;
// const httpsServer = https.createServer(credentials, app);
// const httpServer = http.createServer(app);

// httpServer.listen(PORT, function () {
//     console.log('Node app start at port 9093');
// })
// httpsServer.listen(SSLPORT, function () {
//     console.log('Node app start at port 9094');
// })
// app.js

// 允许跨域访问
app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",' 3.2.1')  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next();  
});

app.use(bodyParser.json());
app.use(cookieParser());
// 请求静态资源
app.use('/static', express.static('public'));

app.get('/', function (req, res) {
    console.log(req.protocol)
    if (req.protocol === 'https') {
        res.status(200).send('Welcome to Safety Land!')
    } else {
        res.status(200).send('Welcome to localhost:9093!')
    }
})

// app.use('/public', publicRouter);
app.use('/user', userRouter);
app.use('/apply', applyRouter);
app.use('/attend', attendRouter);
app.use('/remind', remindRouter);
app.use('/allarrange', allArrangeRouter);
app.use('/arrange', arrangeRouter);
app.use('/salary', salaryRouter);
app.use('/msg', msgRouter);
app.use('/department', departRouter);


server.listen(9093, function () {
    console.log('Node app start at port 9093');
})

// Test
// const excelUtils = require('./utils/excel');
// const excelImports = excelUtils.excelImports;
// excelImports();
