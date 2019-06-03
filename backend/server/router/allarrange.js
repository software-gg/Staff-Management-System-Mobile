// 总体工作班次安排

const express = require('express');
const Router = express.Router();
const multer = require('multer');
const dao = require('../dao/dao');
const AllArrange = dao.selectModel('allArrange');
const Arrange = dao.selectModel('arrange');
const dateToName = require('../utils/date').dateToName;
const excelUtils = require('../utils/excel');
const allArrangeConfig = require('../config/excel').config['allArrange'];
const _filter = { _v: 0 };

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

    AllArrange.queryDocs(condition, _filter).then(result => {
        return res.json(result);
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

    AllArrange.updateDoc({ _id }, setObject).then(result => {
        if (result.code === 0) {
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

            Arrange.insertDocs(updateList).then(result => {
                return res.json(result);
            }).catch(err => {
                return res.send(err);
            })
        } else {
            return res.json({ code: 1, msg: '安排调整失败' });
        }
    })
})

// 部门主管和经理导出整体工作安排
Router.get('/export/:id', function (req, res) {
    const body = req.query;
    let condition = {};
    // console.log('arrangeConfig: ', arrangeConfig);
    let headers = allArrangeConfig.headers;
    let sheetName = allArrangeConfig.sheetName;

    // console.log('headers: ', headers);

    // 根据body中的key是否存在来确定查询条件
    if (body.department)
        condition.department = body.department;
    else
        /* 空语句 */;

    AllArrange.queryDocs(condition, _filter).then(result => {

        
        if (result.code === 2)
            return res.json({ code: 1, msg: '当前没有整体班次安排' });
        if (result.code === 1)
            return res.json(result);

        let data = result.list;

        var date = dateToName(new Date());
        var path = `public/doc/allarrange/${date}.xlsx`;

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
        cb(null, 'public/doc/allarrange')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const upload = multer({ storage });

// 部门主管和经理导入整体工作安排
Router.post('/import/:id', upload.single('allArrangeList'), function (req, res) {
    const file = req.file;
    let _headers = allArrangeConfig.headers.map(v => {
        return v.name;
    });

    // console.log(req.file);

    
    const excelResult = excelUtils.excelImports(file.path, _headers);
    if (excelResult.code !== 0)
        return res.json(excelResult);

    const data = excelResult.data;
    // 导入员工之前需要删除所有数据库中的员工
    AllArrange.deleteDocs({}).then(result => {
        if (result.code === 1)
            return res.json({ code: 1, msg: '导入失败' });

        AllArrange.insertDocs(data).then(result2 => {
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

module.exports = Router;
