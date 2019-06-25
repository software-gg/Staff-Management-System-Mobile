const dao = require('../dao/dao');
const userDao = dao.selectModel('user');
const arrangeDao = dao.selectModel('arrange');
const allArrangeDao = dao.selectModel('allArrange');
const departmentDao = dao.selectModel('department');
const messageDao = dao.selectModel('message');
const applyDao = dao.selectModel('apply');

function deleteAllUserData(userId = '') {
    if (userId === '') 
        return false;
    console.log('userId:', userId);
    const condition = { userId };
    arrangeDao.deleteDocs(condition).then(res => {}).catch(err => {
        console.log(err);
    });
    allArrangeDao.deleteDocs(condition).then(res => {}).catch(err => {
        console.log(err);
    });
    departmentDao.deleteDocs(condition).then(res => {}).catch(err => {
        console.log(err);
    });
    messageDao.deleteDocs(condition).then(res => {}).catch(err => {
        console.log(err);
    });
    applyDao.deleteDocs(condition).then(res => {}).catch(err => {
        console.log(err);
    });
    return true;
}

function deleteAllDepartData(departName = '') {
    if (departName === '')
        return false;
    const condition = { departName };
    arrangeDao.deleteDocs(condition).then(res => {}).catch(err => {
        console.log(err);
    });
    allArrangeDao.deleteDocs(condition).then(res => {}).catch(err => {
        console.log(err);
    });
    userDao.deleteDocs(condition).then(res => {}).catch(err => {
        console.log(err);
    });
    messageDao.deleteDocs(condition).then(res => {}).catch(err => {
        console.log(err);
    });
    applyDao.deleteDocs(condition).then(res => {}).catch(err => {
        console.log(err);
    });
    return true;
}

module.exports = {
    deleteAllDepartData,
    deleteAllUserData
}
