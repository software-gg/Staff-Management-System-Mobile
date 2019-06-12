// 细致工作班次安排

const express = require('express');
const Router = express.Router();
const multer = require('multer');
const Arrange = require('../dao/dao').selectModel('arrange');
const dateUtils = require('../utils/date');
const { dateToName, calLastMonth } = dateUtils;
const arrangeConfig = require('../config/excel').config['arrange'];
const excelUtils = require('../utils/excel');
const _filter = { _v: 0 };


// 员工按天查询工作安排
Router.post('/list/user', function (req, res) {
    // 测试：userId = undefined时的情况？
    // startDate查询的起始年月日，endDate查询的结束年月日
    // 按月或按天查询均可调用startDate和endDate格式
    const { userId, startDate, endDate } = req.body;

    const condition = {
        userId,
        onTime: { $gte: new Date(startDate), $lt: new Date(endDate) }
    };

    Arrange.queryDocs(condition).then(result => {
        return res.json(result);
    }).catch(err => {
        return res.send(err);
    })
})

// 部门主管和经理查询工作安排
Router.post('/list/manager', function (req, res) {
    const body = req.body;
    const { month } = body;
    const condition = { month };
    if (body.departName)
        condition.departName = body.departName;

    Arrange.queryDocs(condition).then(result => {
        return res.json(result);
    }).catch(err => {
        return res.send(err);
    })
})

// 部门主管和经理调整某个员工某个月的工作安排
Router.post('/update', function (req, res) {
    const { arrange } = req.body;
    const { _id, userId, onTime, offTime, isTemp, type, state } = arrange;
    // console.log('arrange', arrange);

    const condition = { _id };
    const settings = {
        userId: userId || '',
        onTime: onTime || '',
        offTime: offTime || '',
        isTemp: isTemp || '',
        type: type || '',
        state: state || ''
    }

    console.log(settings);

    Arrange.updateDoc(condition, settings).then(result => {
        console.log('result: ', result);
        return res.json(result);
    }).catch(err => {
        return res.send(err);
    })
})

// 部门主管和经理添加细致班次安排
Router.post('/insert', function (req, res) {
    const { arrange } = req.body;

    Arrange.insertDocs(arrange).then(result => {
        console.log(result)
        return res.json(result);
    }).catch(err => {
        return res.send(err);
    })
})

// 部门主管和经理删除细致班次安排
Router.post('/delete', function (req, res) {
    const { _id } = req.body;
    const condition = { _id };
    Arrange.deleteDocs(condition).then(result => {
        return res.json(result);
    }).catch(err => {
        return res.send(err);
    })
})

// 部门主管和经理导出细致工作安排
Router.get('/export/:id', function (req, res) {
    const body = req.query;
    let condition = {};
    // console.log('arrangeConfig: ', arrangeConfig);
    let headers = arrangeConfig.headers;
    let sheetName = arrangeConfig.sheetName;

    // console.log('headers: ', headers);

    // 根据body中的key是否存在来确定查询条件
    if (body.department)
        condition.department = body.department;
    else
        /* 空语句 */;

    Arrange.queryDocs(condition, _filter).then(result => {


        if (result.code === 2)
            return res.json({ code: 1, msg: '当前没有细致班次安排' });
        if (result.code === 1)
            return res.json(result);

        let data = result.list;

        var date = dateToName(new Date());
        var path = `public/doc/arrange/${date}.xlsx`;

        console.log('arrange result: ', result);
        excelUtils.excelExports(sheetName, headers, data, path);
        res.download(path)

        // 导出 Excel
        // xlsx.writeFile(wb, 'output.xlsx');
        // res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
        // res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");
        // res.send(wb);

    }).catch(err => {
        res.send(err)
    })
})

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/doc/arrange')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const upload = multer({ storage });

// 部门主管和经理导入细致工作安排
Router.post('/import/:id', upload.single('arrangeList'), function (req, res) {
    const file = req.file;
    let _headers = arrangeConfig.headers.map(v => {
        return v.name;
    });


    // console.log(req.file);


    var upload = multer({ storage });

    /*
    *    有小问题：当删除和插入多个user成功之后，返回{}，而不是返回{code: 0}
    */
    // 导入员工之前需要删除所有数据库中的员工
    const excelResult = excelUtils.excelImports(file.path, _headers);
    if (excelResult.code !== 0)
        return res.json(excelResult);

    const data = excelResult.data;

    Arrange.deleteDocs({}).then(result => {
        if (result.code === 1)
            return res.json({ code: 1, msg: '导入失败' });

        Arrange.insertDocs(data).then(result2 => {
            console.log('result2:', result2);
            return res.json(result2);
        }).catch(err => {
            console.log(err);
            return res.json({ code: 1, msg: err });
        })

    }).catch(err => {
        console.log(err);
        return res.json({ code: 1, msg: err });
    })
})

// 临时调整和永久调整
Router.post('/adjust', function (req, res) {
    const { month, departName, isTemp } = req.body;

    Arrange.updateDocs({ month, departName }, { isTemp }).then(result => {
        return res.json(result);
    }).catch(err => {
        console.log(err);
    })
})

module.exports = Router;
