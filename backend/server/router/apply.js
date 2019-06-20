const express = require('express');
const Router = express.Router();
const dao = require('../dao/dao')
const Apply = dao.selectModel('apply');
const Department = dao.selectModel('department');
const Message = dao.selectModel('message');

const subPath = ['wait', 'pass', 'fail', 'all', 'list'];

// wait, pass, fail, all 员工端“我的申请”中的三个子页面的数据获取
// list 主管端和经理端的数据获取
for (let item of subPath) {
    Router.post(`/${item}`, function (req, res) {
        console.log(req.body)
        const body = req.body;
        const { userId } = body;
        let condition = {};      // 查询条件

        if (item === 'all') {
            condition = { userId };
        } else if (item === 'list') {
            console.log(body.month)
            if (body.month)
                condition.month = body.month;
            if (body.departName)    // 主管获取申请列表数据
                condition = {
                    ...condition,
                    departName: body.departName,
                    type: body.type
                };
            else                    // 经理获取申请列表数据
                condition = { type: body.type };
        } else {
            condition = {
                userId,
                state: item
            };
        }

        Apply.queryDocs(condition).then(result => {
            return res.json(result);
        }).catch(err => {
            return res.send(err);
        })
    })
}

// // 插入多个申请
// Router.post('/insert', function (req, res) {
//     const {applies} = req.body;
//     Apply.insertDocs(applies).then(result => {
//         return res.json(result);
//     }).catch(err => {
//         console.log(err);
//         return res.send(err);
//     })
// })

// 编辑申请
Router.post('/submit', function (req, res) {
    const apply = req.body;     // apply中包含userId

    Apply.insertDocs([{ ...apply }]).then(result => {
        // if (result.code !== 0)
        // return res.json(result);

        // 员工端提交申请成功后，系统向部门主管发送申请审批消息
        // console.log(apply);
        Department.queryDocs({ departName: apply.departName }).then(queryRes => {
            // console.log(queryRes);
            if (queryRes.code !== 0)
                return res.json(result);

            const directorId = queryRes.list[0].director;
            const messages = [{
                userId: directorId,
                sentTime: new Date(),
                type: 'wait',
                tag: '申请审批提醒',
                title: `请审批员工申请`,
                msg: '请审批员工申请'
            }]

            console.log(messages);
            Message.insertDocs(messages).then(insertRes => {
                console.log(insertRes);
                return res.json(result);
            }).catch(err => {
                console.log(err)
                return res.send(err);
            })
        }).catch(err => {
            return res.send(err);
        })

    }).catch(err => {
        return res.send(err);
    })
})

// 删除指定申请
Router.post('/delete', function (req, res) {
    const { _id } = req.body;
    console.log(_id)

    Apply.deleteDocs({ _id }).then(result => {
        return res.json(result);
    }).catch(err => {
        return res.send(err);
    })
})

/*****************
 * 接口变了！！！改一下微信小程序中的接口！！！
 * *****************/
// 更改申请状态
Router.post('/update', function (req, res) {
    const { _id, key, val } = req.body;
    // key的值及其含义：
    // isCancel：销假
    // isDelete：申请被拒绝之后的删除，并没有真正删除
    // state：部门主管端审批申请并修改申请状态，
    let condition = { _id };
    let setObject = { [key]: val };

    // console.log(body._id)

    Apply.updateDoc(condition, setObject).then(result => {
        return res.json(result);
    }).catch(err => {
        return res.send(err);
    })
})

module.exports = Router;
