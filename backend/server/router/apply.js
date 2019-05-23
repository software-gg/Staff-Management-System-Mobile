const express = require('express');
const Router = express.Router();
const model = require('../model');
const Apply = model.getModel('apply');

const subPath = ['wait', 'pass', 'fail', 'all'];

// 员工端“我的申请”中的三个子页面的数据获取
for (let item of subPath) {
    Router.post(`/${item}`, function (req, res) {
        const { userId } = req.body;
        // const { phone, id } = req.query;
        // const user = {
        //     "phone": "123456798731",
        //     "id": "41621302",
        //     "pwd": "12345",
        //     "initPwd": "123",
        //     "depart": {
        //         "departName": "产品部",
        //         "workStatus": "三班倒",
        //         "director": "41621320"
        //     }
        // };
        if (item === 'all') {
            Apply.find({
                userId,
            }, function (err, doc) {
                if (err) {
                    return res.json({ code: 1, msg: err })
                }
                return res.json({ code: 0, list: doc });
            })
        } else {
            Apply.find({
                userId,
                state: item
            }, function (err, doc) {
                if (err) {
                    return res.json({ code: 1, msg: err })
                }
                return res.json({ code: 0, list: doc });
            })
        }
    })
}

// 编辑申请
Router.post('/submit', function (req, res) {
    const apply = req.body;     // apply中包含userId
    Apply.create({
        ...apply
    }, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: err })
        }
        return res.json({ code: 0 });
    })
})

// 删除指定申请
Router.post('/delete', function (req, res) {
    const { _id } = req.body;
    console.log(_id)
    Apply.deleteOne({ _id }, function (err, doc) {
        console.log(doc);
        if (err) {
            return res.json({ code: 1, msg: err });
        }
        if (doc.deletedCount === 0) {
            return res.json({ code: 1, msg: '删除失败' });
        }
        return res.json({ code: 0 });
    })
})

// 更改申请状态
Router.post('/update', function (req, res) {
    const body = req.body;
    // console.log(body._id)
    if (body.isCancel) {
        Apply.updateOne({ _id: body._id }, { $set: { isCancel: body.isCancel } }, function (err, doc) {
            if (err) {
                return res.json({ code: 1, msg: err });
            }
            if (doc.nModified === 0) {
                return res.json({ code: 1, msg: '销假失败' })
            }
            return res.json({ code: 0 });
        })
    } else if (body.isDelete) {
        Apply.updateOne({ _id: body._id }, { $set: { isDelete: body.isDelete } }, function (err, doc) {
            if (err) {
                return res.json({ code: 1, msg: err })
            }
            if (doc.nModified === 0) {
                // console.log(doc);
                return res.json({ code: 1, msg: '删除失败' })
            }
            return res.json({ code: 0 });
        })
    }
})

module.exports = Router;
