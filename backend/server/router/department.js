const express = require('express');
const Router = express.Router();
const models = require('../dao/dao');
const Department = models.selectModel('department');
const User = models.selectModel('user');
const Depart = require('../model').getModel('department');

// 经理查询部门
Router.post('/list', function (req, res) {
    const body = req.body;
    const condition = {};
    if (body.departName)
        condition.departName = body.departName;
    Department.queryDocs(condition).then(result => {
        console.log(result);

        return res.json(result);

        // const users = result.list.map((user) => {
        //     return { userId: user.director };
        // });



        // User.queryDocs(users).then(userRes => {
        //     return res.json(userRes)
        // }).catch(err => {
        //     return res.send(err);
        // })
    }).catch(err => {
        console.log(err);
        return res.send(err);
    })
})

// 经理编辑部门
Router.post('/update', function (req, res) {
    const { _id, oldDepart, depart } = req.body;
    // const { _id } = depart;
    const condition = { _id };
    const settings = depart;
    // if (departName)
    //     settings = {
    //         departName,
    //         director
    //     }



    // console.log(oldDepart.director, depart.director)
    Department.updateDoc(condition, settings).then(result => {
        if (result.code !== 0)
            return result;
        User.updateDoc({ userId: oldDepart.director }, { type: 'employee' }).then(result2 => {
            User.updateDoc({ userId: depart.director }, { type: 'director' }).then(result3 => {
                if (result2.code !== 0 || result3.code !== 0)
                    return res.json({ code: 1 });
                return res.json(result3)
            }).catch(err => {
                console.log(err);
                return res.send(err);
            })
        }).catch(err => {
            console.log(err);
            return res.send(err);
        })
    }).catch(err => {
        return res.send(err);
    })


})

// 经理添加部门
Router.post('/insert', function (req, res) {
    const { depart, oldDepart } = req.body;

    const docs = depart;
    const oldDocs = oldDepart;

    Depart.create(docs, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: '后端出错了' });
        }
        return res.json({ code: 0, list: doc });
    })
})

// 删除所有与该部门相关的数据，需要删除多个文档中的相关数据
function deleteAllDepart(departName) {

    return true;
}

// 经理删除部门
Router.post('/delete', function (req, res) {
    const { _id, depart } = req.body;
    const { director, departName } = depart;
    // const docs = [{ departName }];

    Department.deleteDocs({ _id }).then(result => {
        if (result.code !== 0)
            return res.json(result);

        User.updateDoc({ userId: director }, { type: 'employee' }).then(result1 => {
            return res.json(result1);
        }).catch(err => {
            console.log(err);
            return res.send(err);
        })
        if (deleteAllDepart(departName))
            return res.json({ code: 0 });
    })
})

module.exports = Router;
