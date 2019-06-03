// 将本月日期调整为字符串格式：yyyymmddhhmmss + 3位随机数
function dateToName(dateObj) {
    let date = dateObj.toLocaleDateString();
    let time = dateObj.toLocaleTimeString();
    let dateTime = '';

    dateTime = date.split('-').reduce((prev, next) => {
        if (next.length === 1)
            return prev + '0' + next;
        return prev + next;
    });

    dateTime += time.split(':').reduce((prev, next) => {
        return prev + next;
    })

    dateTime += parseInt(Math.random() * 900 + 100);

    return dateTime;
}

// 根据本月日期month，计算上个月的日期lastMonth并返回
function calLastMonth(month) {
    const nowDate = new Date(month);
    const nowYear = nowDate.getFullYear();
    const nowMonth = nowDate.getMonth();
    const nowDay = nowDate.getDay();
    const nowTime = nowDate.getTime();
    let lastMonthString, lastMonth;
    let lastYear, lastMonth;
    lastYear = nowYear - 1;
    if (nowMonth === 1) {
        lastMonth = 12;
    } else {
        lastMonth = nowMonth - 1;
    }
    lastMonthString = `${lastYear}-${lastMonth}-${nowDay} ${nowTime}`;
    lastMonth = new Date(lastMonthString);

    return lastMonth;
}

module.exports = {
    dateToName,
    calLastMonth
}
