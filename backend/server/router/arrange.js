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

// 部门主管和经理调整某个员工某个月的工作安排
Router.post('/update', function (req, res) {
    const { arrange } = req.body;
    const { _id, onTime, offTime, isTemp, type, state } = arrange;

    const condition = { _id };
    const settings = {
        onTime,
        offTime,
        isTemp,
        type,
        state
    }

    Arrange.updateDoc(condition, settings).then(result => {
        return res.json(result);
    }).catch(err => {
        return res.send(err);
    })
})

// 部门主管和经理添加细致班次安排
Router.post('/insert', function (req, res) {
    const { arrange } = req.body;

    Arrange.insertDocs([arrange]).then(result => {
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

// 下一个月临时调整和永久调整工作安排
Router.post('/nextmonth', function (req, res) {
    // month必须为Date类型！！！
    const { month, departName } = req.body;

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

    Arrange.queryDocs({ month, departName }).then(thismonthRes => {
        if (thismonthRes.code === 1 || thismonthRes.code === 0)
            return res.json({ code: 1, msg: '当月安排无需自动导入' });

        //当没有查到本月记录时，查询上个月的信息是否在数据库中
        // 获取上个月的日期
        let lastMonth = calLastMonth(month);

        Arrange.queryDocs({ month: lastMonth, departName }).then(lastmonthRes => {
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
})

module.exports = Router;
