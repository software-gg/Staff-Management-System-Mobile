const DB_URL = 'mongodb://localhost:27017/sms';
const mongoose = require('mongoose');

// 利用mongoose连接到MongoDB
mongoose.connect(DB_URL, { useNewUrlParser: true });
mongoose.connection.on('connected', function () {
    console.log('mongo connect success')
})

// MongoDB数据库设计
const models = {
    // 部门集合
    department: {
        'departName': { 'type': 'String', 'require': true },      // 部门名称
        // 'workStatus': { 'type': 'String' },                       // 工作状态
        'director': { 'type': 'String' },                         // 部门主管工号，防止department和user无限大
    },
    // 用户集合
    user: {
        'userId': { 'type': 'String', 'require': true },  // 工号
        'phone': { 'type': 'String', 'require': true },   // 手机号
        'name': { 'type': 'String', 'require': true },    // 姓名
        'pwd': { 'type': 'String', 'require': true },     // 密码
        'type': { 'type': 'String' },                 // 身份：staff(员工), director(部门主管), manager(经理)
        'initPwd': { 'type': 'String' },                  // 初始密码
        'departName': { 'type': 'String' },               // 部门名称
        'address': { 'type': 'String' },                  // 地址
        'gender': { 'type': 'String' },                   // 性别
        'email': { 'type': 'String' },                    // 邮箱
        'birthday': { 'type': 'Date' },                   // 生日
        'wechat': { 'type': 'String' },                   // 微信号
        'qq': { 'type': 'String' },                       // QQ号
        'avatar': { 'type': 'String' },                   // 头像URL
        'isRemind': { 'type': 'Number' }                  // 是否自动上下班提醒？0提醒，1不提醒
    },
    // 申请集合
    // 点击取消申请时，系统会将数据库中的对应申请项删除；
    // 点击销假时，系统会将isCancel字段置为 1
    // 点击删除时，系统会将isDelete字段置为 1
    apply: {
        'departName': { 'type': 'String' },   // 部门名
        'month': { 'type': 'String' },            // 年月
        'userId': { 'type': 'String' },       // 员工对象
        'sentTime': { 'type': 'Date' },       // 申请提交时间
        'startTime': { 'type': 'Date' },      // 申请起始时间
        'endTime': { 'type': 'Date' },        // 申请结束时间
        'type': { 'type': 'String' },       // 申请性质：加班、事假、病假
        'reason': { 'type': 'String' },       // 申请理由
        'state': { 'type': 'String' },        // 申请状态：待审核wait、通过pass、未通过fail、销假
        'isCancel': { 'type': 'Number' },     // 是否已经销假？1销假，0未销假
        'isDelete': { 'type': 'Number' }      // 员工端是否被删除？1删除，0未删除
    },
    // 整体班次安排集合
    allArrange: {
        'departName': { 'type': 'String', 'require': true },  // 部门名称
        // 上一个月所遵循的年月。
        // 如果为临时调整，则当前月的previousId的值为上一个月的previousId；
        // 永久调整时将当前月的_id赋值给当前月的previousId
        'previousId': { 'type': 'Number' },
        'month': { 'type': 'String' },                          // 当前年月
        'type': { 'type': 'String' },                         // 当前月的工作方式
        'isTemp': { 'type': 'Number' },        // 是否临时调整？1临时调整，0永久调整
        'onTime': { 'type': 'Date' },        // 是否临时调整？1临时调整，0永久调整
        'offTime': { 'type': 'Date' },        // 是否临时调整？1临时调整，0永久调整
        'users': { 'type': 'Array' }
        // arrange数组元素结构：
        /*
        {
            onTime: onTime,
            offTime: offTime,
            users: [一堆userId]
        }
        */
    },
    // 细致班次安排集合
    arrange: {
        'allId': {'type': 'String'},          // allId整体班次安排的id
        'departName': { 'type': 'String' },   // 部门名
        'userId': { 'type': 'String' },       // 员工对象
        'location': { 'type': 'String' },     // 打卡地点
        'month': { 'type': 'String' },            // 当月日期
        'onTime': { 'type': 'Date' },         // 上班时间
        'offTime': { 'type': 'Date' },        // 下班时间
        'type': { 'type': 'String' },         // 安排性质：请假leave、加班extra、正常ordinary、临时加班temp
        'state': { 'type': 'String' },        // 打卡状态：正常off、迟到late、早退early、可申请加班extra
        'realOnTime': { 'type': 'Date' },     // 实际上班时间
        'realOffTime': { 'type': 'Date' },    // 实际下班时间
        // 上一个月所遵循的年月。
        // 如果为临时调整，则当前月的previousId的值为上一个月的previousId；
        // 永久调整时将当前月的_id赋值给当前月的previousId
        'previousId': { 'type': 'Number' },
        'isTemp': { 'type': 'Number' }        // 是否临时调整？1临时调整，0永久调整
    },
    // 薪酬集合
    salary: {
        'departName': { 'type': 'String' },   // 部门名
        'userId': { 'type': 'String' },       // 员工对象
        'month': { 'type': 'String' },          // 年月
        'leaveDur': { 'type': 'Number' },     // 请假时长，小时为单位
        'extraDur': { 'type': 'Number' },     // 平时加班时长，小时
        'holidayDur': { 'type': 'Number' },   // 节假日加班时长，小时
        'total': { 'type': 'Number' }         // 薪酬总计
    },
    // 消息集合
    message: {
        'userId': { 'type': 'String' },       // 工号
        'sentTime': { 'type': 'Date' },       // 发送时间
        // 消息类型：
        // 员工端：上班提醒on、下班提醒off、申请通过pass、申请未通过unpass、加班申请提醒extra、
        // 部门主管端：提交了申请wait、调整工作安排提醒adjust
        'type': { 'type': 'String' },         // 消息类型
        'tag': { 'type': 'String' },          // 【】中的内容
        'title': { 'type': 'String' },        // 消息标题
        'msg': { 'type': 'String' }           // 消息内容
    }
}

for (let i in models) {
    mongoose.model(i, new mongoose.Schema(models[i]))
}

module.exports = {
    models,
    getModel: function (name) {
        return mongoose.model(name);
    }
};
