function check(headers, checkHeaders) {
    // console.log('checkHeaders: ', checkHeaders);
    // console.log('headers: ', headers);
    if (headers.length !== checkHeaders.length)
        return false;
    const isEqual = checkHeaders.map((v, i) => {
        return v === headers[i];
    }).reduce((prev, next) => {
        return prev && next;
    })
    return isEqual;
}

module.exports = {
    check
}
