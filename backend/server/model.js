const DB_URL = 'mongodb://localhost:27017/sms';
const mongoose = require('mongoose');

// 利用mongoose连接到MongoDB
mongoose.connect(DB_URL);
mongoose.connection.on('connected', function () {
    console.log('mongo connect success')
})

// MongoDB数据库设计
const models = {
    // 部门集合
    department: {
        'departName': { 'type': String, 'require': true },      // 部门名称
        'workStatus': { 'type': String },                       // 工作状态
        'director': { 'type': String },                         // 部门主管工号，防止department和user无限大
        'allArrange': { 'type': Array },                        // 整体班次安排数组，以月份为单位，每个数组元素是一个arrange
        'isTemp': { 'type': String },                           // 是否临时调整? 1临时调整，0永久调整
    },
    // 用户集合
    user: {
        'userId': { 'type': String, 'require': true },  // 工号
        'phone': { 'type': String, 'require': true },   // 手机号
        'name': { 'type': String, 'require': true },    // 姓名
        'pwd': { 'type': String, 'require': true },     // 密码
        'identity': { 'type': String },                 // 身份：staff(员工), director(部门主管), manager(经理)
        'initPwd': { 'type': String },                  // 初始密码
        'departName': { 'type': String },               // 部门名称
        'address': { 'type': String },                  // 地址
        'gender': { 'type': String },                   // 性别
        'email': { 'type': String },                    // 邮箱
        'birthday': { 'type': Date },                   // 生日
        'wechat': { 'type': String },                   // 微信号
        'qq': { 'type': String },                       // QQ号
        'avatar': { 'type': String },                   // 头像URL
        'departName': { 'type': String },               // 部门
        'isRemind': { 'type': String }                  // 是否自动上下班提醒？0提醒，1不提醒
    },
    // 申请集合
    apply: {
        'departName': { 'type': String },
        'userId': { 'type': String },       // 员工对象
        'sentTime': { 'type': Date },       // 申请提交时间
        'startTime': { 'type': Date },      // 申请起始时间
        'endTime': { 'type': Date },        // 申请结束时间
        'status': { 'type': String },       // 申请性质：加班、事假、病假
        'reason': { 'type': String },       // 申请理由
        'state': { 'type': String }         // 申请状态：待审核wait、通过pass、未通过fail、销假
    },
    // 安排集合
    arrange: {
        'departName': { 'type': String },
        'userId': { 'type': String },       // 员工对象
        'onTime': { 'type': Date },         // 上班时间
        'offTime': { 'type': Date },        // 下班时间
        'type': { 'type': String },         // 安排性质：请假leave、加班extra、正常ordinary、临时加班temp
        'realOnTime': { 'type': Date },     // 实际上班时间
        'realOffTime': { 'type': Date },    // 实际下班时间
        'isTemp': { 'type': String }        // 是否临时调整？1临时调整，0永久调整
    },
    // 薪酬集合
    salary: {
        'departName': { 'type': String },
        'userId': { 'type': String },       // 员工对象
        'month': { 'type': Date },          // 年月
        'leaveDur': { 'type': Number },     // 请假时长，小时为单位
        'extraDur': { 'type': Number },     // 平时加班时长，小时
        'holidayDur': { 'type': Number },   // 节假日加班时长，小时
        'total': { 'type': Number }         // 薪酬总计
    },
    // 消息集合
    message: {
        'userId': { 'type': String },       // 工号
        'sentTime': { 'type': Date },       // 发送时间
        // 消息类型：
        // 员工端：上班提醒、下班提醒、申请通过、申请未通过、加班申请提醒、
        // 部门主管端：提交了申请、调整工作安排提醒
        'type': { 'type': String },
        'title': { 'type': String },        // 消息标题
        'msg': { 'type': String }           // 消息内容
    }
}

for (let i in models) {
    mongoose.model(i, new mongoose.Schema(models[i]))
}

module.exports = {
    getModel: function (name) {
        return mongoose.model(name);
    }
};
