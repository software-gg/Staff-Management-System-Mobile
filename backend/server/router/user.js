// router: /user

const express = require('express');
const Router = express.Router();
const utils = require('utility');
const excelUtils = require('../utils/excel');
const userConfig = require('../config/excel').config['user'];
const dateToName = require('../utils/date').dateToName;
const multer = require('multer');
const userDao = require('../dao/dao').selectModel('user');
const _filter = {  _v: 0 };
// const deleteAllUserData = require('./deleteall').deleteAllUserData;

// 数据库中的pwd和_v不显示在doc
// const _filter = { pwd: 0, _v: 0 };

// MD5加密密码
function md5pwd(pwd) {
    const salt = "ew98fhewfi@#~!@dfDSdsf";
    return utils.md5(utils.md5(salt + pwd));
}

/*****************
 * 接口变了！！！改一下微信小程序中的接口！！！
 * *****************/
// 员工、部门主管、经理获取单个用户信息
Router.get('/list', function (req, res) {
    const body = req.query;
    // console.log(body);
    let condition = {};


    if (body.userId) {
        // 员工的查询条件
        condition.userId = body.userId;
    } else if (body.departName) {
        // 部门主管的查询条件
        condition.departName = body.departName;
    } else {
        // 经理的查询条件为空
        ;
    }

    userDao.queryDocs(condition, _filter).then(result => {
        return res.json(result);
    }).catch(err => {
        console.error(err);
        return res.send(err);
    })
})

Router.post('/getuser', function (req, res) {
    const { _id } = req.body;

    userDao.queryDocs({ _id }, _filter).then(result => {
        if (result.code !== 0)
            return res.json(result);
        return res.json({ code: 0, list: result.list[0] })
    }).catch(err => {
        console.error(err);
        return res.send(err);
    })
})

// 员工、部门主管、经理登录
Router.post('/login', function (req, res) {
    // req.query: 解析URL中?后面的属性
    // req.body：解析post的属性（需要用到body-parser插件
    // req.params：解析在前端通过get传输到后端的参数
    const { userId, pwd } = req.body;
    const condition = { userId, pwd };
    if (req.body.type)
        condition.type = req.body.type;
    if (req.body.phone) {
        condition.type = "employee";
        condition.phone = req.body.phone;
    }

    // console.log(req.body)

    userDao.queryDocs(condition, _filter).then(result => {
        // console.log('query Result: ', result);
        if (result.code === 2)
            return res.json({ code: 1, msg: '登录信息或密码错误' });
        if (result.code === 1)
            return res.json(result);
        if (result.list.length !== 1)
            return res.json({ code: 1, msg: '查到多个用户！登陆失败' });

        // console.log('query Result before: ', result);
        if (result.code === 0)
            res.cookie('userid', result.list[0]._id);
        // console.log('query Result: ', result);
        return res.json({ code: 0, list: result.list[0] });
    }).catch(err => {
        return res.send(err);
    })
})

// 员工编辑个人信息
Router.post('/changeInfo', function (req, res) {
    // const { phone, id, name } = req.query;    // user
    const user = req.body;
    const { userId } = req.body;    // user

    userDao.updateDoc({ userId }, { ...user }).then(result => {
        if (result.code === 2)
            return res.json({ code: 1, msg: '个人信息未修改' });
        return res.json(result);
    }).catch(err => {
        return res.send(err);
    })
})

Router.post('/update', function (req, res) {
    const { _id, userInfo } = req.body;

    userDao.updateDoc({ _id }, userInfo).then(result => {
        if (result.code === 2)
            return res.json({ code: 1, msg: '个人信息未修改' });
        return res.json(result);
    }).catch(err => {
        return res.send(err);
    })
})

// 员工修改密码
Router.post('/changePwd', function (req, res) {
    const { userId, pwd, newPwd } = req.body;

    userDao.updateDoc({ userId, pwd }, { pwd: newPwd }).then(result => {
        if (result.code === 2)
            return res.json({ code: 1, msg: '密码修改失败' });
        return res.json(result);
    }).catch(err => {
        return res.send(err);
    })
})

// 部门主管和经理插入多个员工
Router.post('/insert', function (req, res) {
    const { users } = req.body;

    userDao.insertDocs(users).then(result => {
        return res.json(result);
    }).catch(err => {
        return res.send(err);
    })
})

// 删除所有与该员工相关的数据
// function deleteAllData(userId = '') {

//     return true;
// }

// 经理删除一个员工
Router.post('/delete', function (req, res) {
    const body = req.body;
    let condition = {};
    let delCond = {}

    if (body._id) {
        condition._id = body._id;
        delCond.userId = body.userId;
    }
        

    userDao.deleteDocs(condition).then(result => {
        if (result.code !== 0)
            return res.json(result);

        // if (deleteAllUserData(delCond))
            return res.json({ code: 0 });
    }).catch(err => {
        console.log(err);
        return res.json({ code: 1, msg: err });
    })
})

// 导出员工
Router.get('/export/:id', function (req, res, next) {
    const body = req.query;
    let condition = {};
    let headers = userConfig.headers;
    let sheetName = userConfig.sheetName;

    // console.log('headers: ', headers);

    // 根据body中的key是否存在来确定查询条件
    if (body.departName)
        condition.departName = body.departName;
    else
        /* 空语句 */;

    userDao.queryDocs(condition, _filter).then(result => {

        if (result.code === 2)
            return res.json({ code: 1, msg: '当前没有用户' });
        if (result.code === 1)
            return res.json(result);

        let data = result.list;

        var date = dateToName(new Date());
        var path = `public/doc/user/${date}.xlsx`;

        // console.log(headers);
        // console.log(data);

        excelUtils.excelExports(sheetName, headers, data, path);
        res.download(path, (err) => {
            console.log(err);
        })

        // return res.json({ code: 0, path: path })

        // 导出 Excel
        // xlsx.writeFile(wb, `${date}.xlsx`);
        // res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
        // res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");
        // res.send(wb);

    }).catch(err => {
        console.log(err);
        return res.json({ code: 1, msg: err });
    })
});


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/doc/user')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const upload = multer({ storage });

// 导入员工
// upload.single()的参数即为前端对应的name属性的值
Router.post('/import/:id', upload.single('userList'), function (req, res) {
    if (!req.file)
        return res.send('请选择一个文件')
    const file = req.file;
    let _headers = userConfig.headers.map(v => {
        return v.name;
    });


    // var upload = multer({ storage });

    /*
    *    有小问题：当删除和插入多个user成功之后，返回{}，而不是返回{code: 0}
    */
    // 导入员工之前需要删除所有数据库中的员工
    const excelResult = excelUtils.excelImports(file.path, _headers);
    if (excelResult.code !== 0)
        return res.send(excelResult.msg);

    const data = excelResult.data;

    let condition = {}
    if (req.body.departName)
        condition.departName = req.body.departName;

    userDao.deleteDocs(condition).then(result => {
        if (result.code !== 0)
            return res.json({ code: 1, msg: '导入失败' });


        // console.log(data[0]);

        userDao.insertDocs(data).then(result2 => {
            // console.log('result2:', result2);
            // window.location.href='http://localhost:3000/employee/list'
            return res.send("导入成功！")
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
