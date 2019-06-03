const model = require('../model');
const models = model.models;

const config = {
    user: {
        sheetName: '员工信息表',
        headers: Object.keys(models.user).map(item => {
            return {
                name: item,
                type: models.user[item].type
            };
        })
    },
    arrange: {
        sheetName: '细致班次安排表',
        headers: Object.keys(models.arrange).map(item => {
            return {
                name: item,
                type: models.arrange[item].type
            };
        })
    },
    allArrange: {
        sheetName: '整体班次安排',
        headers: Object.keys(models.allArrange).map(item => {
            return {
                name: item,
                type: models.allArrange[item].type
            };
        })
    }
};

module.exports = {
    config
}
